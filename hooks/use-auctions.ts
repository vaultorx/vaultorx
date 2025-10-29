"use client";

import { useState, useEffect } from "react";
import { Auction, FilterOptions } from "@/lib/types";
import { marketplaceService } from "@/services/marketplace-service";

export function useAuctions(params?: FilterOptions) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchAuctions = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      const response = await marketplaceService.getAuctions(filters || params);

      if (response.success) {
        setAuctions(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || "Failed to fetch auctions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [params?.status, params?.type, params?.page]);

  return {
    auctions,
    loading,
    error,
    pagination,
    refetch: fetchAuctions,
  };
}

export function useAuctionStats() {
  const [stats, setStats] = useState({
    totalAuctions: 0,
    totalVolume: 0,
    activeBidders: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // This would typically come from a dedicated stats endpoint
      // For now, we'll calculate from auctions data
      const response = await marketplaceService.getAuctions();

      if (response.success) {
        const auctions = response.data;
        const totalAuctions = auctions.length;
        const totalVolume = auctions.reduce(
          (sum, auction) => sum + (auction.finalBid || auction.currentBid || 0),
          0
        );
        const activeBidders = new Set(auctions.flatMap((a) => a.bidders || []))
          .size;
        const successRate =
          (auctions.filter((a) => a.status === "ended" && a.finalBid).length /
            Math.max(auctions.length, 1)) *
          100;

        setStats({
          totalAuctions,
          totalVolume,
          activeBidders,
          successRate,
        });
      } else {
        setError(response.message || "Failed to fetch auction stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
