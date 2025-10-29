import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(image: File): Promise<string> {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Convert image to base64 for Cloudinary upload
  const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;

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

export async function GET(request: NextRequest) {
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

    const collections = await prisma.collection.findMany({
      where: {
        creatorId: user.id,
      },
      select: {
        id: true,
        name: true,
        image: true,
        verified: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching user collections:", error);
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
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const symbol = formData.get("symbol") as string;
    const description = formData.get("description") as string;
    const royaltyPercentage = parseFloat(
      formData.get("royaltyPercentage") as string
    );
    const category = formData.get("category") as string;
    const image = formData.get("image") as File;

    // Validate required fields
    if (!name || !symbol || !image) {
      return NextResponse.json(
        { error: "Name, symbol, and image are required" },
        { status: 400 }
      );
    }

    // Validate royalty percentage
    if (royaltyPercentage < 0 || royaltyPercentage > 20) {
      return NextResponse.json(
        { error: "Royalty percentage must be between 0 and 20" },
        { status: 400 }
      );
    }

    // Generate a mock contract address (in real app, this would be from blockchain deployment)
    const contractAddress = `0x${Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    let imageUpload: string | undefined;

    // Handle image update if provided
    if (image && image.size > 0) {
      try {
        const imageUrl = await uploadToCloudinary(image);
        imageUpload = imageUrl;
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        symbol,
        description,
        royaltyPercentage,
        category,
        image: imageUpload,
        contractAddress,
        creatorId: user.id,
        blockchain: "ethereum",
      },
    });

    return NextResponse.json({
      success: true,
      data: collection,
      message: "Collection created successfully",
    });
  } catch (error) {
    console.error("Error creating collection:", error);
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
