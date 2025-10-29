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

    const { nftItemId, amount, currency, nftData } = await request.json();

    // Validate NFT exists and is listed
    const nft = await prisma.nFTItem.findUnique({
      where: { id: nftItemId },
      include: { owner: true },
    });

    if (!nft) {
      return NextResponse.json(
        { error: "NFT not found", success: false },
        { status: 404 }
      );
    }

    if (!nft.isListed) {
      return NextResponse.json(
        { error: "NFT is not listed for sale", success: false },
        { status: 400 }
      );
    }

    if (nft.ownerId === user.id) {
      return NextResponse.json(
        { error: "You cannot purchase your own NFT", success: false },
        { status: 400 }
      );
    }

    // Check for existing active purchase session
    const existingSession = await prisma.purchaseSession.findFirst({
      where: {
        userId: user.id,
        nftItemId: nftItemId,
        status: { in: ["pending", "processing"] },
        expiresAt: { gt: new Date() },
      },
    });

    if (existingSession) {
      return NextResponse.json({
        data: existingSession,
        success: true,
        message: "Existing purchase session found",
      });
    }

    // Create new purchase session (30 minutes expiry)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const purchaseSession = await prisma.purchaseSession.create({
      data: {
        userId: user.id,
        nftItemId: nftItemId,
        amount: amount,
        currency: currency,
        expiresAt: expiresAt,
        nftData: nftData,
        status: "pending",
      },
      include: {
        nftItem: {
          include: {
            collection: true,
            owner: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: purchaseSession,
      success: true,
      message: "Purchase session created successfully",
    });
  } catch (error) {
    console.error("Purchase session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create purchase session", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");

    if (sessionId) {
      // Get specific purchase session
      const purchaseSession = await prisma.purchaseSession.findUnique({
        where: { id: sessionId },
        include: {
          nftItem: {
            include: {
              collection: true,
              owner: true,
            },
          },
        },
      });

      if (!purchaseSession || purchaseSession.userId !== user.id) {
        return NextResponse.json(
          { error: "Purchase session not found", success: false },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: purchaseSession,
        success: true,
      });
    }

    // Get user's active purchase sessions
    const purchaseSessions = await prisma.purchaseSession.findMany({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
        status: { in: ["pending", "processing"] },
      },
      include: {
        nftItem: {
          include: {
            collection: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: purchaseSessions,
      success: true,
    });
  } catch (error) {
    console.error("Purchase sessions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase sessions", success: false },
      { status: 500 }
    );
  }
}
