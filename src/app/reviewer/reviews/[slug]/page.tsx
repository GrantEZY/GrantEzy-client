"use client";

import { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import { AuthGuard } from "@/components/guards/AuthGuard";
import ReviewerLayout from "@/components/layout/ReviewerLayout";

import { useReviewer } from "@/hooks/useReviewer";

import { Recommendation, ReviewStatus } from "@/types/reviewer.types";

export default function ReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const {
    currentReview,
    isLoadingReviews,
    reviewsError,
    getReviewDetails,
    clearCurrentReview,
  } = useReviewer();

  useEffect(() => {
    if (slug) {
      getReviewDetails({ reviewSlug: slug });
    }

    return () => {
      clearCurrentReview();
    };
  }, [slug, getReviewDetails, clearCurrentReview]);

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

  const getRecommendationBadgeClass = (recommendation: Recommendation) => {
    switch (recommendation) {
      case Recommendation.APPROVE:
        return "bg-green-100 text-green-800";
      case Recommendation.REJECT:
        return "bg-red-100 text-red-800";
      case Recommendation.REVISE:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="mb-8">
          <button
            className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-700"
            onClick={() => router.back()}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Back to Reviews
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Review Details</h1>
          <p className="mt-2 text-gray-600">
            View detailed information about this review
          </p>
        </div>

        {reviewsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h3 className="mt-2 text-sm font-medium text-red-900">
              Error Loading Review
            </h3>
            <p className="mt-1 text-sm text-red-700">{reviewsError}</p>
          </div>
        ) : isLoadingReviews ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading review details...</p>
          </div>
        ) : !currentReview ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Review Not Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The review you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Submit Review Button - Show for ASSIGNED reviews without submission */}
            {currentReview.status === ReviewStatus.UNASSIGNED &&
              !currentReview.recommendation && (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-indigo-900">
                        Ready to submit your review?
                      </h3>
                      <p className="mt-1 text-sm text-indigo-700">
                        This review is awaiting your evaluation and
                        recommendation.
                      </p>
                    </div>
                    <button
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                      onClick={() =>
                        router.push(
                          `/reviewer/submit-review/${currentReview.applicationId}`,
                        )
                      }
                      type="button"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}

            {/* Review Status Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Review Status
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(currentReview.status)}`}
                  >
                    {currentReview.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Recommendation
                  </p>
                  {currentReview.recommendation ? (
                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getRecommendationBadgeClass(currentReview.recommendation)}`}
                    >
                      {currentReview.recommendation}
                    </span>
                  ) : (
                    <p className="mt-1 text-sm text-gray-400">
                      Not submitted yet
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Last Updated
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(currentReview.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Application Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Application ID
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentReview.applicationId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Review ID</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentReview.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Slug</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentReview.slug}
                  </p>
                </div>
              </div>
            </div>

            {/* Scores */}
            {currentReview.scores && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Evaluation Scores
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Technical
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {currentReview.scores.technical}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Market</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {currentReview.scores.market}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Financial
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {currentReview.scores.financial}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {currentReview.scores.team}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Innovation
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {currentReview.scores.innovation}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Score
                  </p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">
                    {Object.values(currentReview.scores).reduce(
                      (a, b) => a + b,
                      0,
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Suggested Budget */}
            {currentReview.suggestedBudget && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Suggested Budget
                </h2>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {currentReview.suggestedBudget.currency}{" "}
                    {currentReview.suggestedBudget.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 4v16m8-8H4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-500">
                      {new Date(currentReview.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-4 w-4 text-green-600"
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
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(currentReview.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ReviewerLayout>
    </AuthGuard>
  );
}
