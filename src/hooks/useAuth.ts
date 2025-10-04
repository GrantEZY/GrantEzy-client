/**
 * Custom hooks for authentication
 */

import { useAuthStore } from "../store/auth.store";
import { LoginRequest, RegisterRequest } from "../types/auth.types";

export const useAuth = () => {
  const store = useAuthStore();
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
  } = store;

  // Note: AuthProvider handles initialization on app startup
  // No need to call initialize() here to avoid redundant calls

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials);
      // Get the updated user from the store after successful login
      const currentUser = useAuthStore.getState().user;
      return { success: true, user: currentUser };
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
      const success = await refreshToken();
      return { success };
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
