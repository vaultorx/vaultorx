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

    const { amount, currency = "ETH", transactionHash } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount", success: false },
        { status: 400 }
      );
    }

    if (!transactionHash) {
      return NextResponse.json(
        { error: "Transaction hash is required", success: false },
        { status: 400 }
      );
    }

    // Check if transaction hash already exists
    const existingDeposit = await prisma.depositRequest.findUnique({
      where: { transactionHash },
    });

    if (existingDeposit) {
      return NextResponse.json(
        { error: "Transaction hash already exists", success: false },
        { status: 400 }
      );
    }

    // Create deposit request (pending admin approval)
    const depositRequest = await prisma.depositRequest.create({
      data: {
        userId: user.id,
        amount,
        currency,
        transactionHash,
        status: "pending",
      },
    });

    // Create pending transaction record
    const transaction = await prisma.transaction.create({
      data: {
        transactionHash: transactionHash,
        nftItemId: "deposit_only",
        toUserId: user.id,
        transactionType: "deposit",
        price: amount,
        currency,
        status: "pending",
        nftName: `${currency} Deposit`,
        to: user.username || user.email,
      },
    });

    return NextResponse.json({
      data: {
        depositRequest,
        transaction,
      },
      message: "Deposit request submitted for approval",
      success: true,
    });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { error: "Failed to process deposit request", success: false },
      { status: 500 }
    );
  }
}
