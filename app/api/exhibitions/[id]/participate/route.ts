import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if exhibition exists and is active
    const exhibition = await prisma.exhibition.findFirst({
      where: {
        id,
        status: "active",
      },
    });

    if (!exhibition) {
      return NextResponse.json(
        { error: "Exhibition not found or not active" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { nftItemIds = [], collectionIds = [], message } = body;

    // Check if user already has a participation request
    const existingParticipation =
      await prisma.exhibitionParticipation.findUnique({
        where: {
          exhibitionId_userId: {
            exhibitionId: id,
            userId: user.id,
          },
        },
      });

    if (existingParticipation) {
      return NextResponse.json(
        {
          error:
            "You have already submitted a participation request for this exhibition",
        },
        { status: 400 }
      );
    }

    // Create participation request
    const participation = await prisma.exhibitionParticipation.create({
      data: {
        exhibitionId: id,
        userId: user.id,
        message,
        status: "pending",
        nftItems: {
          create: nftItemIds.map((nftItemId: string, index: number) => ({
            nftItemId,
            order: index,
          })),
        },
        collections: {
          create: collectionIds.map((collectionId: string, index: number) => ({
            collectionId,
            order: index,
          })),
        },
      },
      include: {
        nftItems: {
          include: {
            nftItem: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        collections: {
          include: {
            collection: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: participation,
      message: "Participation request submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting participation:", error);
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

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's participation for this exhibition
    const participation = await prisma.exhibitionParticipation.findUnique({
      where: {
        exhibitionId_userId: {
          exhibitionId: id,
          userId: user.id,
        },
      },
      include: {
        nftItems: {
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
        },
        collections: {
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
      },
    });

    return NextResponse.json({
      success: true,
      data: participation,
    });
  } catch (error) {
    console.error("Error fetching participation:", error);
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
