/**
 * Authentication service for handling auth-related API calls
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
import {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      data,
    );
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
  }

  async logout(): Promise<void> {
    return httpClient.post<void>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  }

  async refreshToken(): Promise<AuthTokens> {
    return httpClient.get<AuthTokens>(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
  }

  async checkHealth(): Promise<{ status: string }> {
    return httpClient.get<{ status: string }>(API_CONFIG.ENDPOINTS.HEALTH);
  }
}

export const authService = new AuthService();
