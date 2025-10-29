import { ApiResponse, NFTCategory, NFTItem } from "@/lib/types";

export const categoryService = {
  async getCategories(): Promise<ApiResponse<NFTCategory[]>> {
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        data: [],
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch categories",
      };
    }
  },

  async getCategoryById(categoryId: string): Promise<ApiResponse<NFTItem[]>> {
    try {
      const response = await fetch(`/api/categories?id=${categoryId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching category NFTs:", error);
      return {
        data: [],
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch category NFTs",
      };
    }
  },

  async getCategoryNFTs(
    categoryId: string,
    limit: number = 10
  ): Promise<ApiResponse<NFTItem[]>> {
    try {
      const response = await fetch(
        `/api/categories?id=${categoryId}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching category NFTs:", error);
      return {
        data: [],
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch category NFTs",
      };
    }
  },
};
