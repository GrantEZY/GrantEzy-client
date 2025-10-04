/**
 * Admin store using Zustand for admin-related state management
 */
import { create } from "zustand";

import { adminService } from "../services/admin.service";
import {
  AddOrganizationRequest,
  AddUserRequest,
  AdminUser,
  DeleteOrganizationRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  Organization,
  PaginationMeta,
  UpdateOrganizationRequest,
  UpdateUserRoleRequest,
} from "../types/admin.types";

interface AdminState {
  users: AdminUser[];
  pagination: PaginationMeta | null;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
}

interface AdminActions {
  getAllUsers: (params: GetAllUsersRequest) => Promise<void>;
  addUser: (data: AddUserRequest) => Promise<boolean>;
  updateUserRole: (data: UpdateUserRoleRequest) => Promise<boolean>;
  deleteUser: (data: DeleteUserRequest) => Promise<boolean>;
  clearUsers: () => void;
  setError: (error: string | null) => void;
  // Organization actions
  getOrganizations: () => Promise<void>;
  addOrganization: (data: AddOrganizationRequest) => Promise<boolean>;
  updateOrganization: (data: UpdateOrganizationRequest) => Promise<boolean>;
  deleteOrganization: (data: DeleteOrganizationRequest) => Promise<boolean>;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>((set) => ({
  // Initial state
  users: [],
  pagination: null,
  organizations: [],
  isLoading: false,
  error: null,

  // Actions
  getAllUsers: async (params: GetAllUsersRequest) => {
    set({ isLoading: true, error: null, users: [] }); // Clear existing users to force fresh display
    try {
      const response = await adminService.getAllUsers(params);

      if (response.status === 200) {
        // Create pagination metadata from the response
        const totalUsers = response.res.totalNumberOfUsers || 0;
        const pageSize = params.numberOfResults || 10;

        const pagination: PaginationMeta = {
          page: params.page || 1,
          limit: pageSize,
          total: totalUsers,
          totalPages: Math.ceil(totalUsers / pageSize),
        };

        set({
          users: response.res.users.map((user) => {
            return {
              ...user,
              // Ensure email is always available at the top level for compatibility
              email: user.contact?.email || user.email || "N/A",
              // Ensure names are available at the top level for compatibility
              firstName: user.person?.firstName || user.firstName || "N/A",
              lastName: user.person?.lastName || user.lastName || "",
            };
          }),
          pagination,
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

  addUser: async (data: AddUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.addUser(data);

      // Backend returns 201 for new users, 200 for existing users with role added
      if (response.status === 200 || response.status === 201) {
        set({ isLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add user";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  updateUserRole: async (data: UpdateUserRoleRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.updateUserRole(data);

      // Backend returns 204 for successful update
      if (response.status === 200 || response.status === 204) {
        set({ isLoading: false });
        return true;
      }
      return false;
    } catch (error: unknown) {
      let errorMessage = "Failed to update user role";

      // Extract detailed error message from API response
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Update user role error:", error);

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  deleteUser: async (data: DeleteUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.deleteUser(data);

      // Backend returns 200 for successful deletion
      if (response.status === 200) {
        set({ isLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete user";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
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

  // Organization actions
  getOrganizations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getOrganizations();

      if (response.status === 200) {
        set({
          organizations: response.res.organizations,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch organizations";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  addOrganization: async (data: AddOrganizationRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.addOrganization(data);

      if (response.status === 200) {
        set({ isLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add organization";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  updateOrganization: async (data: UpdateOrganizationRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.updateOrganization(data);

      if (response.status === 200) {
        set({ isLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update organization";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  deleteOrganization: async (data: DeleteOrganizationRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.deleteOrganization(data);

      if (response.status === 200) {
        set({ isLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete organization";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },
}));
