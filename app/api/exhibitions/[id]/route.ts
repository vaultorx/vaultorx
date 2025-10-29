import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const exhibition = await prisma.exhibition.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        collections: true,
        nfts: true,
        _count: {
          select: {
            collections: true,
            nfts: true,
          },
        },
      },
    });

    if (!exhibition) {
      return NextResponse.json(
        { success: false, message: "Exhibition not found" },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.exhibition.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      data: exhibition,
    });
  } catch (error) {
    console.error("Error fetching exhibition:", error);
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Check if user owns the exhibition
    const existingExhibition = await prisma.exhibition.findFirst({
      where: { id, creatorId: user.id },
    });

    if (!existingExhibition) {
      return NextResponse.json(
        { error: "Exhibition not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updatedExhibition = await prisma.exhibition.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedExhibition,
      message: "Exhibition updated successfully",
    });
  } catch (error) {
    console.error("Error updating exhibition:", error);
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Check if user owns the exhibition
    const existingExhibition = await prisma.exhibition.findFirst({
      where: { id, creatorId: user.id },
    });

    if (!existingExhibition) {
      return NextResponse.json(
        { error: "Exhibition not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.exhibition.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Exhibition deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting exhibition:", error);
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
