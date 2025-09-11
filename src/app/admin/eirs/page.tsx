"use client";

import { useEffect } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { UserRoles } from "@/types/auth.types";

export default function EIRsPage() {
  const { user, isAuthenticated } = useAuth();
  const { users, isLoading, error, fetchUsersWithDefaults } = useAdmin();

  useEffect(() => {
    if (isAuthenticated && user?.role === UserRoles.ADMIN) {
      // For now, fetch all users to see what data we have
      // We can filter by mentor/EIR roles later
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
            <h1 className="text-2xl font-semibold text-gray-900">Entrepreneurs in Residence (EIRs)</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage mentors and entrepreneurs in residence
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Assign Mentees
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add EIR
            </button>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800">Debug Information</h3>
          <div className="mt-2 text-sm text-purple-700">
            <p>Users loaded: {users.length}</p>
            <p>Loading: {isLoading ? "Yes" : "No"}</p>
            <p>Error: {error || "None"}</p>
            <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
            <p>User role: {user?.role || "None"}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total EIRs</dt>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
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
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Mentees</dt>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
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
                <h3 className="text-sm font-medium text-red-800">Error loading EIR data</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* EIRs Grid */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Entrepreneurs in Residence</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Overview of all mentors and entrepreneurs providing guidance
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No entrepreneurs in residence found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Role: {user.role}
                      </p>
                      <p className="text-xs text-gray-400">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Mentees:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Projects:</span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-purple-600 text-white text-xs py-2 px-3 rounded-md hover:bg-purple-700 transition-colors">
                      View Profile
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 px-3 rounded-md hover:bg-gray-300 transition-colors">
                      Assign Mentee
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
