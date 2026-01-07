/**
 * Authentication service for handling auth-related API calls
 */
import { API_CONFIG } from '../lib/config/api.config';
import { httpClient } from '../lib/http/http-client';
import {
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/auth.types';

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
  }

  async logout(): Promise<void> {
    return httpClient.post<void>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  }

  async refreshToken(): Promise<RefreshResponse> {
    // Backend reads refreshToken from httpOnly "jwtToken" cookie automatically
    // Returns: { status, message, res: { userData, accessToken } }
    return httpClient.get<RefreshResponse>(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return httpClient.post<ForgotPasswordResponse>(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return httpClient.post<ResetPasswordResponse>(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  async checkHealth(): Promise<{ status: string }> {
    return httpClient.get<{ status: string }>(API_CONFIG.ENDPOINTS.HEALTH);
  }
}

export const authService = new AuthService();
