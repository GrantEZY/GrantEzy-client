/**
 * Universal Invite Route (Backend Email Link)
 * URL: /invite-accept-or-reject/[token]/[slug]
 * This matches the email template route from the backend
 * Handles both CO-APPLICANT and REVIEWER invites
 */

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastProvider } from '@/components/ui/ToastNew';
import { use } from 'react';

interface PageProps {
  params: Promise<{
    token: string;
    slug: string;
  }>;
}

// Loading component for Suspense
function InviteLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvitePageContent({ params }: { params: { token: string; slug: string } }) {
  const { token, slug } = params;
  const router = useRouter();
  const [_isDetectingType, setIsDetectingType] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectInviteType() {
      try {
        // Check if there's an assessment query parameter (for project assessment reviews)
        const urlParams = new URLSearchParams(window.location.search);
        const assessmentId = urlParams.get('assessment');

        // Try co-applicant endpoint first
        const coApplicantResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/co-applicant/get-token-details?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`,
          { method: 'GET' }
        );

        if (coApplicantResponse.ok) {
          // It's a co-applicant invite
          console.log('[InviteRouter] Detected CO-APPLICANT invite, redirecting...');
          router.replace(
            `/co-applicant/invite?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`
          );
          return;
        }

        // Try reviewer endpoint
        const reviewerResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/reviewer/get-token-details?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`,
          { method: 'GET' }
        );

        if (reviewerResponse.ok) {
          // It's a reviewer invite - check if it's for project assessment
          if (assessmentId) {
            console.log('[InviteRouter] Detected PROJECT ASSESSMENT REVIEWER invite, redirecting...');
            router.replace(
              `/reviewer/invite?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}&assessment=${encodeURIComponent(assessmentId)}`
            );
          } else {
            console.log('[InviteRouter] Detected APPLICATION REVIEWER invite, redirecting...');
            router.replace(
              `/reviewer/invite?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`
            );
          }
          return;
        }

        // Neither worked
        setError('Invalid or expired invitation link');
        setIsDetectingType(false);
      } catch (err) {
        console.error('[InviteRouter] Error detecting invite type:', err);
        setError('Failed to verify invitation');
        setIsDetectingType(false);
      }
    }

    detectInviteType();
  }, [token, slug, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Invalid Invitation</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return <InviteLoading />;
}

export default function UniversalInviteRoute({ params }: PageProps) {
  // Use React's use() hook to unwrap the promise in client component
  const resolvedParams = use(params);

  return (
    <ToastProvider>
      <Suspense fallback={<InviteLoading />}>
        <InvitePageContent params={resolvedParams} />
      </Suspense>
    </ToastProvider>
  );
}
