import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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

    const { nftId, price, currency = "ETH" } = await request.json();

    if (!nftId || !price || price <= 0) {
      return NextResponse.json(
        { error: "Invalid listing data", success: false },
        { status: 400 }
      );
    }

    // Check if NFT exists and belongs to user
    const nft = await prisma.nFTItem.findFirst({
      where: {
        id: nftId,
        ownerId: user.id,
      },
    });

    if (!nft) {
      return NextResponse.json(
        { error: "NFT not found or not owned by you", success: false },
        { status: 404 }
      );
    }

    // Update NFT listing status
    const updatedNFT = await prisma.nFTItem.update({
      where: { id: nftId },
      data: {
        isListed: true,
        listPrice: price,
        currency,
      },
      include: {
        collection: true,
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    // Update collection stats
    await prisma.collection.update({
      where: { id: nft.collectionId },
      data: {
        listedItems: { increment: 1 },
      },
    });

    // Create listing transaction
    await prisma.transaction.create({
      data: {
        transactionHash: `list_${Date.now()}_${nftId}`,
        nftItemId: nftId,
        fromUserId: user.id,
        transactionType: "sale",
        price,
        currency,
        status: "completed",
        nftName: nft.name,
        from: user.username || user.email,
      },
    });

    return NextResponse.json({
      data: updatedNFT,
      message: "NFT listed successfully",
      success: true,
    });
  } catch (error) {
    console.error("List NFT error:", error);
    return NextResponse.json(
      { error: "Failed to list NFT", success: false },
      { status: 500 }
    );
  }
}
