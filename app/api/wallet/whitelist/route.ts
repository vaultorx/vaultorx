import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
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

    const whitelistedAddresses = await prisma.whitelistedAddress.findMany({
      where: { userId: user.id },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json({
      data: whitelistedAddresses,
      success: true,
    });
  } catch (error) {
    console.error("Whitelist fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch whitelisted addresses", success: false },
      { status: 500 }
    );
  }
}

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

    const { address, label, lockUntil } = await request.json();

    if (!address || !label) {
      return NextResponse.json(
        { error: "Address and label are required", success: false },
        { status: 400 }
      );
    }

    const whitelistedAddress = await prisma.whitelistedAddress.create({
      data: {
        userId: user.id,
        address,
        label,
        lockUntil: lockUntil ? new Date(lockUntil) : undefined,
      },
    });

    return NextResponse.json({
      data: whitelistedAddress,
      message: "Address added to whitelist",
      success: true,
    });
  } catch (error) {
    console.error("Whitelist add error:", error);
    return NextResponse.json(
      { error: "Failed to add address to whitelist", success: false },
      { status: 500 }
    );
  }
}
