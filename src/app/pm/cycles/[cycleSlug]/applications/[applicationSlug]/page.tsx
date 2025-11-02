"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import InviteReviewerModal from "@/components/pm/InviteReviewerModal";
import { usePm } from "@/hooks/usePm";

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = params.cycleSlug as string;
  const applicationSlug = params.applicationSlug as string;

  const {
    currentApplication,
    isApplicationLoading,
    getApplicationDetails,
    clearApplication,
    getApplicationReviews,
    reviews,
    isReviewsLoading,
  } = usePm();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (cycleSlug && applicationSlug) {
      getApplicationDetails({ cycleSlug, applicationSlug });
      getApplicationReviews({ cycleSlug, applicationSlug, page: 1, numberOfResults: 50 });
    }

    return () => {
      clearApplication();
    };
  }, [cycleSlug, applicationSlug, getApplicationDetails, clearApplication, getApplicationReviews]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "REVISION_REQUESTED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendationBadgeClass = (recommendation: string) => {
    switch (recommendation) {
      case "APPROVE":
        return "bg-green-100 text-green-800";
      case "REJECT":
        return "bg-red-100 text-red-800";
      case "REVISE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <button
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() => router.push(`/pm/cycles/${cycleSlug}`)}
              type="button"
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
              Back to Cycle
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentApplication?.basicInfo?.title ||
                    "Application Details"}
                </h1>
                <p className="mt-2 text-gray-600">
                  Review application details and manage reviewers
                </p>
              </div>
              <button
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setIsInviteModalOpen(true)}
                type="button"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Invite Reviewer
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isApplicationLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading application details...
                </p>
              </div>
            </div>
          )}

          {/* Application Content */}
          {!isApplicationLoading && currentApplication && (
            <>
              {/* Status Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Application Status
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(currentApplication.status)}`}
                    >
                      {currentApplication.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Submitted On
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(
                        currentApplication.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Last Updated
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(
                        currentApplication.updatedAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Applicant Info */}
              {currentApplication.applicant && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Applicant Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.applicant.firstName}{" "}
                        {currentApplication.applicant.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.applicant.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              {currentApplication.basicInfo && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Project Overview
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Summary
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.basicInfo.summary}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Problem Statement
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.basicInfo.problem}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Proposed Solution
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.basicInfo.solution}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Innovation
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.basicInfo.innovation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reviews ({reviews?.length || 0})
                  </h2>
                </div>

                {isReviewsLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <p className="text-sm font-medium text-gray-900">
                                {review.reviewer?.email || "Anonymous Reviewer"}
                              </p>
                              {review.status && (
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(review.status)}`}
                                >
                                  {review.status}
                                </span>
                              )}
                            </div>
                            {review.score !== undefined && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Score</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {review.score}
                                </p>
                              </div>
                            )}
                            {review.comments && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Comments</p>
                                <p className="text-sm text-gray-700">
                                  {review.comments}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No Reviews Yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Invite reviewers to start the review process.
                    </p>
                    <div className="mt-6">
                      <button
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        onClick={() => setIsInviteModalOpen(true)}
                        type="button"
                      >
                        Invite Reviewer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Empty State - No application loaded */}
          {!isApplicationLoading && !currentApplication && (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Application Not Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The application you're looking for doesn't exist or you don't
                have access to it.
              </p>
              <div className="mt-6">
                <Link
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  href={`/pm/cycles/${cycleSlug}`}
                >
                  Back to Cycle
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Invite Reviewer Modal */}
        {currentApplication && (
          <InviteReviewerModal
            applicationId={currentApplication.id}
            applicationSlug={applicationSlug}
            applicationTitle={currentApplication.basicInfo?.title}
            cycleSlug={cycleSlug}
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
          />
        )}
      </PMLayout>
    </AuthGuard>
  );
}
