/**
 * Co-Applicant Invite Route (Backend Email Link)
 * URL: /invite-accept-or-reject/[token]/[slug]
 * This matches the email template route from the backend
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import { CoApplicantInvite } from "@/components/co-applicant";
import { useSearchParams } from "next/navigation";
import { InviteStatus } from "@/types/co-applicant.types";
import { ToastProvider } from "@/components/ui/ToastNew";
import { use } from "react";

interface PageProps {
  params: Promise<{
    token: string;
    slug: string;
  }>;
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

function InvitePageContent({ params }: { params: { token: string; slug: string } }) {
  const { token, slug } = params;
  const searchParams = useSearchParams();
  const [inviteStatus, setInviteStatus] = useState<InviteStatus | null>(null);
  const [debugMode, setDebugMode] = useState(true); // Keep in debug mode
  const [mountTime] = useState(Date.now());

  console.log('[InvitePageContent] Rendering with:', { token, slug, inviteStatus, debugMode });

  // Prevent unmounting
  useEffect(() => {
    console.log('[InvitePageContent] Component mounted at:', mountTime);
    
    return () => {
      console.log('[InvitePageContent] Component unmounting after:', Date.now() - mountTime, 'ms');
    };
  }, [mountTime]);

  // Auto-redirect to login after 10 seconds if accepted
  useEffect(() => {
    if (inviteStatus === InviteStatus.ACCEPTED) {
      const timer = setTimeout(() => {
        console.log('[InvitePageContent] Auto-redirecting to login...');
        window.location.href = `/login?redirect=/co-applicant/dashboard&message=Please login or create an account to continue`;
      }, 10000); // 10 seconds to read and choose
      
      return () => clearTimeout(timer);
    }
  }, [inviteStatus]);

  const handleStatusUpdate = (status: InviteStatus) => {
    console.log('[InvitePageContent] Status update:', status);
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
              ? 'You have successfully joined the team. Choose an option below to continue.'
              : 'You have declined the invitation. Thank you for your response.'
            }
          </p>
          
          {isAccepted && (
            <>
              <div className="space-y-3 mb-4">
                <button
                  onClick={() => window.location.href = `/signup?redirect=/co-applicant/dashboard`}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Create New Account
                </button>
                <button
                  onClick={() => window.location.href = `/login?redirect=/co-applicant/dashboard`}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Login with Existing Account
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Redirecting to login in 10 seconds...
              </p>
            </>
          )}
          
          {!isAccepted && (
            <button
              onClick={() => window.location.href = `/`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Go to Homepage
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
  // Use React's use() hook to unwrap the promise in client component
  const resolvedParams = use(params);
  
  return (
    <ToastProvider>
      <Suspense fallback={<InviteLoading />}>
        <InvitePageContent params={resolvedParams} />
      </Suspense>
    </ToastProvider>
  );
}