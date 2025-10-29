// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define the category structure with icons
const CATEGORY_CONFIG = {
  gaming: {
    name: "Gaming",
    icon: "Gamepad2",
    color: "from-green-500 to-emerald-500",
  },
  art: {
    name: "Digital Art",
    icon: "Palette",
    color: "from-purple-500 to-pink-500",
  },
  photography: {
    name: "Photography",
    icon: "Camera",
    color: "from-amber-500 to-orange-500",
  },
  "3d": { name: "3D Art", icon: "Cuboid", color: "from-blue-500 to-cyan-500" },
  animated: {
    name: "Animated",
    icon: "Zap",
    color: "from-yellow-500 to-red-500",
  },
  collectibles: {
    name: "Collectibles",
    icon: "Users",
    color: "from-indigo-500 to-purple-500",
  },
  music: { name: "Music", icon: "Music", color: "from-pink-500 to-rose-500" },
  pfps: { name: "PFPs", icon: "Users", color: "from-teal-500 to-green-500" },
  sports: {
    name: "Sports",
    icon: "Trophy",
    color: "from-red-500 to-orange-500",
  },
  fashion: {
    name: "Fashion",
    icon: "Shirt",
    color: "from-fuchsia-500 to-purple-500",
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (categoryId) {
      // Get specific category with NFTs
      const nfts = await prisma.nFTItem.findMany({
        where: {
          category: categoryId,
          isListed: true, // Only get listed NFTs
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
              username: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      return NextResponse.json({
        data: nfts,
        success: true,
      });
    }

    // Get all categories with counts and sample NFTs
    const categoriesWithData = await Promise.all(
      Object.entries(CATEGORY_CONFIG).map(async ([categoryId, config]) => {
        // Get NFT count for this category
        const nftCount = await prisma.nFTItem.count({
          where: {
            category: categoryId,
            isListed: true,
          },
        });

        // Get sample NFTs for this category (max 5 for preview)
        const sampleNFTs = await prisma.nFTItem.findMany({
          where: {
            category: categoryId,
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
                username: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        return {
          id: categoryId,
          name: config.name,
          icon: config.icon,
          color: config.color,
          nftCount,
          nfts: sampleNFTs,
        };
      })
    );

    // Filter out categories with no NFTs
    const populatedCategories = categoriesWithData.filter(
      (category) => category.nftCount > 0
    );

    return NextResponse.json({
      data: populatedCategories,
      success: true,
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", success: false },
      { status: 500 }
    );
  }
}
