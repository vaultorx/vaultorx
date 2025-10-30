import {
  PrismaClient,
  UserRole,
  AuctionType,
  AuctionStatus,
  Rarity,
  User,
} from "@/lib/generated/prisma";
import { WalletService } from "@/lib/services/wallet-service";
import bcrypt from "bcrypt"
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Sample data
const SAMPLE_USERS = [
  { email: "alice@nft.com", name: "Alice Collector", username: "alice_nft" },
  { email: "bob@creator.com", name: "Bob Creator", username: "bob_creator" },
  {
    email: "charlie@trader.com",
    name: "Charlie Trader",
    username: "charlie_trader",
  },
  { email: "diana@artist.com", name: "Diana Artist", username: "diana_artist" },
  {
    email: "evan@investor.com",
    name: "Evan Investor",
    username: "evan_investor",
  },
];

const SAMPLE_COLLECTIONS = [
  {
    name: "CryptoPunks Legacy",
    symbol: "CPL",
    description: "Digital artifacts on the blockchain",
    royalty: 5.0,
  },
  {
    name: "Bored Ape Yacht Club",
    symbol: "BAYC",
    description: "10,000 unique Bored Apes",
    royalty: 7.5,
  },
  {
    name: "Art Blocks Curated",
    symbol: "ABC",
    description: "Generative art collection",
    royalty: 10.0,
  },
  {
    name: "Doodles",
    symbol: "DOODLE",
    description: "A community-driven collectibles project",
    royalty: 5.0,
  },
  {
    name: "Moonbirds",
    symbol: "MOON",
    description: "A community of NFT enthusiasts and collectors",
    royalty: 7.5,
  },
];

const NFT_CATEGORIES = [
  "art",
  "gaming",
  "photography",
  "3d",
  "animated",
  "collectibles",
  "music",
  "pfps",
  "sports",
  "fashion",
];

const NFT_NAMES = {
  art: [
    "Digital Dream",
    "Abstract Vision",
    "Color Symphony",
    "Pixel Harmony",
    "Virtual Canvas",
  ],
  gaming: [
    "Dragon Sword",
    "Space Warrior",
    "Magic Potion",
    "Ancient Relic",
    "Cyber Armor",
  ],
  photography: [
    "Golden Hour",
    "Urban Jungle",
    "Mountain Peak",
    "Ocean Depth",
    "City Lights",
  ],
  "3d": [
    "Digital Sculpture",
    "Hologram Model",
    "Virtual Statue",
    "3D Masterpiece",
    "Cyber Object",
  ],
  animated: [
    "Moving Art",
    "Live Painting",
    "Dynamic Vision",
    "Motion Piece",
    "Animated Dream",
  ],
  collectibles: [
    "Rare Token",
    "Collector Item",
    "Limited Edition",
    "Special Issue",
    "Exclusive Piece",
  ],
  music: [
    "Sound Wave",
    "Audio Visual",
    "Rhythm NFT",
    "Melody Token",
    "Harmony Piece",
  ],
  pfps: [
    "Cool Avatar",
    "Profile Pic",
    "Identity NFT",
    "Persona Token",
    "Character Head",
  ],
  sports: [
    "Champion Moment",
    "Victory Token",
    "Athlete NFT",
    "Game Highlight",
    "Sports Memory",
  ],
  fashion: [
    "Digital Wear",
    "Virtual Fashion",
    "Style Token",
    "Couture NFT",
    "Fashion Piece",
  ],
};

function generateContractAddress(): string {
  return `0x${Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}`;
}

function generateTokenId(): string {
  return Math.floor(Math.random() * 10000).toString();
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomRarity(): Rarity {
  const rarities = [Rarity.Common, Rarity.Rare, Rarity.Epic, Rarity.Legendary];
  const weights = [0.6, 0.25, 0.1, 0.05]; // Probability weights
  const random = Math.random();
  let cumulativeWeight = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      return rarities[i];
    }
  }
  return Rarity.Common;
}

