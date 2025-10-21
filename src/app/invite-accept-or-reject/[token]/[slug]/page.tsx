/**
 * Co-Applicant Invite Route (Backend Email Link)
 * URL: /invite-accept-or-reject/[token]/[slug]
 * This matches the email template route from the backend
 */

"use client";

import { Suspense } from "react";
import { CoApplicantInvite } from "@/components/co-applicant";
import { useState } from "react";
import { InviteStatus } from "@/types/co-applicant.types";

interface PageProps {
  params: {
    token: string;
    slug: string;
  };
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

function InvitePageContent({ params }: PageProps) {
  const { token, slug } = params;
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
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isAccepted ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <svg 
              className={`w-8 h-8 ${isAccepted ? 'text-green-600' : 'text-red-600'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isAccepted ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </div>
          
          <h2 className={`text-2xl font-bold mb-2 ${
            isAccepted ? 'text-green-900' : 'text-red-900'
          }`}>
            {isAccepted ? 'Invitation Accepted!' : 'Invitation Declined'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {isAccepted 
              ? 'You have successfully joined the team. You can now log in and collaborate on the grant application.'
              : 'You have declined the invitation. Thank you for your response.'
            }
          </p>
          
          {isAccepted && (
            <button
              onClick={() => window.location.href = '/login?redirect=/co-applicant'}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <CoApplicantInvite
        token={token}
        slug={slug}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

export default function CoApplicantInviteRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<InviteLoading />}>
      <InvitePageContent params={params} />
    </Suspense>
  );
}