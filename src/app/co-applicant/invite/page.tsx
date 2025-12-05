/**
 * Co-Applicant Invite Route
 * URL: /co-applicant/invite?token=xxx&slug=xxx
 */
import { Suspense } from "react";

import { CoApplicantInvitePage } from "@/components/co-applicant";

// Loading component for Suspense
function InviteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="mb-6 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="flex space-x-4">
            <div className="h-10 w-24 rounded bg-gray-200"></div>
            <div className="h-10 w-24 rounded bg-gray-200"></div>
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
