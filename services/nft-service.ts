// services/nft-service.ts
import { apiClient } from "@/lib/api-client";
import { NFTItem, Collection, ApiResponse, FilterOptions } from "@/lib/types";

export interface CreateNFTData {
  name: string;
  description: string;
  collectionId: string;
  category: string;
  rarity: string;
  attributes?: Record<string, any>;
  image: File;
}

export interface UpdateNFTData {
  name?: string;
  description?: string;
  isListed?: boolean;
  listPrice?: number;
  currency?: string;
}

export class NFTService {
  // Get all NFTs with filtering and pagination
  async getNFTs(params?: FilterOptions): Promise<ApiResponse<NFTItem[]>> {
    return apiClient.get<NFTItem[]>("/nfts", params);
  }

  // Get NFT by ID
  async getNFTById(id: string): Promise<ApiResponse<NFTItem>> {
    return apiClient.get<NFTItem>(`/nfts/${id}`);
  }

  // Create new NFT with better error handling
  async createNFT(data: CreateNFTData): Promise<ApiResponse<NFTItem>> {
    try {
      console.log("Creating NFT with data:", {
        name: data.name,
        collectionId: data.collectionId,
        hasImage: !!data.image,
        imageSize: data.image?.size,
      });

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("collectionId", data.collectionId);
      formData.append("category", data.category);
      formData.append("rarity", data.rarity);

      if (data.attributes && Object.keys(data.attributes).length > 0) {
        formData.append("attributes", JSON.stringify(data.attributes));
      }

      if (!data.image) {
        throw new Error("Image file is required");
      }

      formData.append("image", data.image);

      const response = await apiClient.postFormData<NFTItem>("/nfts", formData);
      console.log("NFT creation API response:", response);
      return response;
    } catch (error) {
      console.error("Error in NFTService.createNFT:", error);
      throw error;
    }
  }

  // Update NFT
  async updateNFT(
    id: string,
    data: UpdateNFTData
  ): Promise<ApiResponse<NFTItem>> {
    return apiClient.put<NFTItem>(`/nfts/${id}`, data);
  }

  // List NFT for sale
  async listNFT(
    id: string,
    price: number,
    currency: string = "ETH"
  ): Promise<ApiResponse<NFTItem>> {
    return apiClient.post<NFTItem>(`/nfts/${id}/list`, { price, currency });
  }

  // Buy NFT
  async buyNFT(
    id: string
  ): Promise<ApiResponse<{ nft: NFTItem; transaction: any }>> {
    return apiClient.post<{ nft: NFTItem; transaction: any }>(
      `/nfts/${id}/buy`
    );
  }

  // Like NFT
  async likeNFT(id: string): Promise<ApiResponse<{ likes: number }>> {
    return apiClient.post<{ likes: number }>(`/nfts/${id}/like`);
  }

  // Get user's NFTs
  async getUserNFTs(
    userId: string,
    params?: FilterOptions
  ): Promise<ApiResponse<NFTItem[]>> {
    return apiClient.get<NFTItem[]>(`/users/${userId}/nfts`, params);
  }
}

export const nftService = new NFTService();
