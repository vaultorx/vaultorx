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
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        emailVerified: true,
        twoFactorEnabled: true,
        kycStatus: true,
        walletBalance: true,
        assignedWallet: true,
        walletAssignedAt: true,
        createdAt: true,
        updatedAt: true,
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
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, name } = body;

    // Check if username is already taken
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          email: { not: session.user.email }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken", success: false },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username,
        name,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        emailVerified: true,
        twoFactorEnabled: true,
        kycStatus: true,
        walletBalance: true,
        assignedWallet: true,
        walletAssignedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      data: updatedUser,
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile", success: false },
      { status: 500 }
    );
  }
}