/**
 * Co-Applicant Dashboard Route
 * URL: /co-applicant/dashboard
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ApplicationDetailsView } from "@/components/co-applicant";

export default function CoApplicantDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login?redirect=/co-applicant/dashboard";
    }
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

  // For now, we'll need to implement a way to get user's applications
  // This would typically come from the backend API
  const handleApplicationSelect = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  };

  const handleBackToList = () => {
    setSelectedApplicationId(null);
  };

  if (selectedApplicationId) {
    return (
      <ApplicationDetailsView
        applicationId={selectedApplicationId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Co-Applicant Dashboard
          </h1>
          <p className="text-gray-600">
            View and manage the applications you're collaborating on
          </p>
        </div>

        {/* Applications List Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Applications
          </h2>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't been added to any applications yet. Once you accept an invitation or are added to a team, your applications will appear here.
            </p>
            
            {/* Example of how applications would be displayed */}
            <div className="max-w-md mx-auto p-4 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500">
                Applications you collaborate on will appear as cards here, showing:
                <br />• Application name and status
                <br />• Your role in the team
                <br />• Progress and deadlines
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Name:</span>
              <p className="text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Role:</span>
              <p className="text-gray-900">{user?.role || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}