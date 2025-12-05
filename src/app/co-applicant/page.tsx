/**
 * Co-Applicant Main Page
 * URL: /co-applicant
 */

"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

/**
 * Co-Applicant Main Page
 * URL: /co-applicant
 */

/**
 * Co-Applicant Main Page
 * URL: /co-applicant
 */

export default function CoApplicantPage() {
  const { user: _user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = "/login?redirect=/co-applicant";
      return;
    }

    // If authenticated, redirect to dashboard
    window.location.href = "/co-applicant/dashboard";
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200"></div>
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
