import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    const where: any = {
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { collection: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [nfts, total] = await Promise.all([
      prisma.nFTItem.findMany({
        where,
        include: {
          collection: true,
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.nFTItem.count({ where }),
    ]);

    return NextResponse.json({
      data: nfts,
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
      { error: "Failed to fetch NFTs", success: false },
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
    const description = formData.get("description") as string;
    const collectionId = formData.get("collectionId") as string;
    const category = formData.get("category") as string;
    const rarity = formData.get("rarity") as string;
    const attributes = formData.get("attributes") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image is required", success: false },
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

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found", success: false },
        { status: 404 }
      );
    }

    // Generate token ID
    const tokenCount = await prisma.nFTItem.count({
      where: { collectionId },
    });
    const tokenId = (tokenCount + 1).toString();

    const nft = await prisma.nFTItem.create({
      data: {
        name,
        description,
        collectionId,
        tokenId,
        ownerId: user.id,
        image: (uploadResult as any).secure_url,
        ipfsMetadataUri: (uploadResult as any).secure_url, // Using Cloudinary URL as mock IPFS
        category,
        rarity: rarity as any,
        attributes: attributes ? JSON.parse(attributes) : {},
        currency: "ETH",
      },
      include: {
        collection: true,
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    // Create mint transaction
    await prisma.transaction.create({
      data: {
        transactionHash: `mint_${Date.now()}_${nft.id}`,
        nftItemId: nft.id,
        toUserId: user.id,
        transactionType: "mint",
        nftName: nft.name,
        to: user.username || user.email,
        status: "completed",
        confirmedAt: new Date(),
      },
    });

    // Update collection stats
    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        totalItems: { increment: 1 },
      },
    });

    return NextResponse.json({
      data: nft,
      message: "NFT minted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Mint NFT error:", error);
    return NextResponse.json(
      { error: "Failed to mint NFT", success: false },
      { status: 500 }
    );
  }
}
