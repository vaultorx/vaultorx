import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { WalletService } from "@/lib/services/wallet-service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Forbidden", success: false },
        { status: 403 }
      );
    }

    const wallets = await prisma.platformWallet.findMany({
      orderBy: { index: "asc" },
    });

    const stats = await WalletService.getWalletStats();

    return NextResponse.json({
      data: { wallets, stats },
      success: true,
    });
  } catch (error) {
    console.error("Admin wallets fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallets", success: false },
      { status: 500 }
    );
  }
}
