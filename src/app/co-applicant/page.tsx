/**
 * Co-Applicant Main Page
 * URL: /co-applicant
 */

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function CoApplicantPage() {
  const { user: _user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login?redirect=/co-applicant';
      return;
    }

    // If authenticated, redirect to dashboard
    window.location.href = '/co-applicant/dashboard';
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
