"use client";

import { useCallback, useEffect, useState } from "react";

import { AuthGuard } from "@/components/guards/AuthGuard";
import AdminLayout from "@/components/layout/AdminLayout";
import { showToast, ToastProvider } from "@/components/ui/ToastNew";

import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";

import { AdminUser } from "@/types/admin.types";
import { UserRoles } from "@/types/auth.types";

export default function AdminEIRsPage() {
  const { user, isAuthenticated } = useAuth();
  const {
    users,
    pagination,
    isLoading,
    fetchUsers,
  } = useAdmin();

  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load EIR and mentor users
  const loadEIRs = useCallback(async () => {
    // Fetch users with mentor roles for EIR management
    await fetchUsers({
      page: currentPage,
      numberOfResults: pageSize,
      filter: { role: UserRoles.MENTOR }, // Focus on mentors/EIRs
    });
  }, [currentPage, pageSize, fetchUsers]);

  useEffect(() => {
    if (isAuthenticated && user?.role?.includes(UserRoles.ADMIN)) {
      loadEIRs();
    }
  }, [isAuthenticated, user, loadEIRs]);

  // Filter users by search term locally
  const filteredEIRs = users.filter(eir => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${eir.person?.firstName || eir.firstName || ""} ${eir.person?.lastName || eir.lastName || ""}`.toLowerCase();
    const email = (eir.contact?.email || eir.email || "").toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Mock status counts (in real app, this would come from backend)
  const stats = {
    total: filteredEIRs.length,
    active: filteredEIRs.length,
    mentees: 0, // TODO: Calculate actual mentees
    projects: 0, // TODO: Calculate actual projects
  };

  // Handle actions
  const handleApprove = async (eir: AdminUser) => {
    showToast.success(`Active eir application for ${eir.person?.firstName || eir.firstName}`);
    // TODO: Implement actual approval logic
  };

  const handleReject = async (eir: AdminUser) => {
    showToast.error(`Inactive eir application for ${eir.person?.firstName || eir.firstName}`);
    // TODO: Implement actual rejection logic
  };

  const handleReview = (eir: AdminUser) => {
    showToast.info(`Opening detailed review for ${eir.person?.firstName || eir.firstName}`);
    // TODO: Implement detailed review modal
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EIR Management</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage eir EIRs and team members
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => showToast.info("Bulk approval feature coming soon")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Bulk Approve
                </button>
                <button
                  onClick={() => showToast.info("Add eir feature coming soon")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add EIR
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 border-2 border-yellow-200">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 border-2 border-green-200">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.mentees}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 border-2 border-red-200">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.projects}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">Search eirs</label>
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

                {/* Status Filter */}
                <div className="sm:w-48">
                  <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                  <select
                    id="status-filter"
                    name="status-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Active</option>
                    <option value="rejected">Inactive</option>
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
                <span>Total: {pagination?.total || filteredEIRs.length} EIRs</span>
                <span>•</span>
                <span>Showing: {filteredEIRs.length} results</span>
                {selectedStatus !== "all" && (
                  <>
                    <span>•</span>
                    <span>Status: {selectedStatus}</span>
                  </>
                )}
              </div>
            </div>

            {/* EIRs List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Mobile view */}
              <div className="block sm:hidden">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredEIRs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No eir EIRs found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredEIRs.map((eir) => (
                      <div key={eir.personId} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200">
                              <span className="text-sm font-semibold text-blue-700">
                                {eir.person?.firstName?.charAt(0) || eir.firstName?.charAt(0) || "?"}
                                {eir.person?.lastName?.charAt(0) || eir.lastName?.charAt(0) || ""}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {eir.person?.firstName || eir.firstName || "Unknown"} {eir.person?.lastName || eir.lastName || ""}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {eir.contact?.email || eir.email || "No email"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleReview(eir)}
                            className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleApprove(eir)}
                            className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(eir)}
                            className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Reject
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
                        EIR
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
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
                    ) : filteredEIRs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No eir EIRs found
                        </td>
                      </tr>
                    ) : (
                      filteredEIRs.map((eir) => (
                        <tr key={eir.personId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-200">
                                <span className="text-sm font-semibold text-blue-700">
                                  {eir.person?.firstName?.charAt(0) || eir.firstName?.charAt(0) || "?"}
                                  {eir.person?.lastName?.charAt(0) || eir.lastName?.charAt(0) || ""}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {eir.person?.firstName || eir.firstName || "Unknown"} {eir.person?.lastName || eir.lastName || ""}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {eir.contact?.email || eir.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {eir.createdAt ? new Date(eir.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleReview(eir)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleApprove(eir)}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(eir)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
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
        </AdminLayout>
      </AuthGuard>
    </ToastProvider>
  );
}