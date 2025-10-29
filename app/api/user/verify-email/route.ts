// app/api/user/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { EmailService } from "@/lib/emails/email-service";
import { EmailVerificationService } from "@/lib/email-verification";

export async function POST() {
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
        name: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified", success: false },
        { status: 400 }
      );
    }

    // Generate and store verification token
    const verificationToken =
      await EmailVerificationService.createVerificationToken(user.email);

    // Send verification email
    const emailResult = await EmailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.name || undefined
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send verification email", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email", success: false },
      { status: 500 }
    );
  }
}

// Verify email with token (GET for email links)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      // Return an HTML page for better user experience
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Verification - Vaultorx</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .success { color: green; }
              .error { color: red; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>Verification Failed</h1>
              <p>Verification token is required.</p>
            </div>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Find the token (we need to search since we don't have just the identifier)
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: token,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Verification - Vaultorx</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .success { color: green; }
              .error { color: red; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>Verification Failed</h1>
              <p>Invalid or expired verification token.</p>
            </div>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Verify the user's email
    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: true,
      },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    });

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verification - Vaultorx</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: green; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>Email Verified Successfully!</h1>
            <p>Your email has been verified. You can now close this window and return to the app.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </div>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verification - Vaultorx</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: green; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>Verification Failed</h1>
            <p>An error occurred during verification. Please try again.</p>
          </div>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}

// API endpoint for verifying token (for programmatic use)
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
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required", success: false },
        { status: 400 }
      );
    }

    const verificationResult = await EmailVerificationService.verifyToken(
      session.user.email,
      token
    );

    if (!verificationResult.valid) {
      return NextResponse.json(
        { error: verificationResult.error, success: false },
        { status: 400 }
      );
    }

    // Verify the user's email
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        emailVerified: true,
      },
    });

    // Delete the used token
    await EmailVerificationService.deleteToken(session.user.email, token);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email", success: false },
      { status: 500 }
    );
  }
}
