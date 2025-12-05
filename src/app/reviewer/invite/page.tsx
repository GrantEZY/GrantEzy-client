'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useReviewer } from '@/hooks/useReviewer';
import { InviteStatus } from '@/types/reviewer.types';

function ReviewerInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateInviteStatus, clearError } = useReviewer();

  const [token, setToken] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [inviteAccepted, setInviteAccepted] = useState(false);

  useEffect(() => {
    // Get token and slug from URL query parameters
    const tokenParam = searchParams.get('token');
    const slugParam = searchParams.get('slug');

    if (tokenParam) setToken(tokenParam);
    if (slugParam) setSlug(slugParam);

    return () => {
      clearError();
    };
  }, [searchParams, clearError]);

  const handleResponse = async (status: InviteStatus.ACCEPTED | InviteStatus.REJECTED) => {
    if (!token || !slug) {
      setError('Invalid invitation link. Missing token or slug.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateInviteStatus({
        token,
        slug,
        status,
      });

      // Success - clear URL and show success message
      setSuccess(true);
      setInviteAccepted(status === InviteStatus.ACCEPTED);
      window.history.replaceState({}, '', '/reviewer/invite');

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login?redirect=/reviewer');
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while processing your response';

      // Check if this is an "already handled" error - treat as success
      if (errorMessage.toLowerCase().includes('already')) {
        setSuccess(true);
        setInviteAccepted(true); // Assume it was accepted if already handled
        window.history.replaceState({}, '', '/reviewer/invite');

        setTimeout(() => {
          router.push('/login?redirect=/reviewer');
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
          <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-indigo-100 p-3">
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-center text-2xl font-bold text-gray-900">Reviewer Invitation</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              You've been invited to review a grant application
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {!success ? (
              <>
                {/* Info Message */}
                <div className="mb-6 rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                        fillRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        A Program Manager has invited you to review a grant application. Please
                        accept or decline this invitation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          clipRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          fillRule="evenodd"
                        />
                      </svg>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-red-800">{error}</p>
                        {error.includes('already') && (
                          <Link
                            className="mt-2 inline-block text-sm font-medium text-red-600 hover:text-red-700"
                            href="/login?redirect=/reviewer"
                          >
                            Go to Login →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Invalid Link Warning */}
                {(!token || !slug) && (
                  <div className="mb-6 rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                          fillRule="evenodd"
                        />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          This invitation link appears to be invalid or incomplete. Please check the
                          link in your email invitation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    className="flex-1 rounded-md bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading || !token || !slug}
                    onClick={() => handleResponse(InviteStatus.ACCEPTED)}
                    type="button"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Accept Invitation'
                    )}
                  </button>

                  <button
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading || !token || !slug}
                    onClick={() => handleResponse(InviteStatus.REJECTED)}
                    type="button"
                  >
                    Decline
                  </button>
                </div>
              </>
            ) : (
              /* Success Message */
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
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
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {inviteAccepted ? 'Invitation Accepted!' : 'Invitation Declined'}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  {inviteAccepted
                    ? 'You can now review the application from your reviewer dashboard.'
                    : 'Your response has been recorded. Thank you for your time.'}
                </p>
                <p className="text-xs text-gray-500">Redirecting to dashboard in 3 seconds...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <p className="text-center text-xs text-gray-500">
                Need help?{' '}
                <Link className="font-medium text-indigo-600 hover:text-indigo-500" href="/contact">
                  Contact Support
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function page() {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <ReviewerInvitePage />
    </Suspense>
  );
}
