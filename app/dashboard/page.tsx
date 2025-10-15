"use client"

import { Header } from "@/components/header"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardQuickActions } from "@/components/dashboard-quick-actions"
import { DashboardRecentActivity } from "@/components/dashboard-recent-activity"
import { DashboardNFTGrid } from "@/components/dashboard-nft-grid"
import type { NFTItem } from "@/lib/types"

// Mock data
const mockOwnedNFTs: NFTItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `owned-nft-${i + 1}`,
  collectionId: `collection-${(i % 3) + 1}`,
  tokenId: `${i + 1}`,
  ownerId: "current-user",
  name: `My NFT #${i + 1}`,
  description: "A unique digital artwork",
  image: `/placeholder.svg`,
  ipfsMetadataUri: `ipfs://metadata-${i + 1}`,
  isListed: false,
  currency: "ETH",
  createdAt: new Date(),
  updatedAt: new Date(),
  category: "art",
  rarity: ["Common", "Rare", "Epic", "Legendary"][i % 4] as any,
  likes: Math.floor(Math.random() * 1000),
  views: Math.floor(Math.random() * 5000),
  collection: {
    id: `collection-${(i % 3) + 1}`,
    contractAddress: `0x${i.toString().padStart(40, "0")}`,
    name: `Collection ${(i % 3) + 1}`,
    creatorId: `user-${(i % 3) + 1}`,
    royaltyPercentage: 5,
    totalVolume: 1000,
    totalItems: 100,
    listedItems: 50,
    blockchain: "ethereum",
    createdAt: new Date(),
    updatedAt: new Date(),
    floorPrice: Number((Math.random() * 5 + 0.5).toFixed(2)),
  },
}))

const mockListedNFTs: NFTItem[] = Array.from({ length: 4 }, (_, i) => ({
  id: `listed-nft-${i + 1}`,
  collectionId: `collection-${i + 1}`,
  tokenId: `${i + 100}`,
  ownerId: "current-user",
  name: `Listed NFT #${i + 1}`,
  description: "A unique digital artwork for sale",
  image: `/placeholder.svg`,
  ipfsMetadataUri: `ipfs://metadata-${i + 100}`,
  isListed: true,
  listPrice: Number((Math.random() * 10 + 1).toFixed(2)),
  currency: "ETH",
  createdAt: new Date(),
  updatedAt: new Date(),
  category: "art",
  rarity: ["Common", "Rare", "Epic", "Legendary"][i % 4] as any,
  likes: Math.floor(Math.random() * 1000),
  views: Math.floor(Math.random() * 5000),
  collection: {
    id: `collection-${i + 1}`,
    contractAddress: `0x${i.toString().padStart(40, "0")}`,
    name: `Collection ${i + 1}`,
    creatorId: `user-${i + 1}`,
    royaltyPercentage: 5,
    totalVolume: 1000,
    totalItems: 100,
    listedItems: 50,
    blockchain: "ethereum",
    createdAt: new Date(),
    updatedAt: new Date(),
    floorPrice: Number((Math.random() * 5 + 0.5).toFixed(2)),
  },
}))

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your NFTs, track activity, and monitor your portfolio</p>
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <DashboardStats />

          {/* Quick Actions */}
          <DashboardQuickActions />

          {/* Recent Activity */}
          <DashboardRecentActivity />

          {/* NFT Grid */}
          <DashboardNFTGrid ownedNFTs={mockOwnedNFTs} listedNFTs={mockListedNFTs} />
        </div>
      </div>
    </div>
  )
}
