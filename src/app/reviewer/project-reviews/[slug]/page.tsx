'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ReviewerLayout from '@/components/layout/ReviewerLayout';
import { useReviewer } from '@/hooks/useReviewer';
import ProjectReviewSubmissionForm from '@/components/reviewer/ProjectReviewSubmissionForm';

export default function ProjectReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentSlug = params?.slug as string;

  const [showReviewForm, setShowReviewForm] = useState(false);

  const {
    currentAssessment,
    isLoadingProjectReviews,
    projectReviewsError,
    getProjectReviewDetails,
  } = useReviewer();

  useEffect(() => {
    if (assessmentSlug) {
      getProjectReviewDetails({ assessmentSlug });
    }
  }, [assessmentSlug, getProjectReviewDetails]);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    router.push('/reviewer/project-reviews');
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'PERFECT':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Perfect
          </span>
        );
      case 'CAN_SPEED_UP':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            Can Speed Up
          </span>
        );
      case 'NO_IMPROVEMENT':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            No Improvement
          </span>
        );
      case 'NEED_SERIOUS_ACTION':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            Need Serious Action
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoadingProjectReviews) {
    return (
      <AuthGuard>
        <ReviewerLayout>
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm text-gray-600">Loading assessment details...</p>
            </div>
          </div>
        </ReviewerLayout>
      </AuthGuard>
    );
  }

  if (projectReviewsError || !currentAssessment) {
    return (
      <AuthGuard>
        <ReviewerLayout>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">
                  {projectReviewsError || 'Failed to load assessment details'}
                </p>
              </div>
            </div>
          </div>
        </ReviewerLayout>
      </AuthGuard>
    );
  }

  const hasExistingReview = currentAssessment.review?.recommendation;

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <button
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() => router.back()}
              type="button"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Back to Project Reviews
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Project Assessment Review</h1>
            <p className="mt-2 text-gray-600">
              Review the applicant's project assessment submission
            </p>
          </div>

          {/* Existing Review Display (if already reviewed) */}
          {hasExistingReview && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-900">Review Completed</h3>
                  <p className="mt-1 text-sm text-green-700">
                    You have already submitted a review for this assessment.
                  </p>
                </div>
                {getRecommendationBadge(currentAssessment.review.recommendation)}
              </div>
              {currentAssessment.review.reviewAnalysis && (
                <div className="mt-4 rounded-md bg-white p-4">
                  <p className="text-sm font-medium text-gray-900">Your Analysis:</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                    {currentAssessment.review.reviewAnalysis}
                  </p>
                </div>
              )}
              {currentAssessment.review.completedAt && (
                <p className="mt-3 text-xs text-green-600">
                  Completed on {formatDate(currentAssessment.review.completedAt)}
                </p>
              )}
            </div>
          )}

          {/* Project Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Project Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-600">Project Title</p>
                <p className="mt-1 text-sm text-gray-900">
                  {currentAssessment.project?.application?.basicDetails?.title || 'Untitled Project'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Applicant</p>
                <p className="mt-1 text-sm text-gray-900">
                  {currentAssessment.project?.application?.user?.firstName}{' '}
                  {currentAssessment.project?.application?.user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Criteria</p>
                <p className="mt-1 text-sm text-gray-900">{currentAssessment.criteria?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {currentAssessment.updatedAt
                    ? formatDate(currentAssessment.updatedAt)
                    : 'Not submitted'}
                </p>
              </div>
            </div>
          </div>

          {/* Criteria Details */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="font-medium text-blue-900">Assessment Criteria</h3>
            <p className="mt-2 text-sm text-blue-800">{currentAssessment.criteria?.briefReview}</p>
            {currentAssessment.criteria?.templateFile && (
              <a
                href={currentAssessment.criteria.templateFile.storageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Download Criteria Template
              </a>
            )}
          </div>

          {/* Applicant's Submission */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Applicant's Submission</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Assessment Statement</p>
                <div className="mt-2 rounded-md bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-sm text-gray-900">
                    {currentAssessment.reviewBrief || 'No statement provided'}
                  </p>
                </div>
              </div>

              {currentAssessment.reviewDocument && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Supporting Document</p>
                  <a
                    href={currentAssessment.reviewDocument.storageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    {currentAssessment.reviewDocument.fileName}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Review Form or Submit Button */}
          {!hasExistingReview && (
            <>
              {!showReviewForm ? (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                    type="button"
                  >
                    <svg
                      className="mr-2 h-5 w-5"
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
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <ProjectReviewSubmissionForm
                    assessmentId={currentAssessment.id}
                    assessmentDetails={currentAssessment}
                    onSuccess={handleReviewSuccess}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </ReviewerLayout>
    </AuthGuard>
  );
}
