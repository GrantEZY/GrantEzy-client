/**
 * User Profile Store
 * Manages user profile state
 */

import { create } from 'zustand';
import { userService } from '../services/user.service';
import { UserProfile, UpdateProfileRequest } from '../types/user.types';

interface UserState {
  // State
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getUserProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  clearError: () => void;
  clearState: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // Initial State
  profile: null,
  isLoading: false,
  error: null,

  // Get User Profile
  getUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getUserProfile();

      if (response.status === 200) {
        set({
          profile: response.res.user,
          isLoading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to fetch user profile',
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // Update Profile
  updateProfile: async (data: UpdateProfileRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.updateProfile(data);

      if (response.status === 200) {
        set({
          profile: response.res.user,
          isLoading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to update profile',
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // Clear Error
  clearError: () => set({ error: null }),

  // Clear State
  clearState: () =>
    set({
      profile: null,
      isLoading: false,
      error: null,
    }),
}));
