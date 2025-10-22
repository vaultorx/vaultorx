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

    const { nftId } = await request.json();

    if (!nftId) {
      return NextResponse.json(
        { error: "NFT ID is required", success: false },
        { status: 400 }
      );
    }

    // Get NFT with owner and collection details
    const nft = await prisma.nFTItem.findFirst({
      where: {
        id: nftId,
        isListed: true,
      },
      include: {
        owner: true,
        collection: true,
      },
    });

    if (!nft) {
      return NextResponse.json(
        { error: "NFT not available for purchase", success: false },
        { status: 404 }
      );
    }

    if (!nft.listPrice) {
      return NextResponse.json(
        { error: "NFT is not priced", success: false },
        { status: 400 }
      );
    }

    if (user.walletBalance < nft.listPrice) {
      return NextResponse.json(
        { error: "Insufficient balance", success: false },
        { status: 400 }
      );
    }

    // Calculate fees
    const platformFee = nft.listPrice * 0.025; // 2.5% platform fee
    const royaltyFee = nft.listPrice * (nft.collection.royaltyPercentage / 100);
    const sellerAmount = nft.listPrice - platformFee - royaltyFee;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update buyer balance
      await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: { decrement: nft.listPrice! },
        },
      });

      // Update seller balance
      await tx.user.update({
        where: { id: nft.ownerId },
        data: {
          walletBalance: { increment: sellerAmount },
        },
      });

      // Update NFT ownership and listing status
      const updatedNFT = await tx.nFTItem.update({
        where: { id: nftId },
        data: {
          ownerId: user.id,
          isListed: false,
          listPrice: null,
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
      await tx.collection.update({
        where: { id: nft.collectionId },
        data: {
          totalVolume: { increment: nft.listPrice || undefined },
          listedItems: { decrement: 1 },
        },
      });

      // Create purchase transaction
      const transaction = await tx.transaction.create({
        data: {
          transactionHash: `buy_${Date.now()}_${nftId}`,
          nftItemId: nftId,
          fromUserId: nft.ownerId,
          toUserId: user.id,
          transactionType: "purchase",
          price: nft.listPrice,
          currency: nft.currency,
          platformFee,
          royaltyFee,
          status: "completed",
          nftName: nft.name,
          from: nft.owner.username || nft.owner.email,
          to: user.username || user.email,
          confirmedAt: new Date(),
        },
      });

      return { updatedNFT, transaction };
    });

    return NextResponse.json({
      data: result,
      message: "NFT purchased successfully",
      success: true,
    });
  } catch (error) {
    console.error("Buy NFT error:", error);
    return NextResponse.json(
      { error: "Failed to purchase NFT", success: false },
      { status: 500 }
    );
  }
}
