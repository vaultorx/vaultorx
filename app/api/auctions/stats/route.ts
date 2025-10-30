import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalAuctions,
      endedAuctions,
      successfulAuctions,
      totalVolume,
      activeBidders,
    ] = await Promise.all([
      prisma.auction.count(),
      prisma.auction.count({ where: { status: "ended" } }),
      prisma.auction.count({
        where: {
          status: "ended",
          bids: { some: {} },
        },
      }),
      prisma.bid.aggregate({
        _sum: { amount: true },
      }),
      prisma.bid.groupBy({
        by: ["bidderId"],
        where: {
          auction: { status: "live" },
        },
        _count: true,
      }),
    ]);

    const successRate =
      endedAuctions > 0 ? (successfulAuctions / endedAuctions) * 100 : 0;

    return NextResponse.json({
      totalAuctions,
      totalVolume: totalVolume._sum.amount || 0,
      activeBidders: activeBidders.length,
      successRate,
    });
  } catch (error) {
    console.error("Error fetching auction stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
