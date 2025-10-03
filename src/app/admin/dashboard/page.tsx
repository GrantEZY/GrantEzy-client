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
  const adminUsers = users.filter(user => user.role.includes("ADMIN" as any));
  const activeUsers = users; // All fetched users are considered active

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6 md:space-y-8 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">System Overview & Management</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Last updated</p>
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    {isLoading ? "..." : totalUsers}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <Link href="/admin/users" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 mt-3 inline-block font-medium">
                View all →
              </Link>
            </div>

            {/* Total Organizations */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Organizations</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    {isLoading ? "..." : totalOrganizations}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <Link href="/admin/organizations" className="text-xs sm:text-sm text-green-600 hover:text-green-700 mt-3 inline-block font-medium">
                View all →
              </Link>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    {isLoading ? "..." : activeUsers.length}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Admin Users */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Admin Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    {isLoading ? "..." : adminUsers.length}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
            {/* Recent Users */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Users</h2>
                  <Link href="/admin/users" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
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
                  <p className="text-center text-gray-500 py-8 text-sm">No users found</p>
                ) : (
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.personId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200 flex-shrink-0">
                          <span className="text-sm sm:text-base font-semibold text-blue-700">
                            {user.person?.firstName?.charAt(0) || user.firstName?.charAt(0) || "?"}
                            {user.person?.lastName?.charAt(0) || user.lastName?.charAt(0) || ""}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {user.person?.firstName || user.firstName || "Unknown"} {user.person?.lastName || user.lastName || ""}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {user.contact?.email || user.email || "No email"}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role.includes("ADMIN" as any) 
                              ? "bg-purple-100 text-purple-800"
                              : user.role.includes("SUPER_ADMIN" as any)
                                ? "bg-red-100 text-red-800" 
                                : "bg-gray-100 text-gray-800"
                          }`}>
                            {user.role[0]?.replace("_", " ").toLowerCase() || "user"}
                          </span>
                          <span className="text-xs text-green-600">
                            active
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Organizations */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Organizations</h2>
                  <Link href="/admin/organizations" className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium">
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
                  <p className="text-center text-gray-500 py-8 text-sm">No organizations found</p>
                ) : (
                  <div className="space-y-3">
                    {organizations.slice(0, 5).map((org) => (
                      <div key={org.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-100 border-2 border-green-200 flex-shrink-0">
                          <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {org.name || "Unknown Organization"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {org.type || "No type"}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs text-green-600">
                            active
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link 
                href="/admin/users" 
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Manage Users</span>
              </Link>

              <Link 
                href="/admin/organizations" 
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
              >
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Manage Organizations</span>
              </Link>

              <Link 
                href="/admin/startups" 
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
              >
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                  <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Manage Startups</span>
              </Link>

              <Link 
                href="/admin/eirs" 
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
              >
                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200">
                  <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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