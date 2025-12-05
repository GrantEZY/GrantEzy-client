/**
 * Co-Applicant Invite Verification Component
 * Displays invite details and allows accepting/rejecting invites
 */
"use client";

import { useEffect, useState } from "react";

import { useCoApplicantInvite } from "@/hooks/useCoApplicant";

import { InviteStatus } from "@/types/co-applicant.types";

/**
 * Co-Applicant Invite Verification Component
 * Displays invite details and allows accepting/rejecting invites
 */

interface CoApplicantInviteProps {
  token: string;
  slug: string;
  onStatusUpdate?: (status: InviteStatus) => void;
}

export default function CoApplicantInvite({
  token,
  slug,
  onStatusUpdate,
}: CoApplicantInviteProps) {
  const [hasVerified, setHasVerified] = useState(false);
  const [actionLoading, setActionLoading] = useState<
    "accept" | "reject" | null
  >(null);
  const [forceShowError, setForceShowError] = useState(false); // Force error to stay

  const {
    tokenDetails,
    isLoading,
    error,
    verifyToken,
    accept,
    reject,
    clearError,
  } = useCoApplicantInvite(token, slug);

  useEffect(() => {
    if (token && slug && !hasVerified) {
      console.log("[CoApplicantInvite] Verifying token:", { token, slug });
      verifyToken();
      setHasVerified(true);
    }
  }, [token, slug, hasVerified, verifyToken]);

  // Log error when it changes and keep it visible
  useEffect(() => {
    if (error) {
      console.error("[CoApplicantInvite] Error occurred:", error);
      console.error("[CoApplicantInvite] Token details:", tokenDetails);
      setForceShowError(true);

      // Keep error visible for 30 seconds minimum
      setTimeout(() => {
        console.log("[CoApplicantInvite] Error still showing after 30s");
      }, 30000);
    }
  }, [error, tokenDetails]);

  const handleAccept = async () => {
    setActionLoading("accept");
    const result = await accept();
    setActionLoading(null);

    if (result.success) {
      onStatusUpdate?.(InviteStatus.ACCEPTED);
    }
  };

  const handleReject = async () => {
    setActionLoading("reject");
    const result = await reject();
    setActionLoading(null);

    if (result.success) {
      onStatusUpdate?.(InviteStatus.REJECTED);
    }
  };

  // Log render state
  console.log("[CoApplicantInvite] Render state:", {
    isLoading,
    error,
    forceShowError,
    hasTokenDetails: !!tokenDetails,
    hasVerified,
  });

  // Show loading state during initial delay or actual loading
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="mb-6 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="flex space-x-4">
            <div className="h-10 w-24 rounded bg-gray-200"></div>
            <div className="h-10 w-24 rounded bg-gray-200"></div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            Verifying invitation...
          </p>
        </div>
      </div>
    );
  }

  // Force error to stay visible
  if (error || forceShowError) {
    // Check if it's an "already accepted" error
    const isAlreadyAccepted =
      error?.toLowerCase().includes("already") ||
      error?.toLowerCase().includes("accepted") ||
      error?.toLowerCase().includes("taken");

    return (
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              isAlreadyAccepted ? "bg-yellow-100" : "bg-red-100"
            }`}
          >
            <svg
              className={`h-8 w-8 ${isAlreadyAccepted ? "text-yellow-600" : "text-red-600"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isAlreadyAccepted ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {isAlreadyAccepted
              ? "Invitation Already Processed"
              : "Invite Invalid"}
          </h3>
          <p
            className={`mb-2 font-semibold ${isAlreadyAccepted ? "text-yellow-600" : "text-red-600"}`}
          >
            {error}
          </p>

          {isAlreadyAccepted ? (
            <div className="mt-6">
              <p className="mb-4 text-gray-600">
                This invitation has already been accepted. Please log in to
                continue.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    (window.location.href = `/login?redirect=/co-applicant/dashboard`)
                  }
                  className="w-full rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Go to Login
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `/signup?redirect=/co-applicant/dashboard`)
                  }
                  className="w-full rounded-md bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Create New Account
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 rounded-md bg-gray-50 p-4 text-left">
                <p className="mb-2 text-sm text-gray-600">
                  <strong>Token:</strong>{" "}
                  <code className="rounded bg-gray-200 px-2 py-1 text-xs">
                    {token}
                  </code>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Slug:</strong>{" "}
                  <code className="rounded bg-gray-200 px-2 py-1 text-xs">
                    {slug}
                  </code>
                </p>
              </div>
              <p className="mb-4 text-xs text-gray-500">
                Please check the browser console (F12) for more detailed error
                information.
              </p>
              <button
                onClick={clearError}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!tokenDetails) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <div className="text-center text-gray-600">
          No invite details found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Co-Applicant Invitation
        </h2>
        <p className="text-gray-600">
          You have been invited to collaborate on a grant application
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 text-lg font-medium text-gray-900">
          Application Details
        </h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-600">
              Application Name:
            </span>
            <p className="text-gray-900">{tokenDetails.application.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">
              Problem Statement:
            </span>
            <p className="text-gray-900">{tokenDetails.application.problem}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">
              Invited On:
            </span>
            <p className="text-gray-900">
              {new Date(tokenDetails.invitedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleAccept}
          disabled={actionLoading !== null}
          className="flex items-center space-x-2 rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLoading === "accept" && (
            <svg
              className="h-4 w-4 animate-spin"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span>Accept Invitation</span>
        </button>

        <button
          onClick={handleReject}
          disabled={actionLoading !== null}
          className="flex items-center space-x-2 rounded-md bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLoading === "reject" && (
            <svg
              className="h-4 w-4 animate-spin"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span>Decline Invitation</span>
        </button>
      </div>
    </div>
  );
}
