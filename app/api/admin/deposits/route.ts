import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { DepositStatus } from "@/lib/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    const where = status ? { status: status.toUpperCase() as DepositStatus} : {};

    const [deposits, total] = await Promise.all([
      prisma.depositRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              walletBalance: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.depositRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        deposits,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin deposits fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, status, adminNotes } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID and status are required" },
        { status: 400 }
      );
    }

    const deposit = await prisma.depositRequest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!deposit) {
      return NextResponse.json(
        { success: false, error: "Deposit request not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      status,
      ...(adminNotes && { adminNotes }),
    };

    if (status === "approved" || status === "completed") {
      updateData.approvedAt = new Date();

      if (status === "completed") {
        updateData.processedAt = new Date();

        // Update user wallet balance
        await prisma.user.update({
          where: { id: deposit.userId },
          data: {
            walletBalance: {
              increment: deposit.amount,
            },
          },
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            transactionHash: deposit.transactionHash || `deposit_${deposit.id}`,
            fromUserId: deposit.userId,
            transactionType: "deposit",
            price: deposit.amount,
            currency: deposit.currency,
            status: "completed",
            nftName: `Deposit - ${deposit.amount} ${deposit.currency}`,
            from: "External",
            to: deposit.user.email,
          },
        });
      }
    }

    const updatedDeposit = await prisma.depositRequest.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            walletBalance: true,
          },
        },
      },
    });

    // TODO: Send notification to user about status update

    return NextResponse.json({
      success: true,
      data: { deposit: updatedDeposit },
    });
  } catch (error) {
    console.error("Admin deposit update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
