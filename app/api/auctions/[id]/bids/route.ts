import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Await the params
    const params = await context.params;
    const auctionId = params.id;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    const { amount } = await request.json();

    // Rest of your implementation remains the same...
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          orderBy: { amount: "desc" },
          take: 1,
        },
        nftItem: true,
      },
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found", success: false },
        { status: 404 }
      );
    }

    // Validation logic...
    if (auction.status !== "live") {
      return NextResponse.json(
        { error: "Auction is not active", success: false },
        { status: 400 }
      );
    }

    if (new Date() > auction.endTime) {
      return NextResponse.json(
        { error: "Auction has ended", success: false },
        { status: 400 }
      );
    }

    // Create bid
    const bid = await prisma.$transaction(async (tx) => {
      const newBid = await tx.bid.create({
        data: {
          auctionId,
          bidderId: user.id,
          amount,
        },
        include: {
          bidder: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      // Update auction bidders count
      const existingBid = await tx.bid.findFirst({
        where: {
          auctionId,
          bidderId: user.id,
        },
      });

      if (!existingBid) {
        await tx.auction.update({
          where: { id: auctionId },
          data: {
            bidders: { increment: 1 },
          },
        });
      }

      return newBid;
    });

    return NextResponse.json({
      data: bid,
      message: "Bid placed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Place bid error:", error);
    return NextResponse.json(
      { error: "Failed to place bid", success: false },
      { status: 500 }
    );
  }
}