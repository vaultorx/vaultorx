import { TransactionStatus, TransactionType } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total volume (sum of all completed transaction prices)
    const totalVolumeResult = await prisma.transaction.aggregate({
      where: {
        status: TransactionStatus.completed,
        price: { not: null },
      },
      _sum: {
        price: true,
      },
    });

    // Get total sales volume (only sale transactions)
    const totalSalesResult = await prisma.transaction.aggregate({
      where: {
        transactionType: TransactionType.sale,
        status: TransactionStatus.completed,
        price: { not: null },
      },
      _sum: {
        price: true,
      },
    });

    // Get total gas fees
    const gasFeesResult = await prisma.transaction.aggregate({
      where: {
        gasFee: { not: null },
      },
      _sum: {
        gasFee: true,
      },
    });

    // Get pending transactions count
    const pendingCount = await prisma.transaction.count({
      where: {
        status: TransactionStatus.pending,
      },
    });

    const stats = {
      totalVolume: totalVolumeResult._sum.price || 0,
      totalSales: totalSalesResult._sum.price || 0,
      gasFees: gasFeesResult._sum.gasFee || 0,
      pendingCount,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
