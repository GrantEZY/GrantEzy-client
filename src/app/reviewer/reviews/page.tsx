"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import ReviewerLayout from "@/components/layout/ReviewerLayout";
import { useReviewer } from "@/hooks/useReviewer";
import { Review, ReviewStatus } from "@/types/reviewer.types";

export default function ReviewsPage() {
  const { reviews, isLoadingReviews, reviewsError, getUserReviews } = useReviewer();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "ALL">("ALL");
  const pageSize = 10;

  useEffect(() => {
    getUserReviews({ page: currentPage, numberOfResults: pageSize });
  }, [currentPage, getUserReviews]);

  const filteredReviews = filterStatus === "ALL" 
    ? reviews 
    : reviews.filter(r => r.status === filterStatus);

  const getStatusBadgeClass = (status: ReviewStatus) => {
    switch (status) {
      case ReviewStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case ReviewStatus.IN_PROGRESS:
        return "bg-orange-100 text-orange-800";
      case ReviewStatus.UNASSIGNED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="mt-2 text-gray-600">
            View and manage all your application reviews
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => setFilterStatus(e.target.value as ReviewStatus | "ALL")}
                value={filterStatus}
              >
                <option value="">All Statuses</option>
                <option value={ReviewStatus.UNASSIGNED}>Unassigned</option>
                <option value={ReviewStatus.IN_PROGRESS}>In Progress</option>
                <option value={ReviewStatus.COMPLETED}>Completed</option>
                <option value={ReviewStatus.COMPLETED}>Completed</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Total: {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {reviewsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <h3 className="mt-2 text-sm font-medium text-red-900">Error Loading Reviews</h3>
              <p className="mt-1 text-sm text-red-700">{reviewsError}</p>
            </div>
          ) : isLoadingReviews ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
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
                {filterStatus === "ALL" 
                  ? "You haven't been assigned any applications to review yet."
                  : `No reviews with status "${filterStatus}".`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Application ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Recommendation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Scores
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {review.applicationId.slice(0, 8)}...
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(review.status)}`}
                        >
                          {review.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {review.recommendation ? (
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              review.recommendation === "APPROVE"
                                ? "bg-green-100 text-green-800"
                                : review.recommendation === "REJECT"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {review.recommendation}
                          </span>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {review.scores ? (
                          <div className="text-xs">
                            <div>Tech: {review.scores.technical}</div>
                            <div>Market: {review.scores.market}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(review.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          {review.status === ReviewStatus.UNASSIGNED && !review.recommendation && (
                            <Link
                              className="text-indigo-600 hover:text-indigo-700"
                              href={`/reviewer/submit-review/${review.applicationId}`}
                            >
                              Submit Review
                            </Link>
                          )}
                          <Link
                            className="text-blue-600 hover:text-blue-700"
                            href={`/reviewer/reviews/${review.slug}`}
                          >
                            View Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoadingReviews && filteredReviews.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage}
            </span>
            <button
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={reviews.length < pageSize}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </ReviewerLayout>
    </AuthGuard>
  );
}
