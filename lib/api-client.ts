import { ApiResponse } from "@/lib/types";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  private cleanParams(params?: Record<string, any>): Record<string, any> {
    if (!params) return {};

    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const cleanedParams = this.cleanParams(params);
    const queryString = cleanedParams
      ? new URLSearchParams(cleanedParams).toString()
      : "";
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request<T>(url, {
      method: "GET",
      ...options,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  }

  // Form data upload (for images/files)
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: {
        // Let browser set Content-Type with boundary for FormData
      },
      body: formData,
      ...options,
    });
  }
}

export const apiClient = new ApiClient();
