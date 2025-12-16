'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ReviewerLayout from '@/components/layout/ReviewerLayout';
import { useReviewer } from '@/hooks/useReviewer';
import { ProjectReviewRecommendation } from '@/types/project.types';

type ReviewStatus = 'UNASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export default function ProjectReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'ALL'>('ALL');

  const { projectReviews, isLoadingProjectReviews, getUserProjectReviews } = useReviewer();

  useEffect(() => {
    loadReviews();
  }, [currentPage]);

  const loadReviews = async () => {
    await getUserProjectReviews({
      page: currentPage,
      numberOfResults: 12,
    });
  };

  const getStatusBadgeClass = (status: ReviewStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNASSIGNED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationBadgeClass = (recommendation: ProjectReviewRecommendation) => {
    switch (recommendation) {
      case 'PERFECT':
        return 'bg-emerald-100 text-emerald-800';
      case 'GOOD':
        return 'bg-blue-100 text-blue-800';
      case 'NEEDS_IMPROVEMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'POOR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredReviews =
    statusFilter === 'ALL'
      ? projectReviews
      : projectReviews.filter((review) => review.status === statusFilter);

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Project Reviews</h1>
            <p className="mt-2 text-sm text-gray-600">
              Review and provide recommendations for project assessments
            </p>
          </div>

          {/* Status Filter */}
          <div className="mb-6 flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Filter by status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReviewStatus | 'ALL')}
              className="rounded-md border-gray-300 py-1 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="ALL">All Reviews</option>
              <option value="UNASSIGNED">Unassigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <span className="ml-2 text-sm text-gray-500">
              ({filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Loading State */}
          {isLoadingProjectReviews && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading your reviews...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingProjectReviews && filteredReviews.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter === 'ALL'
                  ? "You haven't been assigned any project reviews yet."
                  : `No reviews with status: ${statusFilter}`}
              </p>
            </div>
          )}

          {/* Reviews Grid */}
          {!isLoadingProjectReviews && filteredReviews.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/reviewer/project-reviews/${review.assessment?.slug || review.id}`}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(review.status)}`}
                      >
                        {review.status}
                      </span>
                      {review.recommendation && (
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRecommendationBadgeClass(review.recommendation)}`}
                        >
                          {review.recommendation}
                        </span>
                      )}
                    </div>

                    {/* Project Info */}
                    {review.assessment && (
                      <>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                          {review.assessment.project?.title || 'Untitled Project'}
                        </h3>
                        <p className="mb-3 text-sm text-gray-600">
                          {review.assessment.criteria?.name || 'Assessment Criteria'}
                        </p>
                      </>
                    )}

                    {/* Review Brief */}
                    {review.reviewAnalysis && (
                      <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                        {review.reviewAnalysis}
                      </p>
                    )}

                    {/* Dates */}
                    <div className="space-y-1 border-t border-gray-100 pt-4 text-xs text-gray-500">
                      {review.invitedAt && (
                        <div className="flex justify-between">
                          <span>Invited:</span>
                          <span>{formatDate(review.invitedAt)}</span>
                        </div>
                      )}
                      {review.submittedAt && (
                        <div className="flex justify-between">
                          <span>Submitted:</span>
                          <span>{formatDate(review.submittedAt)}</span>
                        </div>
                      )}
                      {!review.submittedAt && review.createdAt && (
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Indicator */}
                    {review.status === 'UNASSIGNED' || review.status === 'IN_PROGRESS' ? (
                      <div className="mt-4 flex items-center justify-end text-sm font-medium text-blue-600">
                        {review.status === 'UNASSIGNED' ? 'Start Review' : 'Continue Review'}
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
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center justify-end text-sm font-medium text-gray-600">
                        View Details
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
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoadingProjectReviews && filteredReviews.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={filteredReviews.length < 12}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </ReviewerLayout>
    </AuthGuard>
  );
}
