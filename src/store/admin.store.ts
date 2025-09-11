/**
 * Admin store using Zustand for admin-related state management
 */
import { create } from "zustand";

import { adminService } from "../services/admin.service";
import {
  AddUserRequest,
  AdminUser,
  DeleteUserRequest,
  GetAllUsersRequest,
  PaginationMeta,
  UpdateUserRoleRequest,
} from "../types/admin.types";

interface AdminState {
  users: AdminUser[];
  pagination: PaginationMeta | null;
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
        // Map the backend user structure to frontend AdminUser structure
        const mappedUsers: AdminUser[] = response.res.users.map(
          (user: any) => ({
            id: user.personId,
            firstName: user.person.firstName,
            lastName: user.person.lastName,
            email: user.contact.email,
            role: user.role[0] ? JSON.parse(user.role[0])[0] : "NORMAL_USER",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }),
        );

        // Create pagination from the response
        const totalItems = response.res.totalNumberOfUsers;
        const currentPage = params.page;
        const itemsPerPage = params.numberOfResults;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const pagination: PaginationMeta = {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        };

        set({
          users: mappedUsers,
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

      if (response.status === 201) {
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

      if (response.status === 200) {
        set({ isLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user role";
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
}));
