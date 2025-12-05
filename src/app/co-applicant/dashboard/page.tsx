/**
 * Co-Applicant Dashboard Route
 * URL: /co-applicant/dashboard
 */

"use client";

import { useEffect, useState } from "react";

import { ApplicationDetailsView } from "@/components/co-applicant";
import { AuthGuard } from "@/components/guards/AuthGuard";
import CoApplicantLayout from "@/components/layout/CoApplicantLayout";

import { useAuth } from "@/hooks/useAuth";
import { useCoApplicant } from "@/hooks/useCoApplicant";

/**
 * Co-Applicant Dashboard Route
 * URL: /co-applicant/dashboard
 */

/**
 * Co-Applicant Dashboard Route
 * URL: /co-applicant/dashboard
 */

export default function CoApplicantDashboard() {
  const { user } = useAuth();
  const { linkedProjects, isLoading, getUserLinkedProjects } = useCoApplicant();
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Fetch linked projects when component mounts
    console.log("[CoApplicantDashboard] Fetching linked projects");
    getUserLinkedProjects(1, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplicationClick = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  };

  const handleBackToList = () => {
    setSelectedApplicationId(null);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      DRAFT: "bg-yellow-100 text-yellow-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-purple-100 text-purple-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  if (selectedApplicationId) {
    return (
      <AuthGuard>
        <ApplicationDetailsView
          applicationId={selectedApplicationId}
          onBack={handleBackToList}
        />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <CoApplicantLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Co-Applicant Dashboard
              </h1>
              <p className="text-gray-600">
                View and manage the applications you're collaborating on
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Your Applications ({linkedProjects.length})
              </h2>

              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="text-gray-600">Loading your applications...</p>
                </div>
              ) : linkedProjects.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No Applications Yet
                  </h3>
                  <p className="mb-6 text-gray-600">
                    You haven't been added to any applications yet. Once you
                    accept an invitation, your applications will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {linkedProjects.map((application) => (
                    <div
                      key={application.id}
                      onClick={() => handleApplicationClick(application.id)}
                      className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                              {application.basicDetails?.title ||
                                "Untitled Application"}
                            </h3>
                            {getStatusBadge(application.status)}
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Program:</span>{" "}
                              {application.cycle?.program?.details?.name ||
                                "Unknown Program"}
                            </p>
                            <p>
                              <span className="font-medium">Cycle:</span>{" "}
                              {application.cycle?.round
                                ? `${application.cycle.round.type} ${application.cycle.round.year}`
                                : "Unknown Cycle"}
                            </p>
                            <p>
                              <span className="font-medium">Created:</span>{" "}
                              {new Date(
                                application.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="ml-4">
                          <svg
                            className="h-6 w-6 text-gray-400 group-hover:text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Your Profile
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Name:
                  </span>
                  <p className="text-gray-900">
                    {user ? `${user.firstName} ${user.lastName}` : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Email:
                  </span>
                  <p className="text-gray-900">{user?.email || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Role:
                  </span>
                  <p className="text-gray-900">{user?.role || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CoApplicantLayout>
    </AuthGuard>
  );
}
