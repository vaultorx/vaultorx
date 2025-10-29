import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const verified = searchParams.get("verified");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    const where: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { symbol: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category }),
      ...(verified && { verified: verified === "true" }),
    };

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === "volume") {
      orderBy.totalVolume = sortOrder;
    } else if (sortBy === "floorPrice") {
      orderBy.floorPrice = sortOrder;
    } else if (sortBy === "items") {
      orderBy.totalItems = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              nfts: true,
            },
          },
          nfts: {
            where: { isListed: true },
            take: 4, // Get first 4 NFTs for preview
            select: {
              id: true,
              name: true,
              image: true,
              listPrice: true,
              rarity: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.collection.count({ where }),
    ]);

    return NextResponse.json({
      data: collections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error("Collections fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections", success: false },
      { status: 500 }
    );
  }
}