function generateAttributes(category: string, rarity: Rarity): any {
  const baseAttributes: any = {
    rarity: rarity,
    edition: Math.floor(Math.random() * 1000) + 1,
    created: new Date().getFullYear(),
  };

  switch (category) {
    case "art":
      return {
        ...baseAttributes,
        style: getRandomItem([
          "Abstract",
          "Surreal",
          "Minimalist",
          "Pop Art",
          "Digital",
        ]),
        medium: "Digital",
        colors: getRandomItem(["Warm", "Cool", "Monochromatic", "Vibrant"]),
      };
    case "gaming":
      return {
        ...baseAttributes,
        game: getRandomItem([
          "Metaverse Legends",
          "Crypto Arena",
          "Blockchain Quest",
          "NFT Warriors",
        ]),
        type: getRandomItem(["Weapon", "Character", "Item", "Power-up"]),
        power: Math.floor(Math.random() * 100) + 1,
      };
    case "photography":
      return {
        ...baseAttributes,
        location: getRandomItem([
          "Urban",
          "Nature",
          "Portrait",
          "Architecture",
        ]),
        camera: getRandomItem(["DSLR", "Mirrorless", "Film", "Digital"]),
        aperture: `f/${getRandomItem([1.8, 2.8, 4, 5.6, 8])}`,
      };
    default:
      return baseAttributes;
  }
}

function calculatePrice(rarity: Rarity): number {
  const basePrices = {
    [Rarity.Common]: 0.1,
    [Rarity.Rare]: 0.5,
    [Rarity.Epic]: 2.0,
    [Rarity.Legendary]: 10.0,
  };
  // Add some randomness
  const variation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  return basePrices[rarity] * variation;
}

