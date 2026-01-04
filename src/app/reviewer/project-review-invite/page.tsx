'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ReviewerLayout from '@/components/layout/ReviewerLayout';
import { useReviewer } from '@/hooks/useReviewer';
import { InviteStatus } from '@/types/reviewer.types';

export default function ProjectReviewInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submitProjectAssessmentReviewInviteStatus, isLoadingProjectReviews } = useReviewer();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const token = searchParams?.get('token');
  const slug = searchParams?.get('slug');
  const assessmentId = searchParams?.get('assessmentId');
  const criteriaName = searchParams?.get('criteria');
  const projectTitle = searchParams?.get('project');

  useEffect(() => {
    if (!token || !slug || !assessmentId) {
      setError('Invalid invitation link. Required parameters are missing.');
    }
  }, [token, slug, assessmentId]);

  const handleResponse = async (status: InviteStatus.ACCEPTED | InviteStatus.REJECTED) => {
    if (!token || !slug || !assessmentId) {
      setError('Invalid invitation parameters');
      return;
    }

    setIsProcessing(true);
    setError('');

    const response = await submitProjectAssessmentReviewInviteStatus({
      token,
      slug,
      assessmentId,
      status,
    });

    setIsProcessing(false);

    if (response) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/reviewer/project-reviews');
      }, 2000);
    } else {
      setError('Failed to process your response. Please try again.');
    }
  };

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="mx-auto max-w-2xl py-8">
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
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
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                Project Assessment Review Invitation
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                You've been invited to review a project assessment
              </p>
            </div>

            {/* Success State */}
            {success && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success!</h3>
                    <p className="mt-1 text-sm text-green-700">
                      Your response has been recorded. Redirecting to reviews...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
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
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Invitation Details */}
            {!success && !error && (
              <>
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <h2 className="text-sm font-medium text-gray-900">Review Details</h2>
                  <div className="mt-3 space-y-2 text-sm">
                    {projectTitle && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project:</span>
                        <span className="font-medium text-gray-900">
                          {decodeURIComponent(projectTitle)}
                        </span>
                      </div>
                    )}
                    {criteriaName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criteria:</span>
                        <span className="font-medium text-gray-900">
                          {decodeURIComponent(criteriaName)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">What's involved?</h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Review the applicant's project assessment submission
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Provide a recommendation (Perfect, Can Speed Up, No Improvement, Need Serious
                      Action)
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Write detailed analysis and feedback
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => handleResponse(InviteStatus.REJECTED)}
                    disabled={isProcessing || isLoadingProjectReviews}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleResponse(InviteStatus.ACCEPTED)}
                    disabled={isProcessing || isLoadingProjectReviews}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                  >
                    {isProcessing || isLoadingProjectReviews ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      'Accept Invitation'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </ReviewerLayout>
    </AuthGuard>
  );
}
