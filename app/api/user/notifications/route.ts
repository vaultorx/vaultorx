import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { EmailService } from "@/lib/emails/email-service";

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
      include: {
        notificationSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    // Return user's notification settings or default settings
    const notificationSettings = user.notificationSettings || {
      emailNotifications: true,
      pushNotifications: true,
      salesAlerts: true,
      bidAlerts: true,
      exhibitionUpdates: true,
    };

    return NextResponse.json({
      data: notificationSettings,
      success: true,
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification settings", success: false },
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        notificationSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    const updatedSettings = {
      emailNotifications:
        typeof body.emailNotifications === "boolean"
          ? body.emailNotifications
          : true,
      pushNotifications:
        typeof body.pushNotifications === "boolean"
          ? body.pushNotifications
          : true,
      salesAlerts:
        typeof body.salesAlerts === "boolean" ? body.salesAlerts : true,
      bidAlerts: typeof body.bidAlerts === "boolean" ? body.bidAlerts : true,
      exhibitionUpdates:
        typeof body.exhibitionUpdates === "boolean"
          ? body.exhibitionUpdates
          : true,
    };

    // Upsert notification settings
    const notificationSettings = await prisma.userNotificationSettings.upsert({
      where: {
        userId: user.id,
      },
      update: updatedSettings,
      create: {
        userId: user.id,
        ...updatedSettings,
      },
    });

    // Send confirmation email if email notifications are enabled
    if (notificationSettings.emailNotifications) {
      try {
        await EmailService.sendNotificationEmail(
          user.email,
          "Notification Preferences Updated",
          "Your notification preferences have been successfully updated. You'll now receive alerts based on your selected preferences.",
          user.name || undefined
        );
      } catch (emailError) {
        console.error(
          "Failed to send notification confirmation email:",
          emailError
        );
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      data: notificationSettings,
      success: true,
      message: "Notification preferences updated",
    });
  } catch (error) {
    console.error("Notifications update error:", error);
    return NextResponse.json(
      { error: "Failed to update notification settings", success: false },
      { status: 500 }
    );
  }
}

// Send test notification
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
      include: {
        notificationSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if email notifications are enabled
    if (user.notificationSettings?.emailNotifications) {
      await EmailService.sendNotificationEmail(
        user.email,
        "Test Notification",
        "This is a test notification to confirm that your email notifications are working properly.",
        user.name || undefined
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test notification sent successfully",
    });
  } catch (error) {
    console.error("Test notification error:", error);
    return NextResponse.json(
      { error: "Failed to send test notification", success: false },
      { status: 500 }
    );
  }
}