async function main() {
  console.log("🌱 Starting comprehensive database seeding...");

  // Check database connection
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }

  // Initialize platform wallets first
  console.log("💰 Initializing platform wallets...");
  try {
    await WalletService.initializeWallets();
    console.log("✅ Platform wallets initialized");
  } catch (error) {
    console.error("❌ Failed to initialize wallets:", error);
    throw error;
  }

  // Get wallet stats
  const walletStats = await WalletService.getWalletStats();
  console.log(
    `📊 Wallet Stats: ${walletStats.available}/${walletStats.total} available`
  );

  // Create or update superadmin
  const superAdminEmail =
    process.env.SUPERADMIN_EMAIL || "superadmin@nftplatform.com";
  const superAdminPassword =
    process.env.SUPERADMIN_PASSWORD || "SuperAdmin123!";

  let superAdmin: any = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 12);
    superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        name: "NFT Platform SuperAdmin",
        username: "superadmin",
        password: hashedPassword,
        role: UserRole.SUPERADMIN,
        emailVerified: true,
        walletBalance: 1000, // Starting balance
      },
    });

    // Assign wallet to user
    try {
      await WalletService.assignWalletToUser(superAdmin.id);
      superAdmin = await prisma.user.findUnique({
        where: { id: superAdmin.id },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          assignedWallet: true,
          walletAssignedAt: true,
        },
      });
      console.log(
        `   ✅ ${superAdmin.email} - Assigned wallet: ${superAdmin?.assignedWallet}`
      );
    } catch (walletError) {
      console.error(
        `   ❌ Failed to assign wallet to ${superAdmin.email}:`,
        walletError
      );
      // Continue without wallet assignment
      await prisma.user.update({
        where: { id: superAdmin.id },
        data: {
          assignedWallet: null,
          walletAssignedAt: null,
        },
      });
    }
    console.log("✅ SuperAdmin created");
  }

  console.log("✅ SuperAdmin setup complete");

  // Create or update Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nftplatform.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";

  let adminUser: any = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "NFT Platform Admin",
        username: "platform_admin",
        password: hashedPassword,
        role: UserRole.ADMIN, // Set role to ADMIN
        emailVerified: true,
        walletBalance: 500, // Starting balance for admin
      },
    });

    // Assign wallet to Admin user
    try {
      await WalletService.assignWalletToUser(adminUser.id);
      adminUser = await prisma.user.findUnique({
        where: { id: adminUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          assignedWallet: true,
          walletAssignedAt: true,
        },
      });
      console.log(
        `   ✅ ${adminUser.email} - Assigned wallet: ${adminUser?.assignedWallet}`
      );
    } catch (walletError) {
      console.error(
        `   ❌ Failed to assign wallet to ${adminUser.email}:`,
        walletError
      );
      // Continue without wallet assignment
      await prisma.user.update({
        where: { id: adminUser.id },
        data: {
          assignedWallet: null,
          walletAssignedAt: null,
        },
      });
    }
    console.log("✅ Admin user created");
  } else {
    // Ensure existing user's role is correct
    if (adminUser.role !== UserRole.ADMIN) {
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { role: UserRole.ADMIN },
      });
      adminUser.role = UserRole.ADMIN;
      console.log(`⚠️ Existing user ${adminUser.email} role updated to ADMIN`);
    }
    console.log("✅ Admin user already exists");
  }
  
  // Create sample users
  console.log("👥 Creating sample users...");
  const users = [superAdmin, adminUser];

  for (const userData of SAMPLE_USERS) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("Password123!", 12);
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role: UserRole.USER,
          emailVerified: true,
          walletBalance: Math.random() * 50 + 10, // Random balance between 10-60 ETH
        },
      });

      // Assign wallet to user
      try {
        await WalletService.assignWalletToUser(user.id);
        const userWithWallet = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            assignedWallet: true,
            walletAssignedAt: true,
          },
        });
        console.log(
          `   ✅ ${userData.email} - Assigned wallet: ${userWithWallet?.assignedWallet}`
        );
      } catch (walletError) {
        console.error(
          `   ❌ Failed to assign wallet to ${userData.email}:`,
          walletError
        );
        // Continue without wallet assignment
        await prisma.user.update({
          where: { id: user.id },
          data: {
            assignedWallet: null,
            walletAssignedAt: null,
          },
        });
      }

      users.push(user);
    } else {
      users.push(existingUser);
    }
  }
  console.log(`✅ ${users.length} users ready`);

  // Create collections
  console.log("🏛️ Creating collections...");
  const collections = [];

  for (const collectionData of SAMPLE_COLLECTIONS) {
    const creator = getRandomItem(
      users.filter((u) => u.role === UserRole.USER)
    );

    const collection = await prisma.collection.create({
      data: {
        name: collectionData.name,
        symbol: collectionData.symbol,
        description: collectionData.description,
        contractAddress: generateContractAddress(),
        creatorId: creator.id,
        royaltyPercentage: collectionData.royalty,
        floorPrice: Math.random() * 5 + 0.1,
        totalVolume: Math.random() * 1000 + 100,
        totalItems: 100,
        listedItems: Math.floor(Math.random() * 30) + 10,
        blockchain: "ethereum",
        ipfsMetadataUri: `ipfs://Qm${Math.random().toString(36).substring(2)}`,
        verified: Math.random() > 0.3, // 70% chance of being verified
        category: getRandomItem(NFT_CATEGORIES),
        image: "/placeholder.svg",
      },
    });
    collections.push(collection);
  }
  console.log(`✅ ${collections.length} collections created`);

  // Create NFTs
  console.log("🎨 Creating NFTs...");
  const nfts = [];

  for (let i = 0; i < 50; i++) {
    const collection = getRandomItem(collections);
    const owner = getRandomItem(users.filter((u) => u.role === UserRole.USER));
    const category = getRandomItem(NFT_CATEGORIES);
    const rarity = getRandomRarity();
    const price = calculatePrice(rarity);
    const nftNames =
      NFT_NAMES[category as keyof typeof NFT_NAMES] || NFT_NAMES.art;

    const nft = await prisma.nFTItem.create({
      data: {
        collectionId: collection.id,
        tokenId: generateTokenId(),
        ownerId: owner.id,
        name: `${getRandomItem(nftNames)} #${i + 1}`,
        description: `A unique ${category} NFT from the ${collection.name} collection`,
        image: "/placeholder.svg",
        ipfsMetadataUri: `ipfs://QmNFT${i}${Math.random()
          .toString(36)
          .substring(2)}`,
        category: category,
        rarity: rarity,
        likes: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 2000),
        attributes: generateAttributes(category, rarity),
        isListed: Math.random() > 0.3, // 70% chance of being listed
        listPrice: price,
        currency: "ETH",
      },
    });
    nfts.push(nft);
  }
  console.log(`✅ ${nfts.length} NFTs created`);

  // Create auctions for some NFTs
  console.log("⚡ Creating auctions...");
  const auctionTypes = Object.values(AuctionType);

  for (let i = 0; i < 15; i++) {
    const nft = getRandomItem(nfts.filter((n) => n.isListed));
    const auctionType = getRandomItem(auctionTypes);

    const startTime = new Date();
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days from now

    const auctionData: any = {
      nftItemId: nft.id,
      type: auctionType,
      status: getRandomItem([AuctionStatus.live, AuctionStatus.upcoming]),
      startingPrice: nft.listPrice! * 0.8,
      startTime: startTime,
      endTime: endTime,
      blockchain: "ethereum",
      tokenStandard: "ERC721",
    };

    // Add type-specific fields
    if (auctionType === AuctionType.RESERVE) {
      auctionData.reservePrice = nft.listPrice! * 1.2;
    } else if (auctionType === AuctionType.DUTCH) {
      auctionData.startingPrice = nft.listPrice! * 2;
    } else if (auctionType === AuctionType.BUY_NOW) {
      auctionData.buyNowPrice = nft.listPrice! * 1.5;
    } else if (auctionType === AuctionType.LOTTERY) {
      auctionData.ticketPrice = 0.01;
      auctionData.maxTickets = 100;
    }

    await prisma.auction.create({
      data: auctionData,
    });
  }
  console.log("✅ 15 auctions created");

  // Create some bids for live auctions
  console.log("💰 Creating sample bids...");
  const liveAuctions = await prisma.auction.findMany({
    where: { status: AuctionStatus.live },
  });

  for (const auction of liveAuctions) {
    const bidders = users.filter((u) => u.id !== superAdmin.id).slice(0, 3);

    for (const bidder of bidders) {
      await prisma.bid.create({
        data: {
          auctionId: auction.id,
          bidderId: bidder.id,
          amount: auction.startingPrice! * (1 + Math.random() * 0.5),
        },
      });
    }
  }
  console.log(`✅ Created bids for ${liveAuctions.length} auctions`);

  // Create some transactions
  console.log("🔄 Creating sample transactions...");
  for (let i = 0; i < 10; i++) {
    const nft = getRandomItem(nfts);
    const fromUser = getRandomItem(users);
    const toUser = getRandomItem(users.filter((u) => u.id !== fromUser.id));

    await prisma.transaction.create({
      data: {
        transactionHash: `0x${Math.random().toString(16).substring(2)}${i}`,
        nftItemId: nft.id,
        fromUserId: fromUser.id,
        toUserId: toUser.id,
        transactionType: getRandomItem(["sale", "transfer", "mint"]),
        price: nft.listPrice || Math.random() * 10,
        currency: "ETH",
        gasFee: Math.random() * 0.1,
        platformFee: Math.random() * 0.5,
        royaltyFee: Math.random() * 0.2,
        blockchain: "ethereum",
        status: "completed",
        nftName: nft.name,
        from: fromUser.username || fromUser.name,
        to: toUser.username || toUser.name,
        confirmedAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ), // Random date in last 30 days
      },
    });
  }
  console.log("✅ 10 sample transactions created");

  // Final wallet stats
  const finalWalletStats = await WalletService.getWalletStats();

  console.log("🎉 Database seeding completed successfully!");
  console.log("");
  console.log("📊 Seeding Summary:");
  console.log(`   👥 Users: ${users.length}`);
  console.log(`   🏛️ Collections: ${collections.length}`);
  console.log(`   🎨 NFTs: ${nfts.length}`);
  console.log(`   ⚡ Auctions: 15`);
  console.log(`   💰 Bids: Created for ${liveAuctions.length} auctions`);
  console.log(`   🔄 Transactions: 10`);
  console.log(
    `   💼 Wallets: ${finalWalletStats.assigned} assigned, ${finalWalletStats.available} available`
  );
  console.log("");
  console.log("🚀 Your NFT platform is ready for development!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
