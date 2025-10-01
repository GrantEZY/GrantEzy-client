/**
 * Storage utilities for managing localStorage
 * Note: Cookies are managed by backend (httpOnly refreshToken as "jwtToken")
 */
import { STORAGE_KEYS } from "../lib/config/api.config";
import { AuthTokens, User } from "../types/auth.types";

export class StorageUtil {
  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  // Token management (localStorage only)
  setTokens(tokens: AuthTokens): void {
    if (!this.isClient()) return;

    // Only store accessToken in localStorage
    // refreshToken is managed by backend as httpOnly cookie "jwtToken"
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  }

  getAccessToken(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  removeTokens(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    // Note: httpOnly "jwtToken" cookie is cleared by backend on logout
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
    // Backend will clear httpOnly "jwtToken" cookie on logout
  }
}

export const storageUtil = new StorageUtil();
