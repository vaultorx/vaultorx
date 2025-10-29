import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "24h":
        startDate.setHours(now.getHours() - 24);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get user's listed NFTs
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const listings = await prisma.nFTItem.findMany({
      where: {
        ownerId: user.id,
        isListed: true,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        collection: {
          select: {
            name: true,
            image: true,
            verified: true,
          },
        },
        transactions: {
          where: {
            transactionType: "sale",
            status: "completed",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate stats
    const totalListings = listings.length;
    const activeListings = listings.filter((item) => item.isListed).length;
    const totalVolume = listings.reduce((sum, item) => {
      const lastSale = item.transactions[0];
      return sum + (lastSale?.price || 0);
    }, 0);

    const avgPrice = totalListings > 0 ? totalVolume / totalListings : 0;

    return NextResponse.json({
      success: true,
      data: {
        listings,
        stats: {
          totalListings,
          activeListings,
          totalVolume,
          avgPrice,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
