import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const limit = parseInt(searchParams.get("limit") || "5");

    console.log("Search query:", query); // Debug log

    if (!query) {
      return NextResponse.json({
        success: true,
        data: {
          collections: [],
          nfts: [],
          users: [],
          exhibitions: [],
        },
        meta: {
          query: "",
          collectionsCount: 0,
          nftsCount: 0,
          usersCount: 0,
          exhibitionsCount: 0,
        },
      });
    }

    // Search across multiple entities with better error handling
    const searchPromises = [
      // Search Collections
      prisma.collection
        .findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { symbol: { contains: query, mode: "insensitive" } },
            ],
          },
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
            _count: {
              select: {
                nfts: true,
              },
            },
          },
          take: limit,
          orderBy: {
            totalVolume: "desc",
          },
        })
        .catch((error) => {
          console.error("Collection search error:", error);
          return [];
        }),

      // Search NFTs
      prisma.nFTItem
        .findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
            isListed: true,
          },
          include: {
            collection: {
              select: {
                name: true,
                verified: true,
                image: true,
              },
            },
            owner: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
          take: limit,
          orderBy: {
            views: "desc",
          },
        })
        .catch((error) => {
          console.error("NFT search error:", error);
          return [];
        }),

      // Search Users
      prisma.user
        .findMany({
          where: {
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            createdAt: true,
          },
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        })
        .catch((error) => {
          console.error("User search error:", error);
          return [];
        }),

      // Search Exhibitions
      prisma.exhibition
        .findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { tags: { has: query } },
            ],
          },
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
            _count: {
              select: {
                collections: true,
                nfts: true,
              },
            },
          },
          take: limit,
          orderBy: {
            views: "desc",
          },
        })
        .catch((error) => {
          console.error("Exhibition search error:", error);
          return [];
        }),
    ];

    const [collections, nfts, users, exhibitions] = await Promise.all(
      searchPromises
    );

    console.log("Search results:", {
      // Debug log
      collections: collections.length,
      nfts: nfts.length,
      users: users.length,
      exhibitions: exhibitions.length,
    });

    return NextResponse.json({
      success: true,
      data: {
        collections,
        nfts,
        users,
        exhibitions,
      },
      meta: {
        query,
        collectionsCount: collections.length,
        nftsCount: nfts.length,
        usersCount: users.length,
        exhibitionsCount: exhibitions.length,
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform search",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
