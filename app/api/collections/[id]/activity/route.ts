import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    // Validate collection exists
    const collection = await prisma.collection.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found", success: false },
        { status: 404 }
      );
    }

    // Get transactions for this collection's NFTs
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          nftItem: {
            collectionId: id,
          },
        },
        include: {
          nftItem: {
            select: {
              id: true,
              name: true,
              tokenId: true,
              collection: {
                select: {
                  name: true,
                },
              },
            },
          },
          fromUser: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
          toUser: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: {
          nftItem: {
            collectionId: id,
          },
        },
      }),
    ]);

    // Format activities
    const activities = transactions.map((transaction) => {
      let type: "sale" | "transfer" | "list" | "mint" = "transfer";

      if (
        transaction.transactionType === "sale" ||
        transaction.transactionType === "purchase"
      ) {
        type = "sale";
      } else if (transaction.transactionType === "mint") {
        type = "mint";
      } else if (transaction.transactionType === "transfer") {
        type = "transfer";
      }

      return {
        id: transaction.id,
        type,
        nftName: transaction.nftItem.name,
        price: transaction.price,
        from:
          transaction.fromUser?.username ||
          transaction.fromUser?.name ||
          transaction.from,
        to:
          transaction.toUser?.username ||
          transaction.toUser?.name ||
          transaction.to,
        txHash: transaction.transactionHash,
        timestamp: transaction.createdAt,
        nftId: transaction.nftItem.id,
      };
    });

    return NextResponse.json({
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error("Collection activity fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection activity", success: false },
      { status: 500 }
    );
  }
}
