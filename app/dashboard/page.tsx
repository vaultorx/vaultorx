"use client"

import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardQuickActions } from "@/components/dashboard-quick-actions"
import { DashboardRecentActivity } from "@/components/dashboard-recent-activity"
import { DashboardNFTGrid } from "@/components/dashboard-nft-grid"
import type { NFTItem } from "@/lib/types"

import {
  dashboardStats,
  recentActivities,
  quickActions,
  nftItems,
} from "@/lib/mocks";

export default function DashboardPage() {
  // Filter owned and listed NFTs
  const ownedNFTs = nftItems.filter((nft) => !nft.isListed);
  const listedNFTs = nftItems.filter((nft) => nft.isListed);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your NFTs, track activity, and monitor your portfolio
          </p>
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <DashboardStats stats={dashboardStats} />

          {/* Quick Actions */}
          <DashboardQuickActions actions={quickActions} />

          {/* Recent Activity */}
          <DashboardRecentActivity activities={recentActivities} />

          {/* NFT Grid */}
          <DashboardNFTGrid ownedNFTs={ownedNFTs} listedNFTs={listedNFTs} />
        </div>
      </div>
    </div>
  );
}
