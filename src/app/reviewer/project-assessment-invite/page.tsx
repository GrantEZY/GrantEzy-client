'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useReviewer } from '@/hooks/useReviewer';
import { InviteStatus } from '@/types/reviewer.types';

function ProjectAssessmentReviewerInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submitProjectAssessmentReviewInviteStatus, clearError } = useReviewer();

  const [token, setToken] = useState('');
  const [slug, setSlug] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [inviteAccepted, setInviteAccepted] = useState(false);

  useEffect(() => {
    // Get parameters from URL query
    const tokenParam = searchParams.get('token');
    const slugParam = searchParams.get('slug');
    const assessmentParam = searchParams.get('assessment');

    if (tokenParam) setToken(tokenParam);
    if (slugParam) setSlug(slugParam);
    if (assessmentParam) setAssessmentId(assessmentParam);

    return () => {
      clearError();
    };
  }, [searchParams, clearError]);

  const handleResponse = async (status: InviteStatus.ACCEPTED | InviteStatus.REJECTED) => {
    if (!token || !slug || !assessmentId) {
      setError('Invalid invitation link. Missing required parameters.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await submitProjectAssessmentReviewInviteStatus({
        token,
        slug,
        assessmentId,
        status,
      });

      if (response) {
        // Success - clear URL and show success message
        setSuccess(true);
        setInviteAccepted(status === InviteStatus.ACCEPTED);
        window.history.replaceState({}, '', '/reviewer/project-assessment-invite');

        // Redirect to login or project reviews after a short delay
        setTimeout(() => {
          router.push('/login?redirect=/reviewer/project-reviews');
        }, 3000);
      } else {
        setError('Failed to process your response. Please try again.');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while processing your response';

      // Check if this is an "already handled" error - treat as success
      if (errorMessage.toLowerCase().includes('already')) {
        setSuccess(true);
        setInviteAccepted(true);
        window.history.replaceState({}, '', '/reviewer/project-assessment-invite');

        setTimeout(() => {
          router.push('/login?redirect=/reviewer/project-reviews');
        }, 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-blue-100 p-3">
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
              </div>
            </div>
            <h1 className="text-center text-2xl font-bold text-gray-900">
              Project Assessment Review Invitation
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              You&apos;ve been invited to evaluate a project assessment
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {!success ? (
              <>
                {/* Info Message */}
                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    You have been invited to review a project assessment submission. As a reviewer,
                    you will evaluate the project based on specific criteria and provide expert
                    feedback.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-4">
                    <div className="flex">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="ml-3 text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleResponse(InviteStatus.ACCEPTED)}
                    disabled={isLoading || !token || !slug || !assessmentId}
                    className="flex-1 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Accept Invitation'
                    )}
                  </button>

                  <button
                    onClick={() => handleResponse(InviteStatus.REJECTED)}
                    disabled={isLoading || !token || !slug || !assessmentId}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      href="/login?redirect=/reviewer/project-reviews"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              /* Success Message */
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {inviteAccepted ? 'Invitation Accepted!' : 'Invitation Declined'}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {inviteAccepted
                    ? 'You can now review the project assessment from your reviewer dashboard.'
                    : 'You have declined this invitation.'}
                </p>
                <p className="mt-4 text-sm text-gray-500">Redirecting you to login...</p>
                <div className="mt-6">
                  <Link
                    href="/login?redirect=/reviewer/project-reviews"
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            If you have any questions about this invitation, please contact the program manager who
            sent it.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProjectAssessmentInvitePageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-600">Loading invitation...</p>
          </div>
        </div>
      }
    >
      <ProjectAssessmentReviewerInvitePage />
    </Suspense>
  );
}
