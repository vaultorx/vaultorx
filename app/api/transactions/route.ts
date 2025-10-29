import { TransactionStatus, TransactionType } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause for filtering
    const where: any = {};

    if (type && type !== "all") {
      // Map string values to Prisma enum values
      const typeMap: Record<string, TransactionType> = {
        purchase: TransactionType.purchase,
        sale: TransactionType.sale,
        transfer: TransactionType.transfer,
        mint: TransactionType.mint,
        deposit: TransactionType.deposit,
        withdrawal: TransactionType.withdrawal,
      };

      if (typeMap[type]) {
        where.transactionType = typeMap[type];
      }
    }

    if (status && status !== "all") {
      // Map string values to Prisma enum values
      const statusMap: Record<string, TransactionStatus> = {
        pending: TransactionStatus.pending,
        completed: TransactionStatus.completed,
        confirmed: TransactionStatus.confirmed,
        failed: TransactionStatus.failed,
      };

      if (statusMap[status]) {
        where.status = statusMap[status];
      }
    }

    if (search) {
      where.OR = [
        { transactionHash: { contains: search, mode: "insensitive" } },
        { nftName: { contains: search, mode: "insensitive" } },
        { from: { contains: search, mode: "insensitive" } },
        { to: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get transactions with related data
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        nftItem: {
          select: {
            name: true,
            image: true,
            collection: {
              select: {
                name: true,
              },
            },
          },
        },
        fromUser: {
          select: {
            username: true,
            name: true,
          },
        },
        toUser: {
          select: {
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.transaction.count({ where });

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
