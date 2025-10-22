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

    const { amount, currency = "ETH" } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount", success: false },
        { status: 400 }
      );
    }

    // Update user wallet balance
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        walletBalance: { increment: amount },
      },
    });

    // Create deposit transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionHash: `deposit_${Date.now()}_${user.id}`,
        nftItemId: "deposit_only", // Special ID for deposit transactions
        toUserId: user.id,
        transactionType: "deposit",
        price: amount,
        currency,
        status: "completed",
        nftName: "Crypto Deposit",
        to: user.username || user.email,
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json({
      data: {
        newBalance: updatedUser.walletBalance,
        transaction,
      },
      message: "Deposit successful",
      success: true,
    });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { error: "Failed to process deposit", success: false },
      { status: 500 }
    );
  }
}
