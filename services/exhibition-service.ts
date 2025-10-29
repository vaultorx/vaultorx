import { apiClient } from "@/lib/api-client";
import { Exhibition, ApiResponse, FilterOptions } from "@/lib/types";

export interface CreateExhibitionData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  featuredNFTs: string[];
  totalNFTs: number;
  curator: string;
  image?: File;
}

export class ExhibitionService {
  // Get all exhibitions
  async getExhibitions(
    params?: FilterOptions
  ): Promise<ApiResponse<Exhibition[]>> {
    return apiClient.get<Exhibition[]>("/exhibitions", params);
  }

  // Get exhibition by ID
  async getExhibitionById(id: string): Promise<ApiResponse<Exhibition>> {
    return apiClient.get<Exhibition>(`/exhibitions/${id}`);
  }

  // Create exhibition
  async createExhibition(
    data: CreateExhibitionData
  ): Promise<ApiResponse<Exhibition>> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("location", data.location);
    formData.append("featuredNFTs", JSON.stringify(data.featuredNFTs));
    formData.append("totalNFTs", data.totalNFTs.toString());
    formData.append("curator", data.curator);

    if (data.image) {
      formData.append("image", data.image);
    }

    return apiClient.postFormData<Exhibition>("/exhibitions", formData);
  }

  // Update exhibition
  async updateExhibition(
    id: string,
    data: Partial<Exhibition>
  ): Promise<ApiResponse<Exhibition>> {
    return apiClient.put<Exhibition>(`/exhibitions/${id}`, data);
  }

  // Delete exhibition
  async deleteExhibition(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/exhibitions/${id}`);
  }
}

export const exhibitionService = new ExhibitionService();
