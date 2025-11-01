"use client";

import { useState, useEffect } from "react";
import { SaleRecord, NFTListing, FilterOptions } from "@/lib/types";
import { marketplaceService } from "@/services/marketplace-service";

export function useSales(params?: FilterOptions) {
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>([]);
  const [activeListings, setActiveListings] = useState<NFTListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesData = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      const [salesResponse, listingsResponse] = await Promise.all([
        marketplaceService.getSalesRecords(filters || params),
        marketplaceService.getActiveListings(filters || params),
      ]);

      if (salesResponse.success) {
        setSalesRecords(salesResponse.data);
      }

      if (listingsResponse.success) {
        setActiveListings(listingsResponse.data);
      }

      if (!salesResponse.success || !listingsResponse.success) {
        setError("Failed to fetch sales data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [params?.timeRange]);

  return {
    salesRecords,
    activeListings,
    loading,
    error,
    refetch: fetchSalesData,
  };
}

export function useSalesStats() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalVolume: 0,
    avgSalePrice: 0,
    royaltyEarnings: 0,
    activeListings: 0,
    soldThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await marketplaceService.getSalesRecords();

      if (response.success) {
        const sales = response.data;
        const totalSales = sales.length;
        const totalVolume = sales.reduce(
          (sum, sale) => sum + sale.salePrice,
          0
        );
        const avgSalePrice = totalSales > 0 ? totalVolume / totalSales : 0;
        const royaltyEarnings = sales.reduce(
          (sum, sale) => sum + sale.royalty,
          0
        );
        const soldThisMonth = sales.filter((sale) => {
          const saleDate = new Date(sale.saleDate);
          const now = new Date();
          return (
            saleDate.getMonth() === now.getMonth() &&
            saleDate.getFullYear() === now.getFullYear()
          );
        }).length;

        // Get active listings count
        const listingsResponse = await marketplaceService.getActiveListings();
        const activeListings = listingsResponse.success
          ? listingsResponse.data.length
          : 0;

        setStats({
          totalSales,
          totalVolume,
          avgSalePrice,
          royaltyEarnings,
          activeListings,
          soldThisMonth,
        });
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
