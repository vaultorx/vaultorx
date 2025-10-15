import { NFTItem } from "@/lib/types";

export const mockNFTs: NFTItem[] = Array.from({ length: 48 }, (_, i) => ({
  id: `nft-${i + 1}`,
  collectionId: `collection-${(i % 8) + 1}`,
  tokenId: `${i + 1}`,
  ownerId: `user-${i + 1}`,
  name: `Digital Art #${i + 1}`,
  description: "A unique digital artwork",
  image: `/placeholder.svg`,
  ipfsMetadataUri: `ipfs://metadata-${i + 1}`,
  isListed: i % 3 !== 0,
  listPrice:
    i % 3 !== 0 ? Number((Math.random() * 10 + 0.5).toFixed(2)) : undefined,
  currency: "ETH",
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
  updatedAt: new Date(),
  category: [
    "art",
    "gaming",
    "photography",
    "3d",
    "animated",
    "collectibles",
    "music",
    "pfps",
  ][i % 8],
  rarity: ["Common", "Rare", "Epic", "Legendary"][i % 4] as
    | "Common"
    | "Rare"
    | "Epic"
    | "Legendary",
  likes: Math.floor(Math.random() * 1000),
  views: Math.floor(Math.random() * 5000),
  collection: {
    id: `collection-${(i % 8) + 1}`,
    contractAddress: `0x${i.toString().padStart(40, "0")}`,
    name: `Collection ${(i % 8) + 1}`,
    creatorId: `user-${(i % 8) + 1}`,
    royaltyPercentage: 5,
    totalVolume: 1000 + Math.random() * 5000,
    totalItems: 100,
    listedItems: 50,
    blockchain: "ethereum",
    createdAt: new Date(),
    updatedAt: new Date(),
    floorPrice: Number((Math.random() * 5 + 0.5).toFixed(2)),
  },
}));
