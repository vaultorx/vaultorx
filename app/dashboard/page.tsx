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
import { useDashboard } from "@/hooks/use-dashboard"
import { useNFTs } from "@/hooks/use-nfts"

export default function DashboardPage() {

  const {
    stats,
    recentActivities,
    quickActions,
    loading: dashboardLoading,
    error: dashboardError,
  } = useDashboard();
  const {
    nfts: userNFTs,
    loading: nftsLoading,
    error: nftsError,
  } = useNFTs({ limit: 50 });

  // Filter owned and listed NFTs
  const ownedNFTs = userNFTs.filter((nft) => !nft.isListed);
  const listedNFTs = userNFTs.filter((nft) => nft.isListed);

   if (dashboardError || nftsError) {
     return (
       <div className="min-h-screen">
         <div className="container mx-auto px-4 py-8">
           <div className="text-center py-12">
             <h3 className="text-lg font-semibold mb-2">
               Failed to load dashboard data
             </h3>
             <p className="text-muted-foreground">
               {dashboardError || nftsError}
             </p>
           </div>
         </div>
       </div>
     );
   }

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
          <DashboardStats stats={stats} loading={dashboardLoading} />

          {/* Quick Actions */}
          <DashboardQuickActions
            actions={quickActions}
            loading={dashboardLoading}
          />

          {/* Recent Activity */}
          <DashboardRecentActivity
            activities={recentActivities}
            loading={dashboardLoading}
          />

          {/* NFT Grid */}
          <DashboardNFTGrid
            ownedNFTs={ownedNFTs}
            listedNFTs={listedNFTs}
            loading={nftsLoading}
          />
        </div>
      </div>
    </div>
  );
}
