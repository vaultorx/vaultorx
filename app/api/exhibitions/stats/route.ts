import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get exhibition stats for the current user
    const totalExhibitions = await prisma.exhibition.count({
      where: { creatorId: user.id },
    });

    const activeExhibitions = await prisma.exhibition.count({
      where: {
        creatorId: user.id,
        status: "active",
      },
    });

    const upcomingExhibitions = await prisma.exhibition.count({
      where: {
        creatorId: user.id,
        status: "upcoming",
      },
    });

    const totalViewsResult = await prisma.exhibition.aggregate({
      where: { creatorId: user.id },
      _sum: { views: true },
    });

    const totalLikesResult = await prisma.exhibition.aggregate({
      where: { creatorId: user.id },
      _sum: { likes: true },
    });

    const stats = {
      totalExhibitions,
      activeExhibitions,
      upcomingExhibitions,
      totalViews: totalViewsResult._sum.views || 0,
      totalLikes: totalLikesResult._sum.likes || 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching exhibition stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
