"use client";

import { useEffect } from "react";

import { AuthGuard } from "@/components/guards/AuthGuard";
import AdminLayout from "@/components/layout/AdminLayout";

import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";

import { UserRoles } from "@/types/auth.types";

export default function EIRsPage() {
  return (
    <AuthGuard>
      <EIRsPageContent />
    </AuthGuard>
  );
}

function EIRsPageContent() {
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
              Entrepreneurs in Residence (EIRs)
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage mentors and entrepreneurs in residence
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
              Assign Mentees
            </button>

            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              Add EIR
            </button>
          </div>
        </div>

        {/* Debug Information */}
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h3 className="text-sm font-medium text-purple-800">
            Debug Information
          </h3>

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
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
                      Total EIRs
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                      Active
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
                      Total Mentees
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
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
                      Active Projects
                    </dt>

                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
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
                  Error loading EIR data
                </h3>

                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* EIRs Grid */}
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Entrepreneurs in Residence
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Overview of all mentors and entrepreneurs providing guidance
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No entrepreneurs in residence found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <div
                  className="rounded-lg bg-gray-50 p-6 transition-shadow hover:shadow-md"
                  key={user.id}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500">
                        <span className="text-lg font-medium text-white">
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

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {user.firstName || user.person?.firstName || "Unknown"}{" "}
                        {user.lastName || user.person?.lastName || "User"}
                      </p>

                      <p className="truncate text-sm text-gray-500">
                        {user.email}
                      </p>

                      <p className="text-xs text-gray-400">Role: {user.role}</p>

                      <p className="text-xs text-gray-400">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status:</span>

                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        Active
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Mentees:</span>

                      <span className="font-medium">0</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Projects:</span>

                      <span className="font-medium">0</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 rounded-md bg-purple-600 px-3 py-2 text-xs text-white transition-colors hover:bg-purple-700">
                      View Profile
                    </button>

                    <button className="flex-1 rounded-md bg-gray-200 px-3 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-300">
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
