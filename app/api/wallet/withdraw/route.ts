import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    const {
      amount,
      currency = "ETH",
      destinationAddress,
      destinationNetwork,
    } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount", success: false },
        { status: 400 }
      );
    }

    if (user.walletBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance", success: false },
        { status: 400 }
      );
    }

    if (!destinationAddress) {
      return NextResponse.json(
        { error: "Destination address is required", success: false },
        { status: 400 }
      );
    }

    // Calculate withdrawal fee (1% of amount)
    const withdrawalFee = amount * 0.01;
    const netAmount = amount - withdrawalFee;

    // Update user wallet balance
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        walletBalance: { decrement: amount },
      },
    });

    // Create withdrawal request
    const withdrawalRequest = await prisma.withdrawalRequest.create({
      data: {
        userId: user.id,
        nftItemId: "withdrawal_only", // Special ID for withdrawal transactions
        destinationAddress,
        destinationNetwork: destinationNetwork || "ethereum",
        withdrawalFee,
        verificationCode: Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase(),
        status: "pending",
      },
    });

    // Create withdrawal transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionHash: `withdrawal_${Date.now()}_${user.id}`,
        nftItemId: "withdrawal_only",
        fromUserId: user.id,
        transactionType: "withdrawal",
        price: amount,
        currency,
        gasFee: withdrawalFee,
        status: "pending",
        nftName: "Crypto Withdrawal",
        from: user.username || user.email,
        to: destinationAddress,
      },
    });

    return NextResponse.json({
      data: {
        newBalance: updatedUser.walletBalance,
        withdrawalRequest,
        transaction,
        netAmount,
        fee: withdrawalFee,
      },
      message: "Withdrawal request submitted",
      success: true,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { error: "Failed to process withdrawal", success: false },
      { status: 500 }
    );
  }
}
