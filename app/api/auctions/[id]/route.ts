import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/auctions/[id] - Get specific auction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
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

    return NextResponse.json(auction);
  } catch (error) {
    console.error("Error fetching auction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/auctions/[id] - Update auction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { nftItem: true },
    });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // Check ownership
    if (auction.nftItem.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this auction" },
        { status: 403 }
      );
    }

    // Can only update upcoming auctions
    if (auction.status !== "upcoming") {
      return NextResponse.json(
        { error: "Can only update upcoming auctions" },
        { status: 400 }
      );
    }

    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: body,
      include: {
        nftItem: {
          include: {
            collection: true,
            owner: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAuction);
  } catch (error) {
    console.error("Error updating auction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/auctions/[id] - Delete auction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { nftItem: true },
    });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // Check ownership
    if (auction.nftItem.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this auction" },
        { status: 403 }
      );
    }

    // Can only delete upcoming auctions
    if (auction.status !== "upcoming") {
      return NextResponse.json(
        { error: "Can only delete upcoming auctions" },
        { status: 400 }
      );
    }

    await prisma.auction.delete({
      where: { id },
    });

    // Update NFT listing status
    await prisma.nFTItem.update({
      where: { id: auction.nftItemId },
      data: { isListed: false },
    });

    return NextResponse.json({ message: "Auction deleted successfully" });
  } catch (error) {
    console.error("Error deleting auction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
