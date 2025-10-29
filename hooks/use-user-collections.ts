"use client";

import { useState, useEffect } from "react";
import { Collection, CollectionStats } from "@/lib/types";
import { collectionService } from "@/services/collection-service";

export function useUserCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching user collections...");

      // Use the existing collection service but with user-specific endpoint
      const response = await collectionService.getUserCollections();

      if (response.success) {
        setCollections(response.data);
        console.log("Fetched user collections:", response.data.length);
      } else {
        setError(response.message || "Failed to fetch user collections");
      }
    } catch (err) {
      console.error("Error fetching user collections:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCollections();
  }, []);

  return {
    collections,
    loading,
    error,
    refetch: fetchUserCollections,
  };
}

export function useUserCollectionsStats() {
  const [stats, setCollectionsStats] = useState<CollectionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching user collections...");

      // Use the existing collection service but with user-specific endpoint
      const response = await collectionService.getUserCollectionStats();

      if (response.success) {
        setCollectionsStats(response.data);
        console.log("Fetched user collections:", response.data.length);
      } else {
        setError(response.message || "Failed to fetch user collections");
      }
    } catch (err) {
      console.error("Error fetching user collections:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCollections();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchUserCollections,
  };
}
