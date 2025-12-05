/**
 * Co-Applicant Invite Route
 * URL: /co-applicant/invite?token=xxx&slug=xxx
 */

import { Suspense } from 'react';
import { CoApplicantInvitePage } from '@/components/co-applicant';

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

export default function CoApplicantInviteRoute() {
  return (
    <Suspense fallback={<InviteLoading />}>
      <CoApplicantInvitePage />
    </Suspense>
  );
}
