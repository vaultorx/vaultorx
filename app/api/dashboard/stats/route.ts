import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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

    const [
      totalCollections,
      totalNFTs,
      listedNFTs,
      totalVolume,
      userNFTs,
      userListedNFTs,
      activeAuctions,
      pendingTransactions,
      recentTransactions,
    ] = await Promise.all([
      prisma.collection.count(),
      prisma.nFTItem.count(),
      prisma.nFTItem.count({ where: { isListed: true } }),
      prisma.collection.aggregate({ _sum: { totalVolume: true } }),
      prisma.nFTItem.count({ where: { ownerId: user.id } }),
      prisma.nFTItem.count({ where: { ownerId: user.id, isListed: true } }),
      prisma.auction.count({ where: { status: "live" } }),
      prisma.transaction.count({ where: { status: "pending" } }),
      prisma.transaction.findMany({
        where: {
          OR: [{ fromUserId: user.id }, { toUserId: user.id }],
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          nftItem: {
            select: {
              name: true,
              image: true,
              collection: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Calculate additional stats
    const totalVolumeValue = totalVolume._sum.totalVolume || 0;
    const monthlySales = totalVolumeValue * 0.1; // 10% of total volume
    const royaltyEarnings = totalVolumeValue * 0.025; // 2.5% royalty
    const avgSalePrice =
      userListedNFTs > 0 ? totalVolumeValue / userListedNFTs : 0;
    const floorValue = totalVolumeValue * 0.05; // Mock floor value
    const gasFees = totalVolumeValue * 0.001; // 0.1% gas fees

    const stats = {
      walletBalance: user.walletBalance,
      totalCollections,
      totalNFTs,
      floorValue: parseFloat(floorValue.toFixed(2)),
      totalVolume: parseFloat(totalVolumeValue.toFixed(1)),
      monthlySales: parseFloat(monthlySales.toFixed(3)),
      activeExhibitions: 12, // Mock data
      totalSales: userListedNFTs,
      avgSalePrice: parseFloat(avgSalePrice.toFixed(1)),
      royaltyEarnings: parseFloat(royaltyEarnings.toFixed(2)),
      activeListings: userListedNFTs,
      activeAuctions,
      totalBidders: 12, // Mock data
      successRate:
        userListedNFTs > 0
          ? Math.min(85, Math.floor((userListedNFTs / userNFTs) * 100))
          : 0,
      gasFees: parseFloat(gasFees.toFixed(3)),
      pendingTransactions,
    };

    // Format recent activities
    const recentActivities = recentTransactions.map((tx) => ({
      id: tx.id,
      type: tx.transactionType as any,
      nftName: tx.nftName || tx.nftItem.name,
      price: tx.price,
      currency: tx.currency,
      from: tx.from,
      to: tx.to,
      txHash: tx.transactionHash,
      timestamp: tx.createdAt,
      status: tx.status as any,
    }));

    return NextResponse.json({
      data: {
        stats,
        recentActivities,
      },
      success: true,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", success: false },
      { status: 500 }
    );
  }
}
