/**
 * Admin store using Zustand for admin-related state management
 */
import { create } from "zustand";

import { adminService } from "../services/admin.service";
import {
  AdminUser,
  GetAllUsersRequest,
  PaginationMeta,
} from "../types/admin.types";

interface AdminState {
  users: AdminUser[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

interface AdminActions {
  getAllUsers: (params: GetAllUsersRequest) => Promise<void>;
  clearUsers: () => void;
  setError: (error: string | null) => void;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>((set) => ({
  // Initial state
  users: [],
  pagination: null,
  isLoading: false,
  error: null,

  // Actions
  getAllUsers: async (params: GetAllUsersRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getAllUsers(params);

      if (response.status === 200) {
        set({
          users: response.data.users,
          pagination: response.data.pagination,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  clearUsers: () => {
    set({
      users: [],
      pagination: null,
      error: null,
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
