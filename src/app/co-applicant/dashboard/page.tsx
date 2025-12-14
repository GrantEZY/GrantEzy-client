/**
 * Co-Applicant Dashboard Route
 * URL: /co-applicant/dashboard
 */

"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCoApplicant } from "@/hooks/useCoApplicant";
import CoApplicantLayout from "@/components/layout/CoApplicantLayout";
import { AuthGuard } from "@/components/guards/AuthGuard";

export default function CoApplicantDashboard() {
  const { user } = useAuth();
  const { linkedProjects, isLoading, getUserLinkedProjects } = useCoApplicant();

  useEffect(() => {
    // Fetch linked projects when component mounts
    console.log('[CoApplicantDashboard] Fetching linked projects');
    getUserLinkedProjects(1, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      DRAFT: "bg-yellow-100 text-yellow-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-purple-100 text-purple-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <AuthGuard>
      <CoApplicantLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Co-Applicant Dashboard
            </h1>
            <p className="text-gray-600">
              View and manage the applications you're collaborating on
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Applications ({linkedProjects.length})
            </h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your applications...</p>
              </div>
            ) : linkedProjects.length === 0 ? (
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
                  You haven't been added to any applications yet. Once you accept an invitation, your applications will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedProjects.map((application) => (
                  <div
                    key={application.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.basicDetails?.title || "Untitled Application"}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Program:</span>{" "}
                            {application.cycle?.program?.details?.name || "Unknown Program"}
                          </p>
                          <p>
                            <span className="font-medium">Cycle:</span>{" "}
                            {application.cycle?.round ? `${application.cycle.round.type} ${application.cycle.round.year}` : "Unknown Cycle"}
                          </p>
                          <p>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
      </CoApplicantLayout>
    </AuthGuard>
  );
}
