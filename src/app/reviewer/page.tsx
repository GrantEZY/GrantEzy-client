"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import ReviewerLayout from "@/components/layout/ReviewerLayout";
import { useAuth } from "@/hooks/useAuth";
import { useReviewer } from "@/hooks/useReviewer";
import { ReviewStatus } from "@/types/reviewer.types";

export default function ReviewerDashboard() {
  const { user } = useAuth();
  const { reviews, isLoadingReviews, reviewsError, getUserReviews } = useReviewer();

  useEffect(() => {
    // Fetch reviews on component mount
    getUserReviews({ page: 1, numberOfResults: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Calculate statistics
  // Note: Backend uses IN_PROGRESS for newly assigned reviews, not ASSIGNED
  const stats = {
    completed: reviews.filter((r) => r.status === "COMPLETED").length,
    submitted: reviews.filter((r) => r.status === "COMPLETED").length, // Same as completed in backend
    assigned: reviews.filter((r) => r.status === "IN_PROGRESS" && !r.recommendation).length, // IN_PROGRESS without recommendation = waiting for review
    total: reviews.length, // Total number of all reviews
  };

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName || "Reviewer"}
          </h1>
          <p className="mt-2 text-gray-600">
            Review grant applications and provide your expert assessment
          </p>
        </div>

        {/* Error Banner */}
        {reviewsError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex">
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
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Reviews
                </h3>
                <p className="mt-1 text-sm text-red-700">{reviewsError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.assigned}
                </p>
                <p className="mt-1 text-xs text-gray-500">Waiting for your review</p>
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
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.submitted}
                </p>
                <p className="mt-1 text-xs text-gray-500">Under evaluation</p>
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.completed}
                </p>
                <p className="mt-1 text-xs text-gray-500">Reviews finalized</p>
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

        {/* Recent Reviews Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
            <Link
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
              href="/reviewer/reviews"
            >
              View All →
            </Link>
          </div>

          {isLoadingReviews ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't been assigned any applications to review yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Application
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Recommendation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {reviews.slice(0, 5).map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {review.applicationId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            review.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : review.status === "IN_PROGRESS"
                                ? review.recommendation
                                  ? "bg-blue-100 text-blue-800" // Has recommendation = submitted
                                  : "bg-yellow-100 text-yellow-800" // No recommendation = assigned/pending
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {review.status === "IN_PROGRESS" && !review.recommendation
                            ? "ASSIGNED"
                            : review.status === "IN_PROGRESS" && review.recommendation
                              ? "SUBMITTED"
                              : review.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {review.recommendation || "Pending"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(review.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          {(review.status as string) === "IN_PROGRESS" && !review.recommendation && (
                            <Link
                              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                              href={`/reviewer/submit-review/${review.applicationId}`}
                            >
                              <svg
                                className="mr-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
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
      </ReviewerLayout>
    </AuthGuard>
  );
}
