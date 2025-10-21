/**
 * Application Details View for Co-Applicants
 * Shows application details, teammates, and pending invites
 */
"use client";

import { useEffect } from "react";
import { useCoApplicantApplication } from "@/hooks/useCoApplicant";
import { TeamMate, TeamMateInvite } from "@/types/co-applicant.types";

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
    clearError,
  } = useCoApplicantApplication(applicationId);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId, fetchApplication]);

  const renderTeamMate = (teammate: TeamMate) => (
    <div key={teammate.personId} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{teammate.name}</p>
        <p className="text-sm text-gray-600">{teammate.role}</p>
      </div>
      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
        Joined
      </span>
    </div>
  );

  const renderInvite = (invite: TeamMateInvite) => (
    <div key={invite.email} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{invite.email}</p>
        <p className="text-sm text-gray-600">{invite.inviteAs}</p>
      </div>
      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
        Pending
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Application</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => fetchApplication()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
          No application details found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Application Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {applicationDetails.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pending Invitations ({applicationDetails.teamMateInvites.length})</span>
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