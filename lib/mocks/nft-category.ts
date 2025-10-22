import { NFTCategory } from "../types";

const nftCatgories: NFTCategory[] = [
  {
    id: "gaming",
    name: "Gaming",
    icon: "Gamepad2",
    color: "from-green-500 to-emerald-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `gaming-${i + 1}`,
      collectionId: "collection-gaming",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Game Asset #${i + 1}`,
      description: `Rare gaming asset from the metaverse #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmGamingAsset${i + 1}`,
      category: "gaming",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 150 + i * 50,
      views: 1200 + i * 300,
      attributes: {
        game: "Metaverse Legends",
        type: i % 3 === 0 ? "Weapon" : i % 3 === 1 ? "Character" : "Item",
        power: 50 + i * 10,
        edition: i + 1,
      },
      isListed: true,
      listPrice: 0.5 + i * 0.3,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "art",
    name: "Digital Art",
    icon: "Palette",
    color: "from-purple-500 to-pink-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `art-${i + 1}`,
      collectionId: "collection-art",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Digital Canvas #${i + 1}`,
      description: `Unique digital artwork #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmDigitalArt${i + 1}`,
      category: "art",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 200 + i * 60,
      views: 2100 + i * 400,
      attributes: {
        style:
          i % 3 === 0 ? "Abstract" : i % 3 === 1 ? "Surreal" : "Minimalist",
        medium: "Digital",
        year: 2024,
        edition: i + 1,
      },
      isListed: true,
      listPrice: 1.2 + i * 0.4,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "photography",
    name: "Photography",
    icon: "Camera",
    color: "from-amber-500 to-orange-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `photo-${i + 1}`,
      collectionId: "collection-photo",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Moment #${i + 1}`,
      description: `Captured moment in time #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmPhoto${i + 1}`,
      category: "photography",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 120 + i * 40,
      views: 1500 + i * 200,
      attributes: {
        location: i % 3 === 0 ? "Urban" : i % 3 === 1 ? "Nature" : "Portrait",
        camera: "Professional DSLR",
        year: 2024,
        edition: i + 1,
      },
      isListed: true,
      listPrice: 0.8 + i * 0.2,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "3d",
    name: "3D Art",
    icon: "Cuboid",
    color: "from-blue-500 to-cyan-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `3d-${i + 1}`,
      collectionId: "collection-3d",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Sculpture #${i + 1}`,
      description: `3D digital sculpture #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://Qm3DArt${i + 1}`,
      category: "3d",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 180 + i * 70,
      views: 2800 + i * 500,
      attributes: {
        software: "Blender",
        polygons: 50000 + i * 10000,
        animated: i % 2 === 0,
        edition: i + 1,
      },
      isListed: true,
      listPrice: 1.5 + i * 0.5,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "animated",
    name: "Animated",
    icon: "Zap",
    color: "from-yellow-500 to-red-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `animated-${i + 1}`,
      collectionId: "collection-animated",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Motion #${i + 1}`,
      description: `Animated digital artwork #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmAnimated${i + 1}`,
      category: "animated",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 250 + i * 80,
      views: 3200 + i * 600,
      attributes: {
        duration: 5 + i,
        format: "MP4",
        loop: true,
        edition: i + 1,
      },
      isListed: true,
      listPrice: 2.1 + i * 0.6,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "collectibles",
    name: "Collectibles",
    icon: "Users",
    color: "from-indigo-500 to-purple-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `collectible-${i + 1}`,
      collectionId: "collection-collectibles",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Collector #${i + 1}`,
      description: `Rare collectible item #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmCollectible${i + 1}`,
      category: "collectibles",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 140 + i * 45,
      views: 1800 + i * 300,
      attributes: {
        series: "Genesis",
        number: i + 1,
        total: 1000,
        edition: i + 1,
      },
      isListed: true,
      listPrice: 0.9 + i * 0.3,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "music",
    name: "Music",
    icon: "Music",
    color: "from-pink-500 to-rose-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `music-${i + 1}`,
      collectionId: "collection-music",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Track #${i + 1}`,
      description: `Exclusive music track #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmMusic${i + 1}`,
      category: "music",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 170 + i * 55,
      views: 2300 + i * 400,
      attributes: {
        genre: i % 3 === 0 ? "Electronic" : i % 3 === 1 ? "Hip Hop" : "Ambient",
        duration: 180 + i * 30,
        format: "MP3",
        edition: i + 1,
      },
      isListed: true,
      listPrice: 1.1 + i * 0.4,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "pfps",
    name: "PFPs",
    icon: "Users",
    color: "from-teal-500 to-green-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `pfp-${i + 1}`,
      collectionId: "collection-pfps",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Avatar #${i + 1}`,
      description: `Profile picture avatar #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmPFP${i + 1}`,
      category: "pfps",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 130 + i * 35,
      views: 1600 + i * 200,
      attributes: {
        background:
          i % 4 === 0
            ? "Blue"
            : i % 4 === 1
            ? "Red"
            : i % 4 === 2
            ? "Green"
            : "Purple",
        accessories: 2 + (i % 3),
        edition: i + 1,
      },
      isListed: true,
      listPrice: 0.7 + i * 0.2,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "sports",
    name: "Sports",
    icon: "Trophy",
    color: "from-red-500 to-orange-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `sports-${i + 1}`,
      collectionId: "collection-sports",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Moment #${i + 1}`,
      description: `Sports highlight moment #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmSports${i + 1}`,
      category: "sports",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 220 + i * 65,
      views: 2900 + i * 500,
      attributes: {
        sport: i % 3 === 0 ? "Basketball" : i % 3 === 1 ? "Football" : "Soccer",
        athlete: "Professional Player",
        year: 2024,
        edition: i + 1,
      },
      isListed: true,
      listPrice: 1.8 + i * 0.5,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "Shirt",
    color: "from-fuchsia-500 to-purple-500",
    nfts: Array.from({ length: 10 }, (_, i) => ({
      id: `fashion-${i + 1}`,
      collectionId: "collection-fashion",
      tokenId: `${i + 1}`,
      ownerId: `user-${(i % 5) + 1}`,
      name: `Wearable #${i + 1}`,
      description: `Digital fashion wearable #${i + 1}`,
      image: "/placeholder.svg",
      ipfsMetadataUri: `ipfs://QmFashion${i + 1}`,
      category: "fashion",
      rarity:
        i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
      likes: 190 + i * 60,
      views: 2500 + i * 400,
      attributes: {
        type: i % 3 === 0 ? "Outfit" : i % 3 === 1 ? "Accessory" : "Footwear",
        brand: "Digital Couture",
        edition: i + 1,
      },
      isListed: true,
      listPrice: 1.4 + i * 0.4,
      currency: "ETH",
      createdAt: new Date(Date.now() - i * 86400000),
      updatedAt: new Date(),
    })),
  },
];

// Helper function to get category by ID
export function getCategoryById(categoryId: string) {
  return nftCatgories.find((category) => category.id === categoryId);
}

// Helper function to get all NFTs from a category
export function getNFTsByCategory(categoryId: string) {
  const category = getCategoryById(categoryId);
  return category ? category.nfts : [];
}

// Helper function to get all NFTs
export function getAllNFTs() {
  return nftCatgories.flatMap((category) => category.nfts);
}

// Helper function to get NFT by ID
export function getNFTById(nftId: string) {
  return getAllNFTs()?.find((nft) => nft.id === nftId);
}

export { nftCatgories };
