// hooks/use-categories.ts
"use client";

import { useState, useEffect } from "react";
import { NFTCategory, NFTItem } from "@/lib/types";
import { categoryService } from "@/services/category-service";

export function useCategories() {
  const [categories, setCategories] = useState<NFTCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryService.getCategories();

      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

export function useCategoryNFTs(categoryId: string, limit: number = 10) {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryNFTs = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        setNfts([]);
        setLoading(false);
        return;
      }

      const response = await categoryService.getCategoryNFTs(id, limit);

      if (response.success) {
        setNfts(response.data);
      } else {
        setError(response.message || "Failed to fetch category NFTs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryNFTs(categoryId);
  }, [categoryId, limit]);

  return {
    nfts,
    loading,
    error,
    refetch: () => fetchCategoryNFTs(categoryId),
  };
}
