"use client";

import { useState, useEffect } from "react";
import { walletService } from "@/services/wallet-service";
import { NFTItem } from "@/lib/types";

export function useUserNFTs() {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.getUserNFTs();
      if (response.success) {
        setNfts(response.data);
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
  }, []);

  return {
    nfts,
    loading,
    error,
    refetch: fetchNFTs,
  };
}
