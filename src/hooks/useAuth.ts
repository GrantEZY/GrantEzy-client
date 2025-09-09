/**
 * Custom hooks for authentication
 */
import { useEffect } from "react";

import { useAuthStore } from "../store/auth.store";
import { LoginRequest, RegisterRequest } from "../types/auth.types";

export const useAuth = () => {
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    clearAuth,
    initialize,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return { success: false, error: message };
    }
  };

  const handleRegister = async (userData: RegisterRequest) => {
    try {
      await register(userData);
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      return { success: false, error: message };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed";
      return { success: false, error: message };
    }
  };

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Token refresh failed";
      return { success: false, error: message };
    }
  };

  return {
    // State
    user,
    tokens,
    isAuthenticated,
    isLoading,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    clearAuth,
  };
};
