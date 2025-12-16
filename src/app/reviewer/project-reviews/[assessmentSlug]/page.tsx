'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ReviewerLayout from '@/components/layout/ReviewerLayout';
import { useReviewer } from '@/hooks/useReviewer';

export default function ProjectReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentSlug = params.assessmentSlug as string;

  const { currentProjectReview, isLoadingProjectReviews, getProjectReviewDetails } = useReviewer();

  useEffect(() => {
    loadReviewDetails();
  }, [assessmentSlug]);

  const loadReviewDetails = async () => {
    await getProjectReviewDetails({ assessmentSlug });
  };

  const getStatusBadgeClass = (status: string) => {
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

  const getRecommendationBadgeClass = (recommendation: string) => {
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canSubmitReview =
    currentProjectReview?.review &&
    (currentProjectReview.review.status === 'UNASSIGNED' ||
      currentProjectReview.review.status === 'IN_PROGRESS');

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex text-sm text-gray-500">
            <Link href="/reviewer/project-reviews" className="hover:text-gray-700">
              My Reviews
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Review Details</span>
          </nav>

          {/* Loading State */}
          {isLoadingProjectReviews && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading review details...</p>
              </div>
            </div>
          )}

          {/* Review Content */}
          {!isLoadingProjectReviews && currentProjectReview && (
            <div className="space-y-6">
              {/* Header */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Project Review</h1>
                    {currentProjectReview.review && (
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(currentProjectReview.review.status)}`}
                      >
                        {currentProjectReview.review.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Project Title */}
                  {currentProjectReview.assessment?.project && (
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {currentProjectReview.assessment.project.title}
                      </h2>
                      {currentProjectReview.assessment.project.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {currentProjectReview.assessment.project.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Assessment Criteria */}
                  {currentProjectReview.assessment?.criteria && (
                    <div className="mb-4 rounded-md bg-blue-50 p-4">
                      <h3 className="text-sm font-medium text-blue-900">Assessment Criteria</h3>
                      <p className="mt-1 text-sm text-blue-800">
                        {currentProjectReview.assessment.criteria.name}
                      </p>
                      {currentProjectReview.assessment.criteria.reviewBrief && (
                        <p className="mt-2 text-sm text-blue-700">
                          {currentProjectReview.assessment.criteria.reviewBrief}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Review Dates */}
                  {currentProjectReview.review && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {currentProjectReview.review.invitedAt && (
                        <div>
                          <p className="text-xs text-gray-500">Invited On</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(currentProjectReview.review.invitedAt)}
                          </p>
                        </div>
                      )}
                      {currentProjectReview.review.submittedAt && (
                        <div>
                          <p className="text-xs text-gray-500">Submitted On</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(currentProjectReview.review.submittedAt)}
                          </p>
                        </div>
                      )}
                      {currentProjectReview.review.recommendation && (
                        <div>
                          <p className="text-xs text-gray-500">Recommendation</p>
                          <span
                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRecommendationBadgeClass(currentProjectReview.review.recommendation)}`}
                          >
                            {currentProjectReview.review.recommendation}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Assessment Submission */}
              {currentProjectReview.assessment && (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Applicant Submission</h3>
                  </div>
                  <div className="p-6">
                    {/* Review Brief */}
                    {currentProjectReview.assessment.reviewBrief && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Assessment Statement</h4>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                          {currentProjectReview.assessment.reviewBrief}
                        </p>
                      </div>
                    )}

                    {/* Review Document */}
                    {currentProjectReview.assessment.reviewDocument && (
                      <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="h-8 w-8 text-blue-600"
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
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {currentProjectReview.assessment.reviewDocument.title ||
                                  currentProjectReview.assessment.reviewDocument.fileName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {currentProjectReview.assessment.reviewDocument.fileSize}
                              </p>
                            </div>
                          </div>
                          <a
                            href={currentProjectReview.assessment.reviewDocument.storageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submitted Review (if completed) */}
              {currentProjectReview.review?.reviewAnalysis && (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Review</h3>
                  </div>
                  <div className="p-6">
                    {currentProjectReview.review.recommendation && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Recommendation</h4>
                        <span
                          className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getRecommendationBadgeClass(currentProjectReview.review.recommendation)}`}
                        >
                          {currentProjectReview.review.recommendation}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Review Analysis</h4>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                        {currentProjectReview.review.reviewAnalysis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow">
                <Link
                  href="/reviewer/project-reviews"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 19l-7-7 7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  Back to Reviews
                </Link>
                {canSubmitReview && (
                  <Link
                    href={`/reviewer/project-reviews/${assessmentSlug}/submit`}
                    className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {currentProjectReview.review.status === 'UNASSIGNED'
                      ? 'Submit Review'
                      : 'Update Review'}
                    <svg
                      className="ml-2 h-4 w-4"
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
                )}
              </div>
            </div>
          )}
        </div>
      </ReviewerLayout>
    </AuthGuard>
  );
}
