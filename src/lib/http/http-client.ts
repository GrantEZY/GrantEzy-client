/**
 * HTTP client with interceptors for authentication and error handling
 */
import { ApiError } from "../../types/api.types";
import { API_CONFIG, getApiUrl, STORAGE_KEYS } from "../config/api.config";

export class HttpClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    return null;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      ...API_CONFIG.HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(getApiUrl(endpoint));

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: "POST",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: "PUT",
      headers: this.getAuthHeaders(),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: "DELETE",
      headers: this.getAuthHeaders(),
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }
}

export const httpClient = new HttpClient();
