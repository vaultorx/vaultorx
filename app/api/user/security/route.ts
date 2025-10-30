import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Force this route to use Node.js runtime
export const runtime = 'nodejs';

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
    const { currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    // Verify current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required", success: false },
          { status: 400 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          { error: "Password not set for this account", success: false },
          { status: 400 }
        );
      }

      const bcrypt = require("bcrypt");

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect", success: false },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          password: hashedPassword,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Security settings updated successfully",
    });
  } catch (error) {
    console.error("Security update error:", error);
    return NextResponse.json(
      { error: "Failed to update security settings", success: false },
      { status: 500 }
    );
  }
}
