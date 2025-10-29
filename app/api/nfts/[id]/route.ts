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

    // Validate UUID format
    if (
      !id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    ) {
      return NextResponse.json(
        { error: "Invalid NFT ID format", success: false },
        { status: 400 }
      );
    }

    const nft = await prisma.nFTItem.findUnique({
      where: { id },
      include: {
        collection: {
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                nfts: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        auctions: {
          where: {
            status: {
              in: ["live", "upcoming"],
            },
          },
          include: {
            bids: {
              orderBy: { amount: "desc" },
              take: 1,
              include: {
                bidder: {
                  select: {
                    username: true,
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                bids: true,
                tickets: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        transactions: {
          where: {
            status: "completed",
          },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
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
        },
      },
    });

    if (!nft) {
      return NextResponse.json(
        { error: "NFT not found", success: false },
        { status: 404 }
      );
    }

    // Calculate additional stats
    const totalVolume = await prisma.transaction.aggregate({
      where: {
        nftItemId: id,
        status: "completed",
        price: { not: null },
      },
      _sum: {
        price: true,
      },
    });

    const likesCount = nft.likes;

    // Format response
    const formattedNFT = {
      ...nft,
      stats: {
        totalVolume: totalVolume._sum.price || 0,
        likes: likesCount,
        views: nft.views,
        auctionCount: nft.auctions.length,
        transactionCount: nft.transactions.length,
      },
      properties: nft.attributes
        ? Object.entries(nft.attributes as Record<string, any>).map(
            ([trait_type, value]) => ({
              trait_type,
              value,
              rarity: "12%", // You would calculate this based on collection data
              score: Math.floor(Math.random() * 100), // Mock score for demo
            })
          )
        : [],
    };

    return NextResponse.json({
      data: formattedNFT,
      success: true,
    });
  } catch (error) {
    console.error("NFT fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch NFT", success: false },
      { status: 500 }
    );
  }
}
