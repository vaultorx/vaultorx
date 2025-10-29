import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { WithdrawalStatus } from "@/lib/generated/prisma";

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

    const where = status
      ? { status: status.toUpperCase() as WithdrawalStatus }
      : {};

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawalRequest.findMany({
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
    console.error("Admin withdrawals fetch error:", error);
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

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: {
        user: true,
        nftItem: true,
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      status,
    };

    if (status === "completed") {
      updateData.completedAt = new Date();

      if (withdrawal.nftItemId) {
        // Transfer NFT ownership (in your system, this might mean marking it as withdrawn)
        // This depends on how you handle NFT custody
        await prisma.nFTItem.update({
          where: { id: withdrawal.nftItemId },
          data: {
            ownerId: "withdrawn", // Or whatever logic you use for withdrawn NFTs
            isListed: false,
          },
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            transactionHash: `withdrawal_${withdrawal.id}`,
            nftItemId: withdrawal.nftItemId,
            fromUserId: withdrawal.userId,
            transactionType: "withdrawal",
            status: "completed",
            nftName: withdrawal?.nftItem?.name || undefined,
            from: withdrawal.user.email,
            to: withdrawal.destinationAddress,
          },
        });
      }
    }

    const updatedWithdrawal = await prisma.withdrawalRequest.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        nftItem: {
          include: {
            collection: true,
          },
        },
      },
    });

    // TODO: Send notification to user about status update

    return NextResponse.json({
      success: true,
      data: { withdrawal: updatedWithdrawal },
    });
  } catch (error) {
    console.error("Admin withdrawal update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
