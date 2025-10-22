import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search");
    const verified = searchParams.get("verified");

    const skip = (page - 1) * limit;

    const where: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(verified && { verified: verified === "true" }),
    };

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
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
        orderBy: { createdAt: "desc" },
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
    return NextResponse.json(
      { error: "Failed to fetch collections", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const symbol = formData.get("symbol") as string;
    const description = formData.get("description") as string;
    const royaltyPercentage = parseFloat(
      formData.get("royaltyPercentage") as string
    );
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Collection image is required", success: false },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    // Generate contract address (mock)
    const contractAddress = `0x${Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    const collection = await prisma.collection.create({
      data: {
        name,
        symbol,
        description,
        contractAddress,
        creatorId: user.id,
        royaltyPercentage,
        category,
        image: (uploadResult as any).secure_url,
        ipfsMetadataUri: (uploadResult as any).secure_url,
        blockchain: "ethereum",
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: collection,
      message: "Collection created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Create collection error:", error);
    return NextResponse.json(
      { error: "Failed to create collection", success: false },
      { status: 500 }
    );
  }
}
