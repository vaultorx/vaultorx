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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { error: "Admin access required", success: false },
        { status: 403 }
      );
    }

    const { depositId } = await request.json();

    if (!depositId) {
      return NextResponse.json(
        { error: "Deposit ID is required", success: false },
        { status: 400 }
      );
    }

    // Update deposit request status
    const depositRequest = await prisma.depositRequest.update({
      where: { id: depositId },
      data: {
        status: "approved",
        approvedAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    // Update user wallet balance
    const updatedUser = await prisma.user.update({
      where: { id: depositRequest.userId },
      data: {
        walletBalance: { increment: depositRequest.amount },
      },
    });

    // Update transaction status
    await prisma.transaction.updateMany({
      where: { transactionHash: depositRequest.transactionHash as any},
      data: {
        status: "completed",
        confirmedAt: new Date(),
      },
    });

    // Mark deposit as completed
    await prisma.depositRequest.update({
      where: { id: depositId },
      data: {
        status: "completed",
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      data: {
        depositRequest,
        newBalance: updatedUser.walletBalance,
      },
      message: "Deposit approved successfully",
      success: true,
    });
  } catch (error) {
    console.error("Deposit approval error:", error);
    return NextResponse.json(
      { error: "Failed to approve deposit", success: false },
      { status: 500 }
    );
  }
}
