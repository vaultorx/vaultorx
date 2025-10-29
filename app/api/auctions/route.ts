import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { AuctionStatus, AuctionType } from "@/lib/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status: status as AuctionStatus }),
      ...(type && { type: type as AuctionType }),
    };

    const [auctions, total] = await Promise.all([
      prisma.auction.findMany({
        where,
        include: {
          nftItem: {
            include: {
              collection: true,
              owner: {
                select: {
                  username: true,
                  email: true,
                },
              },
            },
          },
          bids: {
            orderBy: { amount: "desc" },
            take: 1,
            include: {
              bidder: {
                select: {
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auction.count({ where }),
    ]);

    // Format auctions to match your mock data structure
    const formattedAuctions = auctions.map((auction) => ({
      id: auction.id,
      nftName: auction.nftItem.name,
      collection: auction.nftItem.collection.name,
      type: auction.type,
      status: auction.status,
      currentBid: auction.bids[0]?.amount,
      minimumBid: auction.minimumBid,
      startingPrice: auction.startingPrice,
      reservePrice: auction.reservePrice,
      bidIncrement: auction.bidIncrement,
      startTime: auction.startTime
        .toISOString()
        .replace("T", " ")
        .substring(0, 19),
      endTime: auction.endTime.toISOString().replace("T", " ").substring(0, 19),
      bidders: auction.bidders,
      views: auction.views,
      image: auction.nftItem.image,
      winningBidder:
        auction.status === "ended"
          ? auction.bids[0]?.bidder.username || auction.bids[0]?.bidder.email
          : undefined,
      finalBid:
        auction.status === "ended" ? auction.bids[0]?.amount : undefined,
    }));

    return NextResponse.json({
      data: formattedAuctions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error("Auctions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch auctions", success: false },
      { status: 500 }
    );
  }
}

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
      nftItemId,
      type,
      startingPrice,
      reservePrice,
      minimumBid,
      bidIncrement,
      startTime,
      endTime,
    } = await request.json();

    // Verify NFT ownership
    const nftItem = await prisma.nFTItem.findFirst({
      where: {
        id: nftItemId,
        ownerId: user.id,
      },
      include: {
        collection: true,
      },
    });

    if (!nftItem) {
      return NextResponse.json(
        { error: "NFT not found or not owned by you", success: false },
        { status: 404 }
      );
    }

    // Create auction
    const auction = await prisma.auction.create({
      data: {
        nftItemId,
        type,
        startingPrice,
        reservePrice,
        minimumBid,
        bidIncrement,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: new Date(startTime) > new Date() ? "upcoming" : "live",
        bidders: 0,
        views: 0,
      },
      include: {
        nftItem: {
          include: {
            collection: true,
          },
        },
      },
    });

    // Update NFT listing status
    await prisma.nFTItem.update({
      where: { id: nftItemId },
      data: {
        isListed: true,
      },
    });

    return NextResponse.json({
      data: auction,
      message: "Auction created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Create auction error:", error);
    return NextResponse.json(
      { error: "Failed to create auction", success: false },
      { status: 500 }
    );
  }
}
