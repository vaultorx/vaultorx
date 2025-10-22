import { NFTItem } from "../types";

export const nftArray: NFTItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `gaming-${i + 1}`,
  collectionId: "collection-gaming",
  tokenId: `${i + 1}`,
  ownerId: `user-${(i % 5) + 1}`,
  name: `Game Asset #${i + 1}`,
  description: `Rare gaming asset from the metaverse #${i + 1}`,
  image: "/placeholder.svg",
  ipfsMetadataUri: `ipfs://QmGamingAsset${i + 1}`,
  category: "gaming",
  rarity: i === 0 ? "Legendary" : i === 1 ? "Epic" : i < 5 ? "Rare" : "Common",
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
}));