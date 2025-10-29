import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { WithdrawalStatus } from "@/lib/generated/prisma";
import { EmailService } from "@/lib/emails/email-service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      amount,
      currency,
      destinationNetwork,
      destinationAddress,
      verificationCode,
      useWhitelisted,
      withdrawalFee,
    } = await request.json();

    // Validate required fields
    if (
      !amount ||
      !destinationNetwork ||
      !destinationAddress ||
      !verificationCode
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user has configured seed phrase
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        externalWalletConfigured: true,
        walletBalance: true,
      },
    });

    if (!user?.externalWalletConfigured) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please configure your external wallet seed phrase in settings before making withdrawals",
        },
        { status: 400 }
      );
    }

    // Check if user has sufficient balance
    const totalAmount = amount + withdrawalFee;
    if (user.walletBalance < totalAmount) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient balance including withdrawal fee",
        },
        { status: 400 }
      );
    }

    // Verify whitelisted address if used
    if (useWhitelisted) {
      const whitelisted = await prisma.whitelistedAddress.findFirst({
        where: {
          userId: session.user.id,
          address: destinationAddress,
          OR: [{ lockUntil: null }, { lockUntil: { lt: new Date() } }],
        },
      });

      if (!whitelisted) {
        return NextResponse.json(
          { success: false, error: "Address not whitelisted or still locked" },
          { status: 400 }
        );
      }
    }

    const isCodeValid = await verifyVerificationCode(
      session.user.id,
      verificationCode
    );

    if (!isCodeValid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Create withdrawal request for funds
    const withdrawalRequest = await prisma.withdrawalRequest.create({
      data: {
        userId: session.user.id,
        destinationAddress,
        destinationNetwork,
        verificationCode,
        status: WithdrawalStatus.pending,
        withdrawalFee,
        // Note: nftItemId is not required for fund withdrawals
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Update user wallet balance
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        walletBalance: {
          decrement: totalAmount,
        },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        transactionHash: `withdrawal_${withdrawalRequest.id}`,
        fromUserId: session.user.id,
        transactionType: "withdrawal",
        price: amount,
        currency,
        gasFee: withdrawalFee,
        blockchain: destinationNetwork,
        status: "pending",
        nftName: `Fund Withdrawal - ${amount} ${currency}`,
        from: session.user.email,
        to: destinationAddress,
      },
    });

    // TODO: Send notification to admin

    // After successful withdrawal, send confirmation email
    await EmailService.sendWithdrawalConfirmationEmail(
      session.user.email,
      amount,
      currency,
      destinationAddress,
      session?.user?.name  || "User"
    );

    return NextResponse.json({
      success: true,
      data: { withdrawalRequest },
    });
  } catch (error) {
    console.error("Withdrawal creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const where = {
      userId: session.user.id,
      ...(status && { status: status.toUpperCase() as WithdrawalStatus }),
    };

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawalRequest.findMany({
        where,
        include: {
          nftItem: {
            include: {
              collection: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.withdrawalRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        withdrawals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Withdrawal fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

const verifyVerificationCode = async (
  userId: string,
  code: string
): Promise<boolean> => {
  try {
    const verification = await prisma.verificationToken.findFirst({
      where: {
        identifier: `withdrawal-${userId}`,
        token: code,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      return false;
    }

    // Delete the used verification code
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: `withdrawal-${userId}`,
          token: code,
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Error verifying code:", error);
    return false;
  }
};
