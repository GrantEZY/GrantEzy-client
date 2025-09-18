"use client";

import { useCallback, useEffect, useState } from "react";

import { AddUserModal } from "@/components/admin/AddUserModal";
import { DeleteUserModal } from "@/components/admin/DeleteUserModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import AdminLayout from "@/components/layout/AdminLayout";
import { showToast, ToastProvider } from "@/components/ui/ToastNew";

import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";

import {
  AddUserRequest,
  AdminUser,
  DeleteUserRequest,
  PaginationMeta,
  UpdateRole,
} from "@/types/admin.types";
import { UserRoles } from "@/types/auth.types";

interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}

function UserTable({
  users,
  isLoading,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Name
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Email
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Role
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Created Date
            </th>

            <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {users.length === 0 ? (
            <tr>
              <td className="px-6 py-8 text-center text-gray-500" colSpan={5}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr className="hover:bg-gray-50" key={user.personId || user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.person?.firstName || user.firstName || "N/A"}{" "}
                    {user.person?.lastName || user.lastName || ""}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {user.contact?.email || user.email || "N/A"}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    {Array.isArray(user.role)
                      ? user.role[0]
                      : user.role || "N/A"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>

                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button
                    className="mr-3 text-blue-600 hover:text-blue-900"
                    onClick={() => onEditUser(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => onDeleteUser(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (!pagination) return null;

  const currentPage = pagination.page;
  const { totalPages } = pagination;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Add safety checks for NaN values
  const safeCurrentPage = isNaN(currentPage) ? 1 : currentPage;
  const safeTotalPages = isNaN(totalPages) ? 1 : totalPages;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          Previous
        </button>

        <button
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasNextPage}
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{safeCurrentPage}</span>{" "}
            of <span className="font-medium">{safeTotalPages}</span>
          </p>
        </div>

        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <button
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!hasPreviousPage}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <span className="sr-only">Previous</span>

              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  fillRule="evenodd"
                />
              </svg>
            </button>

            {Array.from({ length: Math.min(5, safeTotalPages) }, (_, i) => {
              const pageNum =
                safeCurrentPage <= 3 ? i + 1 : safeCurrentPage - 2 + i;
              if (pageNum > safeTotalPages) return null;

              return (
                <button
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    pageNum === safeCurrentPage
                      ? "z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900"
                  }`}
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!hasNextPage}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <span className="sr-only">Next</span>

              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

function AdminUsersPageContent() {
  const { isAuthenticated, user } = useAuth();
  const {
    users,
    pagination,
    isLoading,
    error,
    fetchUsersWithDefaults,
    fetchUsersByRole,
    createUser,
    updateUser,
    removeUser,
  } = useAdmin();

  // Admin store for user profile functionality (temporarily disabled)
  // const {
  //   selectedUserProfile,
  //   getUserProfile,
  //   isLoading: profileLoading,
  //   error: profileError,
  //   setError: setProfileError
  // } = useAdminStore();

  const [selectedRole, setSelectedRole] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const loadUsers = useCallback(async () => {
    if (selectedRole === "ALL") {
      await fetchUsersWithDefaults({
        page: currentPage,
        numberOfResults: pageSize,
      });
    } else {
      await fetchUsersByRole(selectedRole as UserRoles, currentPage, pageSize);
    }
  }, [
    selectedRole,
    currentPage,
    pageSize,
    fetchUsersWithDefaults,
    fetchUsersByRole,
  ]);

  useEffect(() => {
    if (isAuthenticated && user?.role === UserRoles.ADMIN) {
      loadUsers();
    }
  }, [isAuthenticated, user, loadUsers]);

  // Handle profile errors (temporarily disabled)
  // useEffect(() => {
  //   if (profileError) {
  //     showToast.error(profileError);
  //     setProfileError(null);
  //   }
  // }, [profileError, setProfileError]);

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Modal handlers
  const handleAddUser = async (userData: AddUserRequest) => {
    const result = await createUser(userData);
    if (result.success) {
      await loadUsers(); // Refresh the user list
      showToast.success("User role added successfully!");
    } else {
      showToast.error(result.error || "Failed to add user role");
    }
    return result;
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userData: {
    email: string;
    role: UserRoles;
  }) => {
    // For role updates, we need to handle the logic of replacing roles
    // The backend requires separate ADD_ROLE and DELETE_ROLE operations

    const currentUser = selectedUser;
    if (!currentUser) return { success: false, error: "No user selected" };

    // Extract current role with better validation
    let currentRole: UserRoles | null = null;
    if (Array.isArray(currentUser.role)) {
      // Filter out any invalid roles and take the first valid one
      const validRoles = currentUser.role.filter((role) =>
        Object.values(UserRoles).includes(role as UserRoles),
      );
      currentRole = validRoles.length > 0 ? (validRoles[0] as UserRoles) : null;
    } else if (
      currentUser.role &&
      Object.values(UserRoles).includes(currentUser.role as UserRoles)
    ) {
      currentRole = currentUser.role as UserRoles;
    }

    const newRole = userData.role;

    // Validate that newRole is a valid UserRoles value
    const validRoles = Object.values(UserRoles);
    if (!validRoles.includes(newRole)) {
      console.warn("Invalid new role detected:", newRole);
      return { success: false, error: `Invalid new role: ${newRole}` };
    }

    let result: { success: boolean; error?: string } = { success: true };

    try {
      // For role changes, we need to be careful about the order of operations
      // to avoid violating the "user must have at least one role" constraint

      if (newRole !== currentRole) {
        // Step 1: Add the new role first (so user has both old and new temporarily)
        const addResult = await updateUser({
          email: userData.email,
          type: UpdateRole.ADD_ROLE,
          role: newRole,
        });

        if (!addResult.success) {
          const errorMsg = addResult.error || "Failed to add new role";
          throw new Error(`Failed to add new role: ${errorMsg}`);
        }

        // Step 2: Remove the old role (only if it's not NORMAL_USER and different from new role)
        if (
          currentRole &&
          currentRole !== UserRoles.NORMAL_USER &&
          currentRole !== newRole
        ) {
          const removeResult = await updateUser({
            email: userData.email,
            type: UpdateRole.DELETE_ROLE,
            role: currentRole,
          });

          if (!removeResult.success) {
            const errorMsg = removeResult.error || "Failed to remove old role";
            console.warn(
              `Warning: New role was added but old role removal failed: ${errorMsg}`,
            );
            // Don't throw error here - the new role was successfully added
            // The user now has both roles, which is acceptable
          }
        }
      }
    } catch (error) {
      result = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update role",
      };
    }

    if (result.success) {
      // Clear any cached state and close modal first
      setSelectedUser(null);
      setIsEditModalOpen(false);

      // Force refresh the user list to get updated data from database
      // This ensures the table shows the latest role information
      await loadUsers();

      showToast.success(
        `User role updated successfully! Table refreshed with latest data.`,
      );
    } else {
      showToast.error(result.error || "Failed to update user role");
    }
    return result;
  };

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (userData: DeleteUserRequest) => {
    const result = await removeUser(userData);
    if (result.success) {
      await loadUsers(); // Refresh the user list
      setSelectedUser(null);
      showToast.success("User deleted successfully!");
    } else {
      showToast.error(result.error || "Failed to delete user");
    }
    return result;
  };

  // Temporarily disabled until profile functionality is implemented
  /*
  const handleLoadUserProfile = async (params: GetUserProfileRequest) => {
    try {
      const success = await getUserProfile(params);
      if (success) {
        return { success: true };
      } else {
        return { success: false, error: "Failed to load user profile" };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load user profile";
      return { success: false, error: errorMessage };
    }
  };
  */

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">
            Please log in to access this page.
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (user?.role !== UserRoles.ADMIN) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-red-500">
            Access denied. Admin privileges required.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              User Management
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage all users in the system
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add User Role
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Filter by Role:
              </label>

              <select
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleRoleFilter(e.target.value)}
                value={selectedRole}
              >
                <option value="ALL">All Roles</option>

                {Object.values(UserRoles).map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Results per page:
              </label>

              <select
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                value={pageSize}
              >
                <option value={5}>5</option>

                <option value={10}>10</option>

                <option value={25}>25</option>

                <option value={50}>50</option>
              </select>
            </div>

            <button
              className="rounded-md bg-gray-600 px-4 py-1 text-sm text-white transition-colors hover:bg-gray-700"
              onClick={loadUsers}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Debug Information */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="text-sm font-medium text-green-800">
            Debug Information
          </h3>

          <div className="mt-2 text-sm text-green-700">
            <p>Users loaded: {users.length}</p>

            <p>Loading: {isLoading ? "Yes" : "No"}</p>

            <p>Error: {error || "None"}</p>

            <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>

            <p>User role: {user?.role || "None"}</p>

            <p>Selected role filter: {selectedRole}</p>

            <p>Current page: {currentPage}</p>

            <p>Page size: {pageSize}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>

              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading users
                </h3>

                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* User Table */}
        <UserTable
          isLoading={isLoading}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
          users={users}
        />

        {/* Pagination */}
        <Pagination onPageChange={handlePageChange} pagination={pagination} />

        {/* Modals */}
        <AddUserModal
          isLoading={isLoading}
          isOpen={isAddModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleAddUser}
        />

        <EditUserModal
          isLoading={isLoading}
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleUpdateUser}
          user={selectedUser}
        />

        <DeleteUserModal
          isLoading={isLoading}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          user={selectedUser}
        />

        {/* UserProfileModal temporarily disabled until profile functionality is implemented */}
      </div>
    </AdminLayout>
  );
}

export default function AdminUsersPage() {
  return (
    <ToastProvider>
      <AdminUsersPageContent />
    </ToastProvider>
  );
}
