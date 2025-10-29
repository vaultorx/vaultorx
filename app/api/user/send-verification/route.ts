import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { EmailService } from "@/lib/emails/email-service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email, type = "withdrawal" } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Verify the email belongs to the authenticated user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true },
    });

    if (!user || user.email !== email) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Store the verification code with expiration (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // You can store this in your database or use a temporary storage
    // For now, we'll create a simple verification record
    await prisma.verificationToken.create({
      data: {
        identifier: `withdrawal-${session.user.id}`,
        token: verificationCode,
        expires: expiresAt,
      },
    });

    // Send verification email using your existing EmailService
    const emailResult = await EmailService.sendWithdrawalVerificationEmail(
      email,
      verificationCode,
      user.name || undefined
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      return NextResponse.json(
        { success: false, error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
      data: {
        codeSent: true,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
