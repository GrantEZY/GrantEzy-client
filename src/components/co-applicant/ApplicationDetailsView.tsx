/**
 * Application Details View for Co-Applicants
 * Shows application details, teammates, and pending invites
 */
"use client";

import { useEffect } from "react";

import { useCoApplicantApplication } from "@/hooks/useCoApplicant";

import { TeamMate, TeamMateInvite } from "@/types/co-applicant.types";

/**
 * Application Details View for Co-Applicants
 * Shows application details, teammates, and pending invites
 */

/**
 * Application Details View for Co-Applicants
 * Shows application details, teammates, and pending invites
 */

interface ApplicationDetailsViewProps {
  applicationId: string;
  onBack?: () => void;
}

export default function ApplicationDetailsView({
  applicationId,
  onBack,
}: ApplicationDetailsViewProps) {
  const {
    applicationDetails,
    isLoading,
    error,
    fetchApplication,
    //clearError, //  comment out as it's unused
  } = useCoApplicantApplication(applicationId);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId, fetchApplication]);

  const renderTeamMate = (teammate: TeamMate) => (
    <div
      key={teammate.personId}
      className="flex items-center space-x-3 rounded-lg border border-green-200 bg-green-50 p-3"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-4 w-4 text-green-600"
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
      <div className="flex-1">
        <p className="font-medium text-gray-900">{teammate.name}</p>
        <p className="text-sm text-gray-600">{teammate.role}</p>
      </div>
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
        Joined
      </span>
    </div>
  );

  const renderInvite = (invite: TeamMateInvite) => (
    <div
      key={invite.email}
      className="flex items-center space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
        <svg
          className="h-4 w-4 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{invite.email}</p>
        <p className="text-sm text-gray-600">{invite.inviteAs}</p>
      </div>
      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
        Pending
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="mb-6 h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="text-center">
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
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Error Loading Application
            </h3>
            <p className="mb-4 text-gray-600">{error}</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => fetchApplication()}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Try Again
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
                >
                  Go Back
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!applicationDetails) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-white p-6 text-center text-gray-600 shadow-md">
          No application details found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Application Details
        </h1>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back</span>
          </button>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        {/* Application Info */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {applicationDetails.title}
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <span className="font-medium text-gray-600">Application ID:</span>
              <p className="text-gray-900">{applicationDetails.id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Applicant ID:</span>
              <p className="text-gray-900">{applicationDetails.applicantId}</p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-8">
          <h3 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-900">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Team Members ({applicationDetails.teammates.length})</span>
          </h3>
          {applicationDetails.teammates.length > 0 ? (
            <div className="space-y-3">
              {applicationDetails.teammates.map(renderTeamMate)}
            </div>
          ) : (
            <p className="text-gray-500 italic">No team members yet</p>
          )}
        </div>

        {/* Pending Invites */}
        <div>
          <h3 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-900">
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Pending Invitations ({applicationDetails.teamMateInvites.length})
            </span>
          </h3>
          {applicationDetails.teamMateInvites.length > 0 ? (
            <div className="space-y-3">
              {applicationDetails.teamMateInvites.map(renderInvite)}
            </div>
          ) : (
            <p className="text-gray-500 italic">No pending invitations</p>
          )}
        </div>
      </div>
    </div>
  );
}
