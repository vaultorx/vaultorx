import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build where clause - only show active or upcoming exhibitions
    const where: any = {
      status: {
        in: ["active", "upcoming"],
      },
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (category && category !== "all") {
      where.category = category;
    }

    // Get public exhibitions
    const exhibitions = await prisma.exhibition.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        _count: {
          select: {
            exhibitionCollections: true,
            exhibitionNFTs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.exhibition.count({ where });

    return NextResponse.json({
      success: true,
      data: exhibitions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching public exhibitions:", error);
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
