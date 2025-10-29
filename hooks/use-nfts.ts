"use client";

import { useState, useEffect } from "react";
import { NFTItem, FilterOptions } from "@/lib/types";
import { nftService } from "@/services/nft-service";

export function useNFTs(params?: FilterOptions) {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchNFTs = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      const response = await nftService.getNFTs(filters || params);

      if (response.success) {
        setNfts(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || "Failed to fetch NFTs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [params?.search, params?.category, params?.page, params?.sortBy]);

  return {
    nfts,
    loading,
    error,
    pagination,
    refetch: fetchNFTs,
  };
}
