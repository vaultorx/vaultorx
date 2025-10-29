import { apiClient } from "@/lib/api-client";
import {
  Auction,
  NFTListing,
  SaleRecord,
  ApiResponse,
  FilterOptions,
} from "@/lib/types";

export interface CreateAuctionData {
  nftItemId: string;
  type: "english" | "dutch" | "vickrey";
  startingPrice?: number;
  reservePrice?: number;
  minimumBid?: number;
  bidIncrement?: number;
  startTime: string;
  endTime: string;
}

export interface PlaceBidData {
  amount: number;
}

export class MarketplaceService {
  // Get auctions
  async getAuctions(params?: FilterOptions): Promise<ApiResponse<Auction[]>> {
    return apiClient.get<Auction[]>("/auctions", params);
  }

  // Get auction by ID
  async getAuctionById(id: string): Promise<ApiResponse<Auction>> {
    return apiClient.get<Auction>(`/auctions/${id}`);
  }

  // Create auction
  async createAuction(data: CreateAuctionData): Promise<ApiResponse<Auction>> {
    return apiClient.post<Auction>("/auctions", data);
  }

  // Place bid
  async placeBid(
    auctionId: string,
    data: PlaceBidData
  ): Promise<ApiResponse<any>> {
    return apiClient.post<any>(`/auctions/${auctionId}/bids`, data);
  }

  // Get active listings
  async getActiveListings(
    params?: FilterOptions
  ): Promise<ApiResponse<NFTListing[]>> {
    return apiClient.get<NFTListing[]>("/marketplace/listings", params);
  }

  // Get sales records
  async getSalesRecords(
    params?: FilterOptions
  ): Promise<ApiResponse<SaleRecord[]>> {
    return apiClient.get<SaleRecord[]>("/analytics/sales", params);
  }
}

export const marketplaceService = new MarketplaceService();
