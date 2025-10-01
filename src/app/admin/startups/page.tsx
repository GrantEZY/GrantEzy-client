"use client";

import { useEffect } from "react";

import { AuthGuard } from "@/components/guards/AuthGuard";
import AdminLayout from "@/components/layout/AdminLayout";

import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";

import { UserRoles } from "@/types/auth.types";

export default function StartupsPage() {
  return (
    <AuthGuard>
      <StartupsPageContent />
    </AuthGuard>
  );
}

function StartupsPageContent() {
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
              Startup Management
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage startup applicants and team members
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
              Approve Application
            </button>

            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              Add Startup
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                </div>

                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Total Applications
                    </dt>

                    <dd className="text-lg font-medium text-gray-900">
                      {users.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                </div>

                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Approved
                    </dt>

                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                </div>

                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Pending Review
                    </dt>

                    <dd className="text-lg font-medium text-gray-900">
                      {users.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-800">
            Debug Information
          </h3>

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
                  Error loading startup data
                </h3>

                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Startups Table */}
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Startup Applications
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              List of all startup applications and their current status
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
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
                    <div className="flex items-center justify-between px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                            <span className="text-sm font-medium text-white">
                              {(
                                user.firstName ||
                                user.person?.firstName ||
                                "U"
                              ).charAt(0)}

                              {(
                                user.lastName ||
                                user.person?.lastName ||
                                "N"
                              ).charAt(0)}
                            </span>
                          </div>
                        </div>

                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName ||
                              user.person?.firstName ||
                              "Unknown"}{" "}
                            {user.lastName || user.person?.lastName || "User"}
                          </div>

                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                          Pending
                        </span>

                        <button className="text-sm font-medium text-blue-600 hover:text-blue-900">
                          Review
                        </button>

                        <button className="text-sm font-medium text-green-600 hover:text-green-900">
                          Approve
                        </button>

                        <button className="text-sm font-medium text-red-600 hover:text-red-900">
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
