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

      // Map frontend sort options to API compatible sort options
      const apiParams = { ...filters };

      // Ensure sortOrder is properly set based on sortBy
      if (apiParams.sortBy === "price-low") {
        apiParams.sortOrder = "asc";
      } else if (apiParams.sortBy === "price-high") {
        apiParams.sortOrder = "desc";
      }

      const response = await nftService.getNFTs(apiParams);

      if (response.success) {
        setNfts(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || "Failed to fetch NFTs");
        setNfts([]);
        setPagination(null);
      }
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setNfts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [
    params?.search,
    params?.category,
    params?.page,
    params?.sortBy,
    params?.limit,
  ]);

  return {
    nfts,
    loading,
    error,
    pagination,
    refetch: fetchNFTs,
  };
}
