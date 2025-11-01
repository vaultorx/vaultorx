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
    const sortBy = searchParams.get("sortBy") || "recent";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const listedOnly = searchParams.get("listed") === "true";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters", success: false },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause safely
    const where: any = {
      // Add default filters if needed
    };

    if (category && category !== "all" && category !== "") {
      where.category = category;
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { collection: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (listedOnly) {
      where.isListed = true;
      where.listPrice = { not: null };
    }

    // Handle price filtering
    if (minPrice || maxPrice) {
      where.listPrice = {};

      if (minPrice) {
        const minPriceNum = parseFloat(minPrice);
        if (isNaN(minPriceNum) || minPriceNum < 0) {
          return NextResponse.json(
            { error: "Invalid minPrice parameter", success: false },
            { status: 400 }
          );
        }
        where.listPrice.gte = minPriceNum;
      }

      if (maxPrice) {
        const maxPriceNum = parseFloat(maxPrice);
        if (isNaN(maxPriceNum) || maxPriceNum < 0) {
          return NextResponse.json(
            { error: "Invalid maxPrice parameter", success: false },
            { status: 400 }
          );
        }
        where.listPrice.lte = maxPriceNum;
      }

      // If both min and max are provided, ensure min <= max
      if (minPrice && maxPrice) {
        const minPriceNum = parseFloat(minPrice);
        const maxPriceNum = parseFloat(maxPrice);
        if (minPriceNum > maxPriceNum) {
          return NextResponse.json(
            {
              error: "minPrice cannot be greater than maxPrice",
              success: false,
            },
            { status: 400 }
          );
        }
      }
    }

    // Map frontend sort options to actual database fields
    const getOrderBy = () => {
      const order: any = sortOrder === "asc" ? "asc" : "desc";

      switch (sortBy) {
        case "recent":
          return { createdAt: order };
        case "price-low":
          return { listPrice: "asc" };
        case "price-high":
          return { listPrice: "desc" };
        case "most-liked":
          return { likes: order };
        case "most-viewed":
          return { views: order };
        case "rare":
          return { rarity: order };
        default:
          return { createdAt: "desc" };
      }
    };

    const orderBy: any = getOrderBy();

    // Execute queries with error handling
    let nfts: any[] = [];
    let total = 0;

    try {
      [nfts, total] = await Promise.all([
        prisma.nFTItem.findMany({
          where,
          include: {
            collection: {
              select: {
                id: true,
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
          orderBy,
          skip,
          take: limit,
        }),
        prisma.nFTItem.count({ where }),
      ]);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database query failed", success: false },
        { status: 500 }
      );
    }

    // Transform data for frontend
    const transformedNFTs = nfts.map((nft) => ({
      ...nft,
      // Ensure all required fields are present
      listPrice: nft.listPrice || null,
      currency: nft.currency || "ETH",
      attributes: nft.attributes || {},
    }));

    return NextResponse.json({
      data: transformedNFTs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error("Failed to fetch NFTs:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
        message: error
      },
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

    // Find user with better error handling
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    } catch (userError) {
      console.error("User lookup error:", userError);
      return NextResponse.json(
        { error: "User lookup failed", success: false },
        { status: 500 }
      );
    }

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

    // Validate required fields with better error messages
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "NFT name is required", success: false },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Description is required", success: false },
        { status: 400 }
      );
    }

    if (!collectionId) {
      return NextResponse.json(
        { error: "Collection is required", success: false },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required", success: false },
        { status: 400 }
      );
    }

    if (!rarity) {
      return NextResponse.json(
        { error: "Rarity is required", success: false },
        { status: 400 }
      );
    }

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image is required", success: false },
        { status: 400 }
      );
    }

    // Validate file type and size
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image", success: false },
        { status: 400 }
      );
    }

    // Check file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: "Image size must be less than 10MB", success: false },
        { status: 400 }
      );
    }

    // Check if collection exists
    let collection;
    try {
      collection = await prisma.collection.findUnique({
        where: { id: collectionId },
      });
    } catch (collectionError) {
      console.error("Collection lookup error:", collectionError);
      return NextResponse.json(
        { error: "Collection lookup failed", success: false },
        { status: 500 }
      );
    }

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found", success: false },
        { status: 404 }
      );
    }

    // Upload image to Cloudinary with better error handling
    let uploadResult;
    try {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "nfts",
              format: "webp", // Convert to webp for better performance
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image", success: false },
        { status: 500 }
      );
    }

    // Generate token ID
    let tokenCount;
    try {
      tokenCount = await prisma.nFTItem.count({
        where: { collectionId },
      });
    } catch (countError) {
      console.error("Token count error:", countError);
      return NextResponse.json(
        { error: "Failed to generate token ID", success: false },
        { status: 500 }
      );
    }

    const tokenId = (tokenCount + 1).toString();

    // Parse attributes safely
    let parsedAttributes = {};
    if (attributes) {
      try {
        parsedAttributes = JSON.parse(attributes);
      } catch (parseError) {
        console.error("Attributes parse error:", parseError);
        return NextResponse.json(
          { error: "Invalid attributes format", success: false },
          { status: 400 }
        );
      }
    }

    // Validate rarity enum
    const validRarities = ["Common", "Rare", "Epic", "Legendary"];
    if (!validRarities.includes(rarity)) {
      return NextResponse.json(
        { error: "Invalid rarity value", success: false },
        { status: 400 }
      );
    }

    // Create NFT with transaction for data consistency
    let nft;
    try {
      nft = await prisma.$transaction(async (tx) => {
        const newNFT = await tx.nFTItem.create({
          data: {
            name: name.trim(),
            description: description.trim(),
            collectionId,
            tokenId,
            ownerId: user.id,
            image: (uploadResult as any).secure_url,
            ipfsMetadataUri: (uploadResult as any).secure_url,
            category,
            rarity: rarity as any,
            attributes: parsedAttributes,
            currency: "ETH",
          },
          include: {
            collection: {
              select: {
                id: true,
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
                email: true,
              },
            },
          },
        });

        // Create mint transaction
        await tx.transaction.create({
          data: {
            transactionHash: `mint_${Date.now()}_${newNFT.id}`,
            nftItemId: newNFT.id,
            toUserId: user.id,
            transactionType: "mint",
            nftName: newNFT.name,
            to: user.username || user.email,
            status: "completed",
            confirmedAt: new Date(),
          },
        });

        // Update collection stats
        await tx.collection.update({
          where: { id: collectionId },
          data: {
            totalItems: { increment: 1 },
          },
        });

        return newNFT;
      });
    } catch (dbError) {
      console.error("Database transaction error:", dbError);

      // Handle specific error cases
      if (dbError instanceof Error) {
        if (dbError.message.includes("Unique constraint")) {
          return NextResponse.json(
            {
              error: "NFT with similar attributes already exists",
              success: false,
            },
            { status: 409 }
          );
        }
        if (dbError.message.includes("Invalid enum value")) {
          return NextResponse.json(
            { error: "Invalid rarity value", success: false },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: "Failed to create NFT", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: nft,
      message: "NFT minted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Mint NFT error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
}
