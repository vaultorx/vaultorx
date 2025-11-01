"use client";

import { useState, useEffect } from "react";
import { Collection, CollectionStats, FilterOptions } from "@/lib/types";
import { collectionService } from "@/services/collection-service";

export function useCollections(params?: FilterOptions) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchCollections = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching collections with params:", filters);

      const response = await collectionService.getCollections(
        filters || params
      );

      if (response.success) {
        setCollections(response.data);
        setPagination(response.pagination || null);
        console.log("Fetched collections:", response.data.length);
      }
    } catch (err) {
      console.error("Error fetching collections:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [JSON.stringify(params)]); // Use JSON.stringify for proper dependency tracking

  return {
    collections,
    loading,
    error,
    pagination,
    refetch: fetchCollections,
  };
}

export function useCollectionStats(params?: FilterOptions) {
  const [stats, setStats] = useState<CollectionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      const response = await collectionService.getCollectionStats(
        filters || params
      );

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to fetch collection stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [JSON.stringify(params)]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
