import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { EmailService } from "@/lib/emails/email-service";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { enabled } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    // If enabling 2FA, generate a secret
    let twoFactorSecret = null;
    if (enabled && !user.twoFactorEnabled) {
      twoFactorSecret = crypto.randomBytes(32).toString("base64");
      // In a real implementation, you'd store this secret and use it with TOTP
      // For now, we'll just track that 2FA is enabled
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        twoFactorEnabled: enabled,
      },
    });

    // Send email notification
    try {
      await EmailService.sendTwoFactorEmail(
        user.email,
        enabled,
        user.name || undefined
      );
    } catch (emailError) {
      console.error("Failed to send 2FA notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Two-factor authentication ${enabled ? "enabled" : "disabled"}`,
      ...(enabled && twoFactorSecret && { secret: twoFactorSecret }), // In real app, return QR code data
    });
  } catch (error) {
    console.error("Two-factor update error:", error);
    return NextResponse.json(
      { error: "Failed to update two-factor authentication", success: false },
      { status: 500 }
    );
  }
}

// Get 2FA status
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
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
      },
      success: true,
    });
  } catch (error) {
    console.error("Two-factor status error:", error);
    return NextResponse.json(
      { error: "Failed to get two-factor status", success: false },
      { status: 500 }
    );
  }
}
