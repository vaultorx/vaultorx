"use client";

import { useState, useEffect } from "react";
import { Exhibition, FilterOptions } from "@/lib/types";
import { exhibitionService } from "@/services/exhibition-service";

interface ExhibitionStats {
  totalExhibitions: number;
  activeExhibitions: number;
  upcomingExhibitions: number;
  totalViews: number;
  totalLikes: number;
}


export function useExhibitions(params?: FilterOptions) {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchExhibitions = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      const response = await exhibitionService.getExhibitions(
        filters || params
      );

      if (response.success) {
        setExhibitions(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || "Failed to fetch exhibitions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, [params?.status, params?.page]);

  return {
    exhibitions,
    loading,
    error,
    pagination,
    refetch: fetchExhibitions,
  };
}

export function useExhibitionStats() {
  const [stats, setStats] = useState<ExhibitionStats>({
    totalExhibitions: 0,
    activeExhibitions: 0,
    upcomingExhibitions: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/exhibitions/stats");

      if (!response.ok) {
        throw new Error(`Failed to fetch exhibition stats: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || "Failed to fetch exhibition stats");
        // Set default stats if API fails
        setStats({
          totalExhibitions: 0,
          activeExhibitions: 0,
          upcomingExhibitions: 0,
          totalViews: 0,
          totalLikes: 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Set default stats on error
      setStats({
        totalExhibitions: 0,
        activeExhibitions: 0,
        upcomingExhibitions: 0,
        totalViews: 0,
        totalLikes: 0,
      });
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
