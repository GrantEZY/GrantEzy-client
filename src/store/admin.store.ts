/**
 * Admin store using Zustand for admin-related state management
 */
import { create } from "zustand";

import { adminService } from "../services/admin.service";
import {
  AdminUser,
  GetAllUsersRequest,
  PaginationMeta,
  AddUserRequest,
  UpdateUserRoleRequest,
  DeleteUserRequest,
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

        // Debug: Log the raw response to see what roles we're getting
        console.log('Fresh user data from backend:', response.res.users);

        set({
          users: response.res.users.map(user => {
            // Debug: Log each user's role data
            console.log(`User ${user.contact?.email || user.email}: role = ${JSON.stringify(user.role)}`);
            
            return {
              ...user,
              // Ensure email is always available at the top level for compatibility
              email: user.contact?.email || user.email || 'N/A',
              // Ensure names are available at the top level for compatibility  
              firstName: user.person?.firstName || user.firstName || 'N/A',
              lastName: user.person?.lastName || user.lastName || ''
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
      
      if (response.status === 200) {
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
      console.log('Updating user role with data:', data);
      const response = await adminService.updateUserRole(data);
      console.log('Update role response:', response);
      
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
