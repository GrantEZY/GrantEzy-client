"use client";

import { useCallback, useEffect, useState } from "react";

import { AddUserModal } from "@/components/admin/AddUserModal";
import { DeleteUserModal } from "@/components/admin/DeleteUserModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import { AuthGuard } from "@/components/guards/AuthGuard";
import AdminLayout from "@/components/layout/AdminLayout";
import { showToast, ToastProvider } from "@/components/ui/ToastNew";

import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";

import {
  AddUserRequest,
  AdminUser,
  DeleteUserRequest,
  UpdateRole,
} from "@/types/admin.types";
import { UserRoles } from "@/types/auth.types";

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const {
    users,
    pagination,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    removeUser,
  } = useAdmin();

  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Helper function to format role display
  const formatRole = (role: string | string[] | undefined): string => {
    if (!role) return "user";
    const roleStr = Array.isArray(role) ? role[0] : role;
    return roleStr?.replace("_", " ").toLowerCase() || "user";
  };

  // Load users with current filters
  const loadUsers = useCallback(async () => {
    const roleFilter =
      selectedRole === "all" ? undefined : (selectedRole as UserRoles);
    await fetchUsers({
      page: currentPage,
      numberOfResults: pageSize,
      filter: roleFilter ? { role: roleFilter } : undefined,
    });
  }, [currentPage, pageSize, selectedRole, fetchUsers]);

  useEffect(() => {
    if (isAuthenticated && user?.role?.includes(UserRoles.ADMIN)) {
      loadUsers();
    }
  }, [isAuthenticated, user, loadUsers]);

  // Filter users by search term locally
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const fullName =
      `${user.person?.firstName || user.firstName || ""} ${user.person?.lastName || user.lastName || ""}`.toLowerCase();
    const email = (user.contact?.email || user.email || "").toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Handle actions
  const handleAddUser = async (userData: AddUserRequest) => {
    const result = await createUser(userData);
    if (result.success) {
      await loadUsers();
      showToast.success("User added successfully!");
      setIsAddModalOpen(false);
    } else {
      showToast.error(result.error || "Failed to add user");
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
    if (!selectedUser) return { success: false, error: "No user selected" };

    const currentRole = Array.isArray(selectedUser.role)
      ? selectedUser.role[0]
      : selectedUser.role;
    const newRole = userData.role;

    try {
      if (newRole !== currentRole) {
        // Add new role
        const addResult = await updateUser({
          email: userData.email,
          type: UpdateRole.ADD_ROLE,
          role: newRole,
        });

        if (!addResult.success) {
          throw new Error(addResult.error || "Failed to add new role");
        }

        // Remove old role if it's different and not NORMAL_USER
        if (
          currentRole &&
          currentRole !== UserRoles.NORMAL_USER &&
          currentRole !== newRole
        ) {
          const removeResult = await updateUser({
            email: userData.email,
            type: UpdateRole.DELETE_ROLE,
            role: currentRole as UserRoles,
          });

          if (!removeResult.success) {
            console.warn("Failed to remove old role:", removeResult.error);
          }
        }
      }

      await loadUsers();
      showToast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      return { success: true };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update user";
      showToast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (userData: DeleteUserRequest) => {
    const result = await removeUser(userData);
    if (result.success) {
      await loadUsers();
      showToast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } else {
      showToast.error(result.error || "Failed to delete user");
    }
    return result;
  };

  // Check access
  if (!isAuthenticated || !user?.role?.includes(UserRoles.ADMIN)) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Access Denied
              </h2>

              <p className="text-gray-600">
                You need admin privileges to access this page.
              </p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <ToastProvider>
      <AuthGuard>
        <AdminLayout>
          <div className="space-y-6 p-4 sm:p-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Users Management
                </h1>

                <p className="text-sm text-gray-600 sm:text-base">
                  Manage user accounts and permissions
                </p>
              </div>

              <button
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                onClick={() => setIsAddModalOpen(true)}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Add User
              </button>
            </div>

            {/* Filters and Search */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Search */}
                <div className="flex-1">
                  <label className="sr-only" htmlFor="search">
                    Search users
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>

                    <input
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      id="search"
                      name="search"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or email..."
                      type="search"
                      value={searchTerm}
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div className="sm:w-48">
                  <label className="sr-only" htmlFor="role-filter">
                    Filter by role
                  </label>

                  <select
                    className="block w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                    id="role-filter"
                    name="role-filter"
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setCurrentPage(1);
                    }}
                    value={selectedRole}
                  >
                    <option value="all">All Roles</option>

                    <option value={UserRoles.ADMIN}>Admin</option>

                    <option value={UserRoles.DIRECTOR}>Director</option>

                    <option value={UserRoles.PROGRAM_MANAGER}>
                      Program Manager
                    </option>

                    <option value={UserRoles.COMMITTEE_MEMBER}>
                      Committee Member
                    </option>

                    <option value={UserRoles.MENTOR}>Mentor</option>

                    <option value={UserRoles.APPLICANT}>Applicant</option>

                    <option value={UserRoles.NORMAL_USER}>Normal User</option>
                  </select>
                </div>

                {/* Page Size */}
                <div className="sm:w-32">
                  <label className="sr-only" htmlFor="page-size">
                    Items per page
                  </label>

                  <select
                    className="block w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                    id="page-size"
                    name="page-size"
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    value={pageSize}
                  >
                    <option value="10">10</option>

                    <option value="25">25</option>

                    <option value="50">50</option>

                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Total: {pagination?.total || users.length} users</span>

                <span>•</span>

                <span>Showing: {filteredUsers.length} results</span>

                {selectedRole !== "all" && (
                  <>
                    <span>•</span>

                    <span>
                      Role: {selectedRole.replace("_", " ").toLowerCase()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Users List */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              {/* Mobile view */}
              <div className="block sm:hidden">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No users found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <div className="p-4" key={user.personId}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100">
                              <span className="text-sm font-semibold text-blue-700">
                                {user.person?.firstName?.charAt(0) ||
                                  user.firstName?.charAt(0) ||
                                  "?"}

                                {user.person?.lastName?.charAt(0) ||
                                  user.lastName?.charAt(0) ||
                                  ""}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {user.person?.firstName ||
                                  user.firstName ||
                                  "Unknown"}{" "}
                                {user.person?.lastName || user.lastName || ""}
                              </p>

                              <p className="truncate text-sm text-gray-500">
                                {user.contact?.email ||
                                  user.email ||
                                  "No email"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              {formatRole(user.role)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex space-x-2">
                          <button
                            className="flex-1 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </button>

                          <button
                            className="flex-1 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop view */}
              <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        User
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Role
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Created
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {isLoading ? (
                      <tr>
                        <td className="px-6 py-12 text-center" colSpan={4}>
                          <div className="flex justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          className="px-6 py-12 text-center text-gray-500"
                          colSpan={4}
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr className="hover:bg-gray-50" key={user.personId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100">
                                <span className="text-sm font-semibold text-blue-700">
                                  {user.person?.firstName?.charAt(0) ||
                                    user.firstName?.charAt(0) ||
                                    "?"}

                                  {user.person?.lastName?.charAt(0) ||
                                    user.lastName?.charAt(0) ||
                                    ""}
                                </span>
                              </div>

                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.person?.firstName ||
                                    user.firstName ||
                                    "Unknown"}{" "}
                                  {user.person?.lastName || user.lastName || ""}
                                </div>

                                <div className="text-sm text-gray-500">
                                  {user.contact?.email ||
                                    user.email ||
                                    "No email"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {formatRole(user.role)}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>

                          <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                            <button
                              className="mr-4 text-blue-600 hover:text-blue-900"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </button>

                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteUser(user)}
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
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between rounded-lg border border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  >
                    Previous
                  </button>

                  <button
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() =>
                      setCurrentPage(
                        Math.min(pagination.totalPages, currentPage + 1),
                      )
                    }
                  >
                    Next
                  </button>
                </div>

                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">
                        {pagination.totalPages}
                      </span>
                    </p>
                  </div>

                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage <= 1}
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                      >
                        <span className="sr-only">Previous</span>

                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            fillRule="evenodd"
                          />
                        </svg>
                      </button>

                      <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                        {currentPage}
                      </span>

                      <button
                        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage >= pagination.totalPages}
                        onClick={() =>
                          setCurrentPage(
                            Math.min(pagination.totalPages, currentPage + 1),
                          )
                        }
                      >
                        <span className="sr-only">Next</span>

                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            fillRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modals */}
          <AddUserModal
            isLoading={isLoading}
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddUser}
          />

          <EditUserModal
            isLoading={isLoading}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUpdateUser}
            user={selectedUser}
          />

          <DeleteUserModal
            isLoading={isLoading}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={handleConfirmDelete}
            user={selectedUser}
          />
        </AdminLayout>
      </AuthGuard>
    </ToastProvider>
  );
}
