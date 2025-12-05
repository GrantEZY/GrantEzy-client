/**
 * Co-Applicant Invite Page
 * Handles the invite verification and acceptance/rejection flow
 */
"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { InviteStatus } from "@/types/co-applicant.types";

import CoApplicantInvite from "./CoApplicantInvite";

/**
 * Co-Applicant Invite Page
 * Handles the invite verification and acceptance/rejection flow
 */

/**
 * Co-Applicant Invite Page
 * Handles the invite verification and acceptance/rejection flow
 */

export default function CoApplicantInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const slug = searchParams.get("slug");
  const [inviteStatus, setInviteStatus] = useState<InviteStatus | null>(null);

  const handleStatusUpdate = (status: InviteStatus) => {
    setInviteStatus(status);
  };

  // Show success message after status update
  if (inviteStatus) {
    const isAccepted = inviteStatus === InviteStatus.ACCEPTED;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-md">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              isAccepted ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <svg
              className={`h-8 w-8 ${isAccepted ? "text-green-600" : "text-red-600"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isAccepted ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
          </div>

          <h2
            className={`mb-2 text-2xl font-bold ${
              isAccepted ? "text-green-900" : "text-red-900"
            }`}
          >
            {isAccepted ? "Invitation Accepted!" : "Invitation Declined"}
          </h2>

          <p className="mb-6 text-gray-600">
            {isAccepted
              ? "You have successfully joined the team. You can now collaborate on the grant application."
              : "You have declined the invitation. Thank you for your response."}
          </p>

          {isAccepted && (
            <button
              onClick={() => (window.location.href = "/login")}
              className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show error if token or slug is missing
  if (!token || !slug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-red-900">
            Invalid Invite Link
          </h2>
          <p className="text-gray-600">
            This invite link is invalid or incomplete. Please check the link and
            try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <CoApplicantInvite
        token={token}
        slug={slug}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
