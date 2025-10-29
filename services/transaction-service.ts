import { apiClient } from "@/lib/api-client";
import { Transaction, ApiResponse, FilterOptions } from "@/lib/types";

export class TransactionService {
  // Get all transactions
  async getTransactions(
    params?: FilterOptions
  ): Promise<ApiResponse<Transaction[]>> {
    return apiClient.get<Transaction[]>("/transactions", params);
  }

  // Get transaction by ID
  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    return apiClient.get<Transaction>(`/transactions/${id}`);
  }

  // Get user transactions
  async getUserTransactions(
    userId: string,
    params?: FilterOptions
  ): Promise<ApiResponse<Transaction[]>> {
    return apiClient.get<Transaction[]>(
      `/users/${userId}/transactions`,
      params
    );
  }

  // Get transaction stats
  async getTransactionStats(): Promise<
    ApiResponse<{
      totalVolume: number;
      totalSales: number;
      gasFees: number;
      pendingCount: number;
    }>
  > {
    return apiClient.get<{
      totalVolume: number;
      totalSales: number;
      gasFees: number;
      pendingCount: number;
    }>("/transactions/stats");
  }
}

export const transactionService = new TransactionService();
