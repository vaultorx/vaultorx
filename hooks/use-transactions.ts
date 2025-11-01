"use client";

import { useState, useEffect } from "react";
import { Transaction, FilterOptions } from "@/lib/types";
import { transactionService } from "@/services/transaction-service";

export function useTransactions(params?: FilterOptions) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchTransactions = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      const response = await transactionService.getTransactions(
        filters || params
      );

      if (response.success) {
        setTransactions(response.data);
        setPagination(response.pagination || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [params?.type, params?.status, params?.page]);

  return {
    transactions,
    loading,
    error,
    pagination,
    refetch: fetchTransactions,
  };
}

export function useTransactionStats() {
  const [stats, setStats] = useState({
    totalVolume: 0,
    totalSales: 0,
    gasFees: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await transactionService.getTransactionStats();

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to fetch transaction stats");
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
