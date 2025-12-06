/**
 * Co-Applicant Invite Page
 * Handles the invite verification and acceptance/rejection flow
 */
'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { InviteStatus } from '@/types/co-applicant.types';
import CoApplicantInvite from './CoApplicantInvite';

export default function CoApplicantInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const slug = searchParams.get('slug');
  const [inviteStatus, setInviteStatus] = useState<InviteStatus | null>(null);

  const handleStatusUpdate = (status: InviteStatus) => {
    setInviteStatus(status);
  };

  // Show success message after status update
  if (inviteStatus) {
    const isAccepted = inviteStatus === InviteStatus.ACCEPTED;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isAccepted ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <svg
              className={`w-8 h-8 ${isAccepted ? 'text-green-600' : 'text-red-600'}`}
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
            className={`text-2xl font-bold mb-2 ${isAccepted ? 'text-green-900' : 'text-red-900'}`}
          >
            {isAccepted ? 'Invitation Accepted!' : 'Invitation Declined'}
          </h2>

          <p className="text-gray-600 mb-6">
            {isAccepted
              ? 'You have successfully joined the team. You can now collaborate on the grant application.'
              : 'You have declined the invitation. Thank you for your response.'}
          </p>

          {isAccepted && (
            <button
              onClick={() => (window.location.href = '/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Invalid Invite Link</h2>
          <p className="text-gray-600">
            This invite link is invalid or incomplete. Please check the link and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <CoApplicantInvite token={token} slug={slug} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
}
