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
      select: {
        assignedWallet: true,
        walletAssignedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: user,
      success: true,
    });
  } catch (error) {
    console.error("Wallet fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet", success: false },
      { status: 500 }
    );
  }
}
