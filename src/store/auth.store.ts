/**
 * Authentication store using Zustand
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authService } from '../services/auth.service';
import {
  AuthState,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
  UserCommitmentStatus,
} from '../types/auth.types';
import { storageUtil } from '../utils/storage.util';

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
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
      isHydrated: false,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);

          if (response.status === 200) {
            // Extract user data and access token from response
            const userData = response.res;

            const tokens: AuthTokens = {
              accessToken: userData.accessToken,
              // Note: refreshToken is in httpOnly cookie "jwtToken" (managed by backend)
            };

            // Store accessToken in localStorage
            storageUtil.setTokens(tokens);

            // Fetch full user profile after successful login
            try {
              const userService = await import('../services/user.service');
              const profileResponse = await userService.userService.getUserProfile();
              
              if (profileResponse.status === 200 && profileResponse.res.user) {
                // Use profile data but override role with the selected login role
                // This allows users to login with any role (for testing/development)
                const profileUser = profileResponse.res.user;
                set({
                  user: {
                    ...profileUser,
                    role: [userData.role], // Use the role from login response, not database
                  },
                  tokens,
                  isAuthenticated: true,
                  isLoading: false,
                });
              } else {
                throw new Error('Failed to fetch user profile');
              }
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
              // Fallback: create minimal user object from login response
              const [firstName = '', ...lastNameParts] = (userData.name || '').split(' ');
              const user: User = {
                personId: userData.id,
                person: {
                  id: userData.id,
                  firstName,
                  lastName: lastNameParts.join(' '),
                },
                contact: {
                  email: userData.email,
                  phone: null,
                  address: null,
                },
                role: [userData.role],
                commitment: UserCommitmentStatus.FULL_TIME,
                status: 'ACTIVE',
                isGCVmember: false,
                slug: null,
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
          } else {
            // Handle non-200 status from backend
            set({ isLoading: false });
            const errorMessage = response.message || 'Login failed';
            console.error('Login failed:', response);
            throw new Error(errorMessage);
          }
        } catch (error) {
          set({ isLoading: false });
          console.error('Login error:', error);
          // Re-throw with better error message
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('An unexpected error occurred during login');
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(userData);

          if (response.status === 201) {
            // Handle successful registration
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
          const response = await authService.refreshToken();

          if (response.status === 200) {
            const newAccessToken = response.res.accessToken;
            const tokens: AuthTokens = {
              accessToken: newAccessToken,
            };

            get().setTokens(tokens);
            return true;
          }

          // If refresh failed, clear auth
          get().clearAuth();
          return false;
        } catch (error) {
          // Refresh token expired or invalid - clear auth and redirect to login
          get().clearAuth();

          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return false;
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
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
