import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// POST /api/auctions/[id]/complete - Complete an auction
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const {id} = await params
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        nftItem: true,
        bids: {
          include: {
            bidder: true,
          },
          orderBy: {
            amount: "desc",
          },
        },
        tickets: {
          include: {
            buyer: true,
          },
        },
      },
    });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // Check ownership
    if (auction.nftItem.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to complete this auction" },
        { status: 403 }
      );
    }

    // Can only complete live auctions
    if (auction.status !== "live") {
      return NextResponse.json(
        { error: "Can only complete live auctions" },
        { status: 400 }
      );
    }

    let winnerId = null;
    let winningBid = null;

    // Handle different auction types
    switch (auction.type) {
      case "STANDARD":
      case "RESERVE":
      case "TIMED":
        if (auction.bids.length > 0) {
          const highestBid = auction.bids[0];
          // For reserve auctions, check if reserve price is met
          if (auction.type === "RESERVE" && auction.reservePrice) {
            if (highestBid.amount >= auction.reservePrice) {
              winnerId = highestBid.bidderId;
              winningBid = highestBid.amount;
            }
          } else {
            winnerId = highestBid.bidderId;
            winningBid = highestBid.amount;
          }
        }
        break;

      case "LOTTERY":
        if (auction.tickets.length > 0) {
          // Simple random selection - in production, use a verifiable random function
          const randomIndex = Math.floor(
            Math.random() * auction.tickets.length
          );
          winnerId = auction.tickets[randomIndex].buyerId;
        }
        break;

      case "BUY_NOW":
        // For buy now, the first bidder who meets the buy now price wins
        const buyNowBid = auction.bids.find(
          (bid) => auction.buyNowPrice && bid.amount >= auction.buyNowPrice
        );
        if (buyNowBid) {
          winnerId = buyNowBid.bidderId;
          winningBid = buyNowBid.amount;
        }
        break;
    }

    // Update auction status
    const completedAuction = await prisma.auction.update({
      where: { id },
      data: {
        status: "ended",
      },
      include: {
        nftItem: {
          include: {
            collection: true,
            owner: true,
          },
        },
        bids: {
          include: {
            bidder: true,
          },
          orderBy: {
            amount: "desc",
          },
        },
      },
    });

    // If there's a winner, transfer NFT ownership
    if (winnerId) {
      await prisma.nFTItem.update({
        where: { id: auction.nftItemId },
        data: { ownerId: winnerId, isListed: false },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          nftItemId: auction.nftItemId,
          fromUserId: auction.nftItem.ownerId,
          toUserId: winnerId,
          transactionType: "sale",
          price: winningBid,
          status: "completed",
          nftName: auction.nftItem.name,
          from: auction.nftItem.ownerId,
          to: winnerId,
        },
      });
    }

    return NextResponse.json({
      auction: completedAuction,
      winnerId,
      winningBid,
    });
  } catch (error) {
    console.error("Error completing auction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
