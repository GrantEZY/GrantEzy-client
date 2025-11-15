/**
 * Custom hook for user profile functionality
 */

import { useUserStore } from "../store/user.store";
import { UpdateProfileRequest } from "../types/user.types";

export const useUser = () => {
  const store = useUserStore();
  const {
    profile,
    isLoading,
    error,
    getUserProfile,
    updateProfile,
    clearError,
    clearState,
  } = store;

  const handleGetUserProfile = async () => {
    try {
      await getUserProfile();
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch profile";
      return { success: false, error: message };
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data);
      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      return { success: false, error: message };
    }
  };

  return {
    // State
    profile,
    isLoading,
    error,

    // Actions
    getUserProfile: handleGetUserProfile,
    updateProfile: handleUpdateProfile,
    clearError,
    clearState,
  };
};
