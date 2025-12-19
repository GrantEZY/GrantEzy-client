/**
 * Project Assessment Reviewer Invite Route (Backend Email Link)
 * URL: /project-assessment/invite-accept-or-reject/?token=...&slug=...&assessment=...
 * This matches the email template route from the backend
 * Redirects to the proper reviewer invite page
 */

'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

function ProjectAssessmentInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const slug = searchParams.get('slug');
    const assessment = searchParams.get('assessment');

    if (token && slug && assessment) {
      // Redirect to the actual invite handling page
      router.replace(
        `/reviewer/project-assessment-invite?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}&assessment=${encodeURIComponent(assessment)}`
      );
    } else {
      // Missing parameters
      router.replace('/login');
    }
  }, [searchParams, router]);

  return <InviteLoading />;
}

export default function ProjectAssessmentInvitePage() {
  return (
    <Suspense fallback={<InviteLoading />}>
      <ProjectAssessmentInviteContent />
    </Suspense>
  );
}
