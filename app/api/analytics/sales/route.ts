import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

import { TransactionType, TransactionStatus } from "@/lib/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    // Get sales data
    const sales = await prisma.transaction.findMany({
      where: {
        fromUserId: user.id,
        transactionType: TransactionType.sale,
        status: TransactionStatus.completed,
        createdAt: {
          gte: startDate,
        },
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate analytics
    const totalSales = sales.length;
    const totalVolume = sales.reduce((sum, sale) => sum + (sale.price || 0), 0);
    const avgSalePrice = totalSales > 0 ? totalVolume / totalSales : 0;

    // Group by time period for charts
    const dailySales = sales.reduce((acc, sale) => {
      const date = sale.createdAt.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, count: 0, volume: 0 };
      }
      acc[date].count += 1;
      acc[date].volume += sale.price || 0;
      return acc;
    }, {} as Record<string, { date: string; count: number; volume: number }>);

    const chartData = Object.values(dailySales).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return NextResponse.json({
      success: true,
      data: {
        sales,
        analytics: {
          totalSales,
          totalVolume,
          avgSalePrice,
          chartData,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
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
