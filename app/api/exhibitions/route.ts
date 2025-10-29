import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { ExhibitionStatus } from "@/lib/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const featured = searchParams.get("featured");

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build where clause - only show exhibitions created by the current user
    const where: any = {
      creatorId: user.id,
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (featured === "true") {
      where.featured = true;
    }

    // Get exhibitions with related data
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
        exhibitionCollections: {
          include: {
            collection: {
              select: {
                id: true,
                name: true,
                image: true,
                verified: true,
              },
            },
          },
        },
        exhibitionNFTs: {
          include: {
            nftItem: {
              select: {
                id: true,
                name: true,
                image: true,
                collection: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          take: 4, // Show first 4 NFTs as preview
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
    console.error("Error fetching exhibitions:", error);
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      image,
      bannerImage,
      startDate,
      endDate,
      category,
      tags,
      locationType,
      venueName,
      venueAddress,
      virtualUrl,
      collectionIds = [],
      nftItemIds = [],
    } = body;

    // Validate required fields
    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Title, start date, and end date are required" },
        { status: 400 }
      );
    }

    // Create exhibition
    const exhibition = await prisma.exhibition.create({
      data: {
        title,
        description,
        image,
        bannerImage,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        category,
        tags: tags || [],
        locationType: locationType || "virtual",
        venueName,
        venueAddress,
        virtualUrl,
        creatorId: user.id,
        status: "draft", // Start as draft
      },
    });

    // Add collections if provided
    if (collectionIds.length > 0) {
      await prisma.exhibitionCollection.createMany({
        data: collectionIds.map((collectionId: string, index: number) => ({
          exhibitionId: exhibition.id,
          collectionId,
          order: index,
        })),
      });
    }

    // Add NFTs if provided
    if (nftItemIds.length > 0) {
      await prisma.exhibitionNFT.createMany({
        data: nftItemIds.map((nftItemId: string, index: number) => ({
          exhibitionId: exhibition.id,
          nftItemId,
          order: index,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      data: exhibition,
      message: "Exhibition created successfully",
    });
  } catch (error) {
    console.error("Error creating exhibition:", error);
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
