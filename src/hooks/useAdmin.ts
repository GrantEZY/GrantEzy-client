/**
 * Custom hooks for admin functionality
 */
import { useCallback } from "react";

import { useAdminStore } from "../store/admin.store";
import { 
  GetAllUsersRequest,
  AddUserRequest,
  UpdateUserRoleRequest,
  DeleteUserRequest 
} from "../types/admin.types";
import { UserRoles } from "../types/auth.types";

export const useAdmin = () => {
  const {
    users,
    pagination,
    isLoading,
    error,
    getAllUsers,
    addUser,
    updateUserRole,
    deleteUser,
    clearUsers,
    setError,
  } = useAdminStore();

  const fetchUsers = useCallback(
    async (params: GetAllUsersRequest) => {
      try {
        await getAllUsers(params);
        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch users";
        return { success: false, error: message };
      }
    },
    [getAllUsers],
  );

  const fetchUsersWithDefaults = useCallback(
    async (overrides: Partial<GetAllUsersRequest> = {}) => {
      const defaultParams: GetAllUsersRequest = {
        page: 1,
        numberOfResults: 10,
        ...overrides,
      };

      return fetchUsers(defaultParams);
    },
    [fetchUsers],
  );

  const fetchUsersByRole = useCallback(
    async (role: UserRoles, page = 1, numberOfResults = 10) => {
      return fetchUsers({
        page,
        numberOfResults,
        filter: { role },
      });
    },
    [fetchUsers],
  );

  const refreshUsers = useCallback(async () => {
    if (pagination) {
      return fetchUsers({
        page: pagination.currentPage,
        numberOfResults: pagination.itemsPerPage,
      });
    }
    return fetchUsersWithDefaults();
  }, [fetchUsers, fetchUsersWithDefaults, pagination]);

  const createUser = useCallback(
    async (userData: AddUserRequest) => {
      try {
        const success = await addUser(userData);
        return { success };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create user";
        return { success: false, error: message };
      }
    },
    [addUser],
  );

  const updateUser = useCallback(
    async (userData: UpdateUserRoleRequest) => {
      try {
        const success = await updateUserRole(userData);
        return { success };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update user";
        return { success: false, error: message };
      }
    },
    [updateUserRole],
  );

  const removeUser = useCallback(
    async (userData: DeleteUserRequest) => {
      try {
        const success = await deleteUser(userData);
        return { success };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete user";
        return { success: false, error: message };
      }
    },
    [deleteUser],
  );

  return {
    // State
    users,
    pagination,
    isLoading,
    error,

    // Actions
    fetchUsers,
    fetchUsersWithDefaults,
    fetchUsersByRole,
    refreshUsers,
    createUser,
    updateUser,
    removeUser,
    clearUsers,
    setError,
  };
};
