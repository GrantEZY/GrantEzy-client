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
    const roleFilter = selectedRole === "all" ? undefined : (selectedRole as UserRoles);
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
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.person?.firstName || user.firstName || ""} ${user.person?.lastName || user.lastName || ""}`.toLowerCase();
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

  const handleUpdateUser = async (userData: { email: string; role: UserRoles }) => {
    if (!selectedUser) return { success: false, error: "No user selected" };

    const currentRole = Array.isArray(selectedUser.role) ? selectedUser.role[0] : selectedUser.role;
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
        if (currentRole && currentRole !== UserRoles.NORMAL_USER && currentRole !== newRole) {
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
      const errorMsg = error instanceof Error ? error.message : "Failed to update user";
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">You need admin privileges to access this page.</p>
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
          <div className="space-y-6 md:space-y-8 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users Management</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage user accounts and permissions
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add User
              </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">Search users</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Search by name or email..."
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div className="sm:w-48">
                  <label htmlFor="role-filter" className="sr-only">Filter by role</label>
                  <select
                    id="role-filter"
                    name="role-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Roles</option>
                    <option value={UserRoles.ADMIN}>Admin</option>
                    <option value={UserRoles.DIRECTOR}>Director</option>
                    <option value={UserRoles.PROGRAM_MANAGER}>Program Manager</option>
                    <option value={UserRoles.COMMITTEE_MEMBER}>Committee Member</option>
                    <option value={UserRoles.MENTOR}>Mentor</option>
                    <option value={UserRoles.APPLICANT}>Applicant</option>
                    <option value={UserRoles.NORMAL_USER}>Normal User</option>
                  </select>
                </div>

                {/* Page Size */}
                <div className="sm:w-32">
                  <label htmlFor="page-size" className="sr-only">Items per page</label>
                  <select
                    id="page-size"
                    name="page-size"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
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
                    <span>Role: {selectedRole.replace("_", " ").toLowerCase()}</span>
                  </>
                )}
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                      <div key={user.personId} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200">
                              <span className="text-sm font-semibold text-blue-700">
                                {user.person?.firstName?.charAt(0) || user.firstName?.charAt(0) || "?"}
                                {user.person?.lastName?.charAt(0) || user.lastName?.charAt(0) || ""}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.person?.firstName || user.firstName || "Unknown"} {user.person?.lastName || user.lastName || ""}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {user.contact?.email || user.email || "No email"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {formatRole(user.role)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium"
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="flex justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.personId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200">
                                <span className="text-sm font-semibold text-blue-700">
                                  {user.person?.firstName?.charAt(0) || user.firstName?.charAt(0) || "?"}
                                  {user.person?.lastName?.charAt(0) || user.lastName?.charAt(0) || ""}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.person?.firstName || user.firstName || "Unknown"} {user.person?.lastName || user.lastName || ""}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.contact?.email || user.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {formatRole(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-900"
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
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg border">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                    disabled={currentPage >= pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{pagination.totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {currentPage}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                        disabled={currentPage >= pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddUser}
            isLoading={isLoading}
          />

          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUpdateUser}
            user={selectedUser}
            isLoading={isLoading}
          />

          <DeleteUserModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={handleConfirmDelete}
            user={selectedUser}
            isLoading={isLoading}
          />
        </AdminLayout>
      </AuthGuard>
    </ToastProvider>
  );
}