"use client";

import { useEffect } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { UserRoles } from "@/types/auth.types";

export default function StartupsPage() {
  const { user, isAuthenticated } = useAuth();
  const { users, isLoading, error, fetchUsersWithDefaults } = useAdmin();

  useEffect(() => {
    if (isAuthenticated && user?.role === UserRoles.ADMIN) {
      // For now, fetch all users to see what data we have
      // Later we can filter by specific startup roles
      fetchUsersWithDefaults();
    }
  }, [isAuthenticated, user, fetchUsersWithDefaults]);

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
            <h1 className="text-2xl font-semibold text-gray-900">Startup Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage startup applicants and team members
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Approve Application
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Startup
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                    <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                    <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">Debug Information</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Users loaded: {users.length}</p>
            <p>Loading: {isLoading ? "Yes" : "No"}</p>
            <p>Error: {error || "None"}</p>
            <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
            <p>User role: {user?.role || "None"}</p>
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
                <h3 className="text-sm font-medium text-red-800">Error loading startup data</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Startups Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Startup Applications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              List of all startup applications and their current status
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <li className="px-4 py-8 text-center text-gray-500">
                  No startup applications found
                </li>
              ) : (
                users.map((user) => (
                  <li key={user.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          Review
                        </button>
                        <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                          Approve
                        </button>
                        <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
