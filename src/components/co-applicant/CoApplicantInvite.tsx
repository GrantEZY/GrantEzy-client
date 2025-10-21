/**
 * Co-Applicant Invite Verification Component
 * Displays invite details and allows accepting/rejecting invites
 */
"use client";

import { useEffect, useState } from "react";
import { useCoApplicantInvite } from "@/hooks/useCoApplicant";
import { InviteStatus } from "@/types/co-applicant.types";

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
  const [actionLoading, setActionLoading] = useState<'accept' | 'reject' | null>(null);
  
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
      verifyToken();
      setHasVerified(true);
    }
  }, [token, slug, hasVerified, verifyToken]);

  const handleAccept = async () => {
    setActionLoading('accept');
    const result = await accept();
    setActionLoading(null);
    
    if (result.success) {
      onStatusUpdate?.(InviteStatus.ACCEPTED);
    }
  };

  const handleReject = async () => {
    setActionLoading('reject');
    const result = await reject();
    setActionLoading(null);
    
    if (result.success) {
      onStatusUpdate?.(InviteStatus.REJECTED);
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invite Invalid</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tokenDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center text-gray-600">
          No invite details found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Co-Applicant Invitation</h2>
        <p className="text-gray-600">
          You have been invited to collaborate on a grant application
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Application Details</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-600">Application Name:</span>
            <p className="text-gray-900">{tokenDetails.application.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Problem Statement:</span>
            <p className="text-gray-900">{tokenDetails.application.problem}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Invited On:</span>
            <p className="text-gray-900">
              {new Date(tokenDetails.invitedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 justify-center">
        <button
          onClick={handleAccept}
          disabled={actionLoading !== null}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {actionLoading === 'accept' && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>Accept Invitation</span>
        </button>
        
        <button
          onClick={handleReject}
          disabled={actionLoading !== null}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {actionLoading === 'reject' && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>Decline Invitation</span>
        </button>
      </div>
    </div>
  );
}