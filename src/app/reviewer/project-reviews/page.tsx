'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ReviewerLayout from '@/components/layout/ReviewerLayout';
import { useReviewer } from '@/hooks/useReviewer';

export default function ReviewerProjectReviewsPage() {
  const searchParams = useSearchParams();
  const { 
    projectReviews, 
    projectReviewsPagination,
    isLoadingProjectReviews, 
    projectReviewsError, 
    getUserProjectReviews 
  } = useReviewer();

  useEffect(() => {
    const page = parseInt(searchParams?.get('page') || '1', 10);
    getUserProjectReviews({ page, numberOfResults: 10 });
  }, [searchParams]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'PERFECT':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Perfect
          </span>
        );
      case 'CAN_SPEED_UP':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Can Speed Up
          </span>
        );
      case 'NO_IMPROVEMENT':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            No Improvement
          </span>
        );
      case 'NEED_SERIOUS_ACTION':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Need Serious Action
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate statistics
  const stats = {
    completed: projectReviews.filter((r) => r.status === 'COMPLETED').length,
    pending: projectReviews.filter((r) => r.status === 'IN_PROGRESS').length,
    total: projectReviews.length,
  };

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Assessment Reviews</h1>
            <p className="mt-2 text-gray-600">
              Review and evaluate project assessments submitted by applicants
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.total}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
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
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.completed}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="h-6 w-6 text-green-600"
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
          </div>

          {/* Error State */}
          {projectReviewsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Loading Reviews</h3>
                  <p className="mt-1 text-sm text-red-700">{projectReviewsError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingProjectReviews && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading project reviews...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingProjectReviews && projectReviews.length === 0 && !projectReviewsError && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Project Reviews</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't been assigned any project assessment reviews yet.
              </p>
            </div>
          )}

          {/* Reviews List */}
          {!isLoadingProjectReviews && projectReviews.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">All Project Reviews</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Criteria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Recommendation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Assigned Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {projectReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {review.assessment?.project?.application?.basicInfo?.title ||
                              'Untitled Project'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {review.assessment?.criteria?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(review.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.recommendation
                            ? getRecommendationBadge(review.recommendation)
                            : <span className="text-sm text-gray-400">Not reviewed</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link
                            href={`/reviewer/project-reviews/${review.assessment?.slug}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700"
                          >
                            {review.status === 'COMPLETED' ? 'View' : 'Review'}
                            <svg
                              className="ml-1 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M9 5l7 7-7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {projectReviewsPagination && projectReviewsPagination.totalPages > 1 && (
                <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {projectReviewsPagination.page} of{' '}
                      {projectReviewsPagination.totalPages}
                    </div>
                    <div className="flex space-x-2">
                      {projectReviewsPagination.page > 1 && (
                        <Link
                          href={`?page=${projectReviewsPagination.page - 1}`}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Previous
                        </Link>
                      )}
                      {projectReviewsPagination.page < projectReviewsPagination.totalPages && (
                        <Link
                          href={`?page=${projectReviewsPagination.page + 1}`}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ReviewerLayout>
    </AuthGuard>
  );
}
