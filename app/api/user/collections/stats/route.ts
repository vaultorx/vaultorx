import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const verified = searchParams.get("verified");

    const skip = (page - 1) * limit;

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

    const where = {
        creatorId: user.id,
      ...(category && { category }),
      ...(verified && { verified: verified === "true" }),
    };

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        include: {
          creator: {
            select: {
              username: true,
              email: true,
            },
          },
          _count: {
            select: {
              nfts: true,
            },
          },
        },
        orderBy: { totalVolume: "desc" },
        skip,
        take: limit,
      }),
      prisma.collection.count({ where }),
    ]);

    // Format collections to match CollectionStats type
    const collectionStats = collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description || "",
      itemCount: collection._count.nfts,
      floorPrice: collection.floorPrice || 0,
      totalVolume: collection.totalVolume,
      blockchain: collection.blockchain,
      category: collection.category || "Uncategorized",
      image: collection.image || "/placeholder.svg",
      verified: collection.verified,
    }));

    return NextResponse.json({
      data: collectionStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error("Collections stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection stats", success: false },
      { status: 500 }
    );
  }
}
