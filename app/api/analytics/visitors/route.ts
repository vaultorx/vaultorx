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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");

    // Generate mock visitor analytics data
    const visitorAnalytics = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));

      return {
        date: date.toISOString().split("T")[0],
        visitors: Math.floor(Math.random() * 200) + 400,
        pageViews: Math.floor(Math.random() * 600) + 1000,
        duration: parseFloat((Math.random() * 2 + 2.5).toFixed(1)),
      };
    });

    return NextResponse.json({
      data: visitorAnalytics,
      success: true,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", success: false },
      { status: 500 }
    );
  }
}
