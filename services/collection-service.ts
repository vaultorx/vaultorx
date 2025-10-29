// services/collection-service.ts
import { apiClient } from "@/lib/api-client";
import {
  Collection,
  CollectionStats,
  ApiResponse,
  FilterOptions,
} from "@/lib/types";

export interface CreateCollectionData {
  name: string;
  symbol: string;
  description: string;
  royaltyPercentage: number;
  category: string;
  image: File;
}

export class CollectionService {
  // Get all collections (public)
  async getCollections(
    params?: FilterOptions
  ): Promise<ApiResponse<Collection[]>> {
    console.log("CollectionService.getCollections called with:", params);
    const result = await apiClient.get<Collection[]>("/collections", params);
    console.log("CollectionService.getCollections result:", result);
    return result;
  }

  // Get user's collections
  async getUserCollections(): Promise<ApiResponse<Collection[]>> {
    console.log("CollectionService.getUserCollections called");
    const result = await apiClient.get<Collection[]>("/user/collections");
    console.log("CollectionService.getUserCollections result:", result);
    return result;
  }

  // Get collection by ID
  async getCollectionById(id: string): Promise<ApiResponse<Collection>> {
    console.log("CollectionService.getCollectionById called with:", id);
    const result = await apiClient.get<Collection>(`/collections/${id}`);
    console.log("CollectionService.getCollectionById result:", result);
    return result;
  }

  // Get collection stats (public)
  async getCollectionStats(
    params?: FilterOptions
  ): Promise<ApiResponse<CollectionStats[]>> {
    return apiClient.get<CollectionStats[]>("/collections/stats", params);
  }

  // Get user collection stats
  async getUserCollectionStats(): Promise<ApiResponse<CollectionStats[]>> {
    return apiClient.get<CollectionStats[]>("/user/collections/stats");
  }

  // Create new collection
  async createCollection(
    data: CreateCollectionData
  ): Promise<ApiResponse<Collection>> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("symbol", data.symbol);
    formData.append("description", data.description);
    formData.append("royaltyPercentage", data.royaltyPercentage.toString());
    formData.append("category", data.category);
    formData.append("image", data.image);

    return apiClient.postFormData<Collection>("/user/collections", formData);
  }

  // Get collection NFTs
  async getCollectionNFTs(
    collectionId: string,
    params?: FilterOptions
  ): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`/collections/${collectionId}/nfts`, params);
  }

  // Get collection activity
  async getCollectionActivity(
    collectionId: string,
    params?: FilterOptions
  ): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(
      `/collections/${collectionId}/activity`,
      params
    );
  }

  async updateCollection(
    id: string,
    data: Partial<CreateCollectionData> & { image?: File }
  ): Promise<ApiResponse<Collection>> {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.royaltyPercentage !== undefined)
      formData.append("royaltyPercentage", data.royaltyPercentage.toString());
    if (data.category) formData.append("category", data.category);
    if (data.image) formData.append("image", data.image);

    return apiClient.putFormData<Collection>(
      `/user/collections/${id}`,
      formData
    );
  }

  // Delete collection
  async deleteCollection(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/user/collections/${id}`);
  }
}

export const collectionService = new CollectionService();
