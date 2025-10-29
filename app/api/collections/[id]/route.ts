import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    console.log("Fetching collection by ID:", id);

    // Validate UUID format
    if (
      !id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    ) {
      return NextResponse.json(
        { error: "Invalid collection ID format", success: false },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            nfts: true,
          },
        },
        nfts: {
          where: { isListed: true },
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
            collection: {
              select: {
                name: true,
                verified: true,
              },
            },
            auctions: {
              where: {
                status: {
                  in: ["live", "upcoming"],
                },
              },
              include: {
                _count: {
                  select: {
                    bids: true,
                  },
                },
                bids: {
                  orderBy: { amount: "desc" },
                  take: 1,
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!collection) {
      console.log("Collection not found for ID:", id);
      return NextResponse.json(
        { error: "Collection not found", success: false },
        { status: 404 }
      );
    }

    // Calculate additional stats
    const listedItems = await prisma.nFTItem.count({
      where: {
        collectionId: id,
        isListed: true,
      },
    });

    const totalVolume = await prisma.transaction.aggregate({
      where: {
        nftItem: {
          collectionId: id,
        },
        status: "completed",
        price: { not: null },
      },
      _sum: {
        price: true,
      },
    });

    const floorPriceResult = await prisma.nFTItem.aggregate({
      where: {
        collectionId: id,
        isListed: true,
        listPrice: { not: null },
      },
      _min: {
        listPrice: true,
      },
    });

    // Get recent activity count
    const recentActivityCount = await prisma.transaction.count({
      where: {
        nftItem: {
          collectionId: id,
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    // Format the response with additional calculated fields
    const formattedCollection = {
      ...collection,
      listedItems,
      totalVolume: totalVolume._sum.price || 0,
      floorPrice: floorPriceResult._min.listPrice || null,
      recentActivityCount,
      stats: {
        totalItems: collection._count.nfts,
        listedItems,
        totalVolume: totalVolume._sum.price || 0,
        floorPrice: floorPriceResult._min.listPrice || null,
        recentActivity: recentActivityCount,
      },
    };

    console.log("Successfully fetched collection:", formattedCollection.name);

    return NextResponse.json({
      data: formattedCollection,
      success: true,
    });
  } catch (error) {
    console.error("Collection fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection", success: false },
      { status: 500 }
    );
  }
}
