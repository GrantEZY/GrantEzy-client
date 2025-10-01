/**
 * Authentication store using Zustand
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { authService } from "../services/auth.service";
import {
  AuthState,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
  UserCommitmentStatus,
} from "../types/auth.types";
import { storageUtil } from "../utils/storage.util";

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  initialize: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);

          if (response.status === 200) {
            // Extract user data and access token from response
            const userData = response.res;

            const tokens: AuthTokens = {
              accessToken: userData.accessToken || "",
            };

            // Store tokens in localStorage
            storageUtil.setTokens(tokens);

            const user: User = {
              id: userData.id,
              firstName: userData.name?.split(" ")[0] || "",
              lastName: userData.name?.split(" ")[1] || "",
              email: userData.email,
              role: userData.role,
              commitment: UserCommitmentStatus.FULL_TIME, // Default value, adjust as needed
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set({
              user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(userData);

          if (response.status === 201) {
            // Handle successful registration
            // You might want to automatically log in or redirect
            set({ isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          get().clearAuth();
        } catch (error) {
          // Even if logout fails on server, clear local auth
          get().clearAuth();
        }
      },

      refreshToken: async () => {
        try {
          const tokens = await authService.refreshToken();
          get().setTokens(tokens);
        } catch (error) {
          get().clearAuth();
          throw error;
        }
      },

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
        storageUtil.setUser(user);
      },

      setTokens: (tokens: AuthTokens) => {
        set({ tokens });
        storageUtil.setTokens(tokens);
      },

      clearAuth: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
        storageUtil.clearAuthData();
      },

      initialize: () => {
        const user = storageUtil.getUser();
        const accessToken = storageUtil.getAccessToken();
        const refreshToken = storageUtil.getRefreshToken();

        if (user && accessToken && refreshToken) {
          set({
            user,
            tokens: { accessToken, refreshToken },
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
