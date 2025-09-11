"use client";

import { useEffect, useState, useCallback } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { UserRoles } from "@/types/auth.types";
import { AdminUser, AddUserRequest, UpdateUserRoleRequest, DeleteUserRequest } from "@/types/admin.types";
import { AddUserModal } from "@/components/admin/AddUserModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import { DeleteUserModal } from "@/components/admin/DeleteUserModal";
import { ToastProvider, useToast } from "@/components/ui/Toast";

interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}

function UserTable({ users, isLoading, onEditUser, onDeleteUser }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-3"
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
  pagination: any;
  onPageChange: (page: number) => void;
}

function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (!pagination) return null;

  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 border-t border-gray-200">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              disabled={!hasPreviousPage}
              onClick={() => onPageChange(currentPage - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    pageNum === currentPage
                      ? "z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              disabled={!hasNextPage}
              onClick={() => onPageChange(currentPage + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
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
  const { showToast } = useToast();
  
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
  }, [selectedRole, currentPage, pageSize, fetchUsersWithDefaults, fetchUsersByRole]);

  useEffect(() => {
    if (isAuthenticated && user?.role === UserRoles.ADMIN) {
      loadUsers();
    }
  }, [isAuthenticated, user, loadUsers]);

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
  const handleAddUser = async (userData: any) => {
    const result = await createUser(userData);
    if (result.success) {
      await loadUsers(); // Refresh the user list
      showToast({
        type: 'success',
        message: 'User role added successfully!'
      });
    } else {
      showToast({
        type: 'error',
        message: result.error || 'Failed to add user role'
      });
    }
    return result;
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userData: any) => {
    const result = await updateUser(userData);
    if (result.success) {
      await loadUsers(); // Refresh the user list
      setSelectedUser(null);
      showToast({
        type: 'success',
        message: 'User role updated successfully!'
      });
    } else {
      showToast({
        type: 'error',
        message: result.error || 'Failed to update user role'
      });
    }
    return result;
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (userData: any) => {
    const result = await removeUser(userData);
    if (result.success) {
      await loadUsers(); // Refresh the user list
      setSelectedUser(null);
      showToast({
        type: 'success',
        message: 'User deleted successfully!'
      });
    } else {
      showToast({
        type: 'error',
        message: result.error || 'Failed to delete user'
      });
    }
    return result;
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Please log in to access this page.</div>
        </div>
      </AdminLayout>
    );
  }

  if (user?.role !== UserRoles.ADMIN) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Access denied. Admin privileges required.</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage all users in the system
            </p>
          </div>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add User Role
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="text-sm font-medium text-gray-700">Results per page:</label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            <button
              onClick={loadUsers}
              className="bg-gray-600 text-white px-4 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800">Debug Information</h3>
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* User Table */}
        <UserTable 
          users={users} 
          isLoading={isLoading} 
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />

        {/* Pagination */}
        <Pagination pagination={pagination} onPageChange={handlePageChange} />

        {/* Modals */}
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleAddUser}
          isLoading={isLoading}
        />

        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleUpdateUser}
          isLoading={isLoading}
          user={selectedUser}
        />

        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          isLoading={isLoading}
          user={selectedUser}
        />
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
