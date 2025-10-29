import { apiClient } from "@/lib/api-client";
import {
  DashboardStats,
  RecentActivity,
  QuickAction,
  ApiResponse,
} from "@/lib/types";

export class DashboardService {
  // Get dashboard stats
  async getDashboardStats(): Promise<
    ApiResponse<{
      stats: DashboardStats;
      recentActivities: RecentActivity[];
    }>
  > {
    return apiClient.get<{
      stats: DashboardStats;
      recentActivities: RecentActivity[];
    }>("/dashboard/stats");
  }

  // Get quick actions
  async getQuickActions(): Promise<ApiResponse<QuickAction[]>> {
    return apiClient.get<QuickAction[]>("/dashboard/quick-actions");
  }

  // Get visitor analytics
  async getVisitorAnalytics(days: number = 7): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>("/analytics/visitors", { days });
  }

  // Get sales distribution
  async getSalesDistribution(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>("/analytics/sales-distribution");
  }
}

export const dashboardService = new DashboardService();
