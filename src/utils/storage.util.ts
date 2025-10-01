/**
 * Storage utilities for managing localStorage/sessionStorage
 */
import { STORAGE_KEYS } from "../lib/config/api.config";
import { AuthTokens, User } from "../types/auth.types";

export class StorageUtil {
  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  // Token management
  setTokens(tokens: AuthTokens): void {
    if (!this.isClient()) return;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    }

    // Also set as cookie for middleware to access
    document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    if (tokens.refreshToken) {
      document.cookie = `refreshToken=${tokens.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
    }
  }

  getAccessToken(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  removeTokens(): void {
    if (!this.isClient()) return;

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    // Also clear cookies
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
  }

  // User management
  setUser(user: User): void {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): User | null {
    if (!this.isClient()) return null;

    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  removeUser(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Clear all auth data
  clearAuthData(): void {
    this.removeTokens();
    this.removeUser();
  }
}

export const storageUtil = new StorageUtil();
