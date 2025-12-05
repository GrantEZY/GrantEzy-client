'use client';

import { useCallback, useEffect, useState } from 'react';

import { AuthGuard } from '@/components/guards/AuthGuard';
import AdminLayout from '@/components/layout/AdminLayout';
import { showToast, ToastProvider } from '@/components/ui/ToastNew';

import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';

import { AdminUser } from '@/types/admin.types';
import { UserRoles } from '@/types/auth.types';

export default function AdminStartupsPage() {
  const { user, isAuthenticated } = useAuth();
  const { users, pagination, isLoading, fetchUsers } = useAdmin();

  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load startup-related users
  const loadStartups = useCallback(async () => {
    await fetchUsers({
      page: currentPage,
      numberOfResults: pageSize,
      filter: { role: UserRoles.APPLICANT }, // Focus on applicants for startups
    });
  }, [currentPage, pageSize, fetchUsers]);

  useEffect(() => {
    if (isAuthenticated && user?.role?.includes(UserRoles.ADMIN)) {
      loadStartups();
    }
  }, [isAuthenticated, user, loadStartups]);

  // Filter users by search term locally
  const filteredStartups = users.filter((startup) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const fullName =
      `${startup.person?.firstName || startup.firstName || ''} ${startup.person?.lastName || startup.lastName || ''}`.toLowerCase();
    const email = (startup.contact?.email || startup.email || '').toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Mock status counts (in real app, this would come from backend)
  const stats = {
    total: filteredStartups.length,
    pending: filteredStartups.length, // Assuming all applicants are pending
    approved: 0,
    rejected: 0,
  };

  // Handle actions
  const handleApprove = async (startup: AdminUser) => {
    showToast.success(
      `Approved startup application for ${startup.person?.firstName || startup.firstName}`
    );
    // TODO: Implement actual approval logic
  };

  const handleReject = async (startup: AdminUser) => {
    showToast.error(
      `Rejected startup application for ${startup.person?.firstName || startup.firstName}`
    );
    // TODO: Implement actual rejection logic
  };

  const handleReview = (startup: AdminUser) => {
    showToast.info(`Opening detailed review for ${startup.person?.firstName || startup.firstName}`);
    // TODO: Implement detailed review modal
  };

  // Check access
  if (!isAuthenticated || !user?.role?.includes(UserRoles.ADMIN)) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">Access Denied</h2>

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
          <div className="space-y-6 p-4 sm:p-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Startup Management</h1>

                <p className="text-sm text-gray-600 sm:text-base">
                  Manage startup applications and team members
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                  onClick={() => showToast.info('Bulk approval feature coming soon')}
                >
                  <svg
                    className="mr-2 h-4 w-4"
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
                  Bulk Approve
                </button>

                <button
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  onClick={() => showToast.info('Add startup feature coming soon')}
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
                  Add Startup
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-600"
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

                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>

                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-yellow-200 bg-yellow-100">
                    <svg
                      className="h-6 w-6 text-yellow-600"
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

                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>

                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-200 bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
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

                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>

                    <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-200 bg-red-100">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>

                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rejected</p>

                    <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Search */}
                <div className="flex-1">
                  <label className="sr-only" htmlFor="search">
                    Search startups
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

                {/* Status Filter */}
                <div className="sm:w-48">
                  <label className="sr-only" htmlFor="status-filter">
                    Filter by status
                  </label>

                  <select
                    className="block w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                    id="status-filter"
                    name="status-filter"
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    value={selectedStatus}
                  >
                    <option value="all">All Status</option>

                    <option value="pending">Pending</option>

                    <option value="approved">Approved</option>

                    <option value="rejected">Rejected</option>
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
                <span>Total: {pagination?.total || filteredStartups.length} applications</span>

                <span>•</span>

                <span>Showing: {filteredStartups.length} results</span>

                {selectedStatus !== 'all' && (
                  <>
                    <span>•</span>

                    <span>Status: {selectedStatus}</span>
                  </>
                )}
              </div>
            </div>

            {/* Startups List */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              {/* Mobile view */}
              <div className="block sm:hidden">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredStartups.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No startup applications found</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredStartups.map((startup) => (
                      <div className="p-4" key={startup.personId}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100">
                              <span className="text-sm font-semibold text-blue-700">
                                {startup.person?.firstName?.charAt(0) ||
                                  startup.firstName?.charAt(0) ||
                                  '?'}

                                {startup.person?.lastName?.charAt(0) ||
                                  startup.lastName?.charAt(0) ||
                                  ''}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {startup.person?.firstName || startup.firstName || 'Unknown'}{' '}
                                {startup.person?.lastName || startup.lastName || ''}
                              </p>

                              <p className="truncate text-sm text-gray-500">
                                {startup.contact?.email || startup.email || 'No email'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                              Pending
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex space-x-2">
                          <button
                            className="flex-1 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                            onClick={() => handleReview(startup)}
                          >
                            Review
                          </button>

                          <button
                            className="flex-1 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                            onClick={() => handleApprove(startup)}
                          >
                            Approve
                          </button>

                          <button
                            className="flex-1 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                            onClick={() => handleReject(startup)}
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
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Applicant
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Status
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Applied
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
                    ) : filteredStartups.length === 0 ? (
                      <tr>
                        <td className="px-6 py-12 text-center text-gray-500" colSpan={4}>
                          No startup applications found
                        </td>
                      </tr>
                    ) : (
                      filteredStartups.map((startup) => (
                        <tr className="hover:bg-gray-50" key={startup.personId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100">
                                <span className="text-sm font-semibold text-blue-700">
                                  {startup.person?.firstName?.charAt(0) ||
                                    startup.firstName?.charAt(0) ||
                                    '?'}

                                  {startup.person?.lastName?.charAt(0) ||
                                    startup.lastName?.charAt(0) ||
                                    ''}
                                </span>
                              </div>

                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {startup.person?.firstName || startup.firstName || 'Unknown'}{' '}
                                  {startup.person?.lastName || startup.lastName || ''}
                                </div>

                                <div className="text-sm text-gray-500">
                                  {startup.contact?.email || startup.email || 'No email'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Pending Review
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                            {startup.createdAt
                              ? new Date(startup.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </td>

                          <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                            <button
                              className="mr-4 text-blue-600 hover:text-blue-900"
                              onClick={() => handleReview(startup)}
                            >
                              Review
                            </button>

                            <button
                              className="mr-4 text-green-600 hover:text-green-900"
                              onClick={() => handleApprove(startup)}
                            >
                              Approve
                            </button>

                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleReject(startup)}
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
                    onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  >
                    Next
                  </button>
                </div>

                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{pagination.totalPages}</span>
                    </p>
                  </div>

                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      >
                        <span className="sr-only">Previous</span>

                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
                          setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
                        }
                      >
                        <span className="sr-only">Next</span>

                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
        </AdminLayout>
      </AuthGuard>
    </ToastProvider>
  );
}
