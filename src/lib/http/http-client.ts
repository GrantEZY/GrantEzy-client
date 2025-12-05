/**
 * HTTP client with interceptors for authentication and error handling
 */
import { API_CONFIG, getApiUrl, STORAGE_KEYS } from "../config/api.config";

export class HttpClient {
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

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

  private getPublicHeaders(): HeadersInit {
    return {
      ...API_CONFIG.HEADERS,
      // Explicitly no Authorization header for public endpoints
    };
  }

  private handleAuthError(): void {
    if (typeof window !== "undefined") {
      // Clear auth data
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      // Get current path to redirect back after login
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath === "/login";
      const isSignupPage = currentPath === "/signup";

      // Only redirect if not already on auth pages
      if (!isLoginPage && !isSignupPage) {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    // If already refreshing, return existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(
          getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH),
          {
            method: "GET",
            headers: API_CONFIG.HEADERS,
            credentials: "include", // Important: sends httpOnly "jwtToken" cookie
          },
        );

        if (!response.ok) {
          throw new Error("Token refresh failed");
        }

        const data = await response.json();

        if (data.status === 200 && data.res?.accessToken) {
          // Update accessToken in localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.res.accessToken);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Token refresh error:", error);
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async handleResponse<T>(
    response: Response,
    retryRequest?: () => Promise<Response>,
  ): Promise<T> {
    // First, check HTTP status
    if (!response.ok) {
      // Handle authentication errors (401 Unauthorized)
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();

        if (refreshed && retryRequest) {
          // Retry the original request with new token
          const retryResponse = await retryRequest();
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }

        // If refresh failed or retry failed, redirect to login
        this.handleAuthError();
        throw new Error("Authentication required. Redirecting to login...");
      }

      // Handle other HTTP errors - try to extract backend error message
      try {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);

        // Backend returns {status, message, res} format OR NestJS validation error format
        let errorMessage = `HTTP error! status: ${response.status}`;

        if (errorData.message) {
          // Check if it's an array of validation errors (NestJS format)
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(", ");
          } else {
            errorMessage = errorData.message;
          }
        }

        console.error("Extracted error message:", errorMessage);
        throw new Error(errorMessage);
      } catch (error) {
        // If JSON parsing fails, throw with status
        if (error instanceof Error && !error.message.includes("HTTP error!")) {
          throw error; // Re-throw if it's our formatted error
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    // Parse JSON response
    const data = await response.json();

    // Backend sometimes returns errors with HTTP 200 but error status in body
    // Check if response has error status in the JSON body
    if (data && typeof data === "object" && "status" in data) {
      const bodyStatus = data.status as number;
      // If body status indicates error (400+), throw with the backend message
      if (bodyStatus >= 400) {
        const errorMessage = (data as any).message || `Error: ${bodyStatus}`;
        console.error(
          `Backend returned error status ${bodyStatus}:`,
          errorMessage,
        );
        throw new Error(errorMessage);
      }
    }

    return data as T;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(getApiUrl(endpoint));

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const makeRequest = async () =>
      fetch(url.toString(), {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const makeRequest = async () =>
      fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const makeRequest = async () =>
      fetch(getApiUrl(endpoint), {
        method: "PUT",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const makeRequest = async () =>
      fetch(getApiUrl(endpoint), {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    const makeRequest = async () =>
      fetch(getApiUrl(endpoint), {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  // Public methods that don't send authentication headers
  async publicGet<T>(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(getApiUrl(endpoint));

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getPublicHeaders(),
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  async publicPost<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: "POST",
      headers: this.getPublicHeaders(),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async publicPatch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: "PATCH",
      headers: this.getPublicHeaders(),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export const httpClient = new HttpClient();
