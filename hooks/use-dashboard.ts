"use client";

import { useState, useEffect } from "react";
import { DashboardStats, RecentActivity, QuickAction } from "@/lib/types";
import { dashboardService } from "@/services/dashboard-service";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, actionsResponse] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getQuickActions(),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data.stats);
        setRecentActivities(statsResponse.data.recentActivities);
      }

      if (actionsResponse.success) {
        setQuickActions(actionsResponse.data);
      }

      if (!statsResponse.success || !actionsResponse.success) {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentActivities,
    quickActions,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}
