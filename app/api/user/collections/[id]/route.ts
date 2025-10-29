
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}


// Helper function to upload image to Cloudinary
async function uploadToCloudinary(image: File): Promise<string> {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Convert image to base64 for Cloudinary upload
  const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
  
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "collections",
    });
    
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    // Check if collection exists and belongs to user
    const existingCollection = await prisma.collection.findFirst({
      where: {
        id,
        creatorId: user.id,
      },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found or access denied" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const royaltyPercentage = formData.get("royaltyPercentage")
      ? parseFloat(formData.get("royaltyPercentage") as string)
      : undefined;
    const category = formData.get("category") as string;
    const image = formData.get("image") as File;

    // Validate royalty percentage if provided
    if (
      royaltyPercentage !== undefined &&
      (royaltyPercentage < 0 || royaltyPercentage > 20)
    ) {
      return NextResponse.json(
        { error: "Royalty percentage must be between 0 and 20" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      description,
      category,
    };

    if (royaltyPercentage !== undefined) {
      updateData.royaltyPercentage = royaltyPercentage;
    }

    // Handle image update if provided
    if (image && image.size > 0) {
      try {
        const imageUrl = await uploadToCloudinary(image);
        updateData.image = imageUrl;
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: collection,
      message: "Collection updated successfully",
    });
  } catch (error) {
    console.error("Error updating collection:", error);
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
    const {id} = await params;
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

    // Check if collection exists and belongs to user
    const existingCollection = await prisma.collection.findFirst({
      where: {
        id,
        creatorId: user.id,
      },
      include: {
        nfts: true,
      },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found or access denied" },
        { status: 404 }
      );
    }

    // Check if collection has NFTs
    if (existingCollection.nfts.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete collection with NFTs. Please delete all NFTs first.",
          nftCount: existingCollection.nfts.length,
        },
        { status: 400 }
      );
    }

    // Delete the collection
    await prisma.collection.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting collection:", error);
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
