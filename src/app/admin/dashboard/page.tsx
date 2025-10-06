"use client";

import { useEffect } from "react";

import Link from "next/link";

import { AuthGuard } from "@/components/guards/AuthGuard";
import AdminLayout from "@/components/layout/AdminLayout";

import { useAdmin } from "@/hooks/useAdmin";

export default function AdminDashboard() {
  const {
    users,
    pagination,
    organizations,
    isLoading,
    fetchUsers,
    fetchOrganizations,
  } = useAdmin();

  useEffect(() => {
    // Fetch initial data
    fetchUsers({ page: 1, numberOfResults: 1000 });
    fetchOrganizations();
  }, [fetchUsers, fetchOrganizations]);

  const totalUsers = pagination?.total || 0;
  const totalOrganizations = organizations.length;
  const adminUsers = users.filter((user) => user.role.includes("ADMIN" as any));
  const activeUsers = users; // All fetched users are considered active

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6 p-4 sm:p-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Admin Dashboard
              </h1>

              <p className="text-sm text-gray-600 sm:text-base">
                System Overview & Management
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500 sm:text-sm">Last updated</p>

              <p className="text-xs font-medium text-gray-900 sm:text-sm">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-4">
            {/* Total Users */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 sm:text-sm">
                    Total Users
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {isLoading ? "..." : totalUsers}
                  </p>
                </div>

                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6"
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

              <Link
                className="mt-3 inline-block text-xs font-medium text-blue-600 hover:text-blue-700 sm:text-sm"
                href="/admin/users"
              >
                View all →
              </Link>
            </div>

            {/* Total Organizations */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 sm:text-sm">
                    Organizations
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {isLoading ? "..." : totalOrganizations}
                  </p>
                </div>

                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-50 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-green-600 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>

              <Link
                className="mt-3 inline-block text-xs font-medium text-green-600 hover:text-green-700 sm:text-sm"
                href="/admin/organizations"
              >
                View all →
              </Link>
            </div>

            {/* Active Users */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 sm:text-sm">
                    Active Users
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {isLoading ? "..." : activeUsers.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6"
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
            </div>

            {/* Admin Users */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 sm:text-sm">
                    Admin Users
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {isLoading ? "..." : adminUsers.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-amber-600 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {/* Recent Users */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                    Recent Users
                  </h2>

                  <Link
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 sm:text-sm"
                    href="/admin/users"
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex h-24 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  </div>
                ) : users.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No users found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div
                        className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                        key={user.personId}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100 sm:h-12 sm:w-12">
                          <span className="text-sm font-semibold text-blue-700 sm:text-base">
                            {user.person?.firstName?.charAt(0) ||
                              user.firstName?.charAt(0) ||
                              "?"}

                            {user.person?.lastName?.charAt(0) ||
                              user.lastName?.charAt(0) ||
                              ""}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 sm:text-base">
                            {user.person?.firstName ||
                              user.firstName ||
                              "Unknown"}{" "}
                            {user.person?.lastName || user.lastName || ""}
                          </p>

                          <p className="truncate text-xs text-gray-500 sm:text-sm">
                            {user.contact?.email || user.email || "No email"}
                          </p>
                        </div>

                        <div className="flex flex-shrink-0 flex-col items-end gap-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              user.role.includes("ADMIN" as any)
                                ? "bg-purple-100 text-purple-800"
                                : user.role.includes("SUPER_ADMIN" as any)
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role[0]?.replace("_", " ").toLowerCase() ||
                              "user"}
                          </span>

                          <span className="text-xs text-green-600">active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Organizations */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                    Recent Organizations
                  </h2>

                  <Link
                    className="text-xs font-medium text-green-600 hover:text-green-700 sm:text-sm"
                    href="/admin/organizations"
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex h-24 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-green-500"></div>
                  </div>
                ) : organizations.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No organizations found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {organizations.slice(0, 5).map((org) => (
                      <div
                        className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                        key={org.id}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-green-200 bg-green-100 sm:h-12 sm:w-12">
                          <svg
                            className="h-5 w-5 text-green-600 sm:h-6 sm:w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 sm:text-base">
                            {org.name || "Unknown Organization"}
                          </p>

                          <p className="truncate text-xs text-gray-500 sm:text-sm">
                            {org.type || "No type"}
                          </p>
                        </div>

                        <div className="flex flex-shrink-0 flex-col items-end gap-1">
                          <span className="text-xs text-green-600">active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                className="group flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                href="/admin/users"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                <span className="font-medium text-gray-900">Manage Users</span>
              </Link>

              <Link
                className="group flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-green-300 hover:bg-green-50"
                href="/admin/organizations"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                <span className="font-medium text-gray-900">
                  Manage Organizations
                </span>
              </Link>

              <Link
                className="group flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300 hover:bg-purple-50"
                href="/admin/startups"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200">
                  <svg
                    className="h-5 w-5 text-purple-600"
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

                <span className="font-medium text-gray-900">
                  Manage Startups
                </span>
              </Link>

              <Link
                className="group flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50"
                href="/admin/eirs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 group-hover:bg-amber-200">
                  <svg
                    className="h-5 w-5 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                <span className="font-medium text-gray-900">Manage EIRs</span>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
