"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { AuthGuard } from "@/components/guards/AuthGuard";
import ApplicantLayout from "@/components/layout/ApplicantLayout";

import { useApplicant } from "@/hooks/useApplicant";

import { UserApplication } from "@/types/applicant.types";

export default function MyApplicationsPage() {
  const router = useRouter();
  const {
    myApplications,
    linkedApplications,
    isLoadingApplications,
    fetchUserApplications,
    error,
  } = useApplicant();

  useEffect(() => {
    fetchUserApplications();
  }, [fetchUserApplications]);

  const handleApplicationClick = (application: UserApplication) => {
    if (!application.isSubmitted) {
      // If it's a draft, open in edit mode
      const cycleSlug = application.cycle?.slug;
      if (!cycleSlug) {
        console.error("Application missing cycle slug:", application);
        // Fallback: try to use the application ID to fetch details
        router.push(`/applicant/application/${application.id}`);
        return;
      }
      router.push(`/applicant/new-application?cycleSlug=${cycleSlug}`);
    } else {
      // If it's submitted, open in view mode
      router.push(`/applicant/application/${application.id}`);
    }
  };

  const getStatusBadge = (application: UserApplication) => {
    if (application.isSubmitted) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Submitted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        Draft
      </span>
    );
  };

  const getProgressPercentage = (stepNumber: number) => {
    const totalSteps = 7;
    return Math.round((stepNumber / totalSteps) * 100);
  };

  return (
    <AuthGuard>
      <ApplicantLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Applications
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage all your applications
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingApplications ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <div className="flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Loading your applications...
              </p>
            </div>
          ) : (
            <>
              {/* My Created Applications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Applications I Created ({myApplications.length})
                  </h2>
                </div>

                {myApplications.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
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
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No Applications Yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      You haven't created any applications yet. Go to Available
                      Cycles to start a new application.
                    </p>
                    <button
                      onClick={() => router.push("/applicant/cycles")}
                      className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Browse Cycles
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myApplications.map((application) => {
                      const progress = getProgressPercentage(
                        application.stepNumber || 0,
                      );

                      return (
                        <div
                          key={application.id}
                          onClick={() => handleApplicationClick(application)}
                          className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                                  {application.basicDetails?.title ||
                                    "Untitled Application"}
                                </h3>
                                {getStatusBadge(application)}
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

                              {/* Progress Bar */}
                              {!application.isSubmitted && (
                                <div className="mt-4">
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600">
                                      Step {application.stepNumber || 0} of 7
                                    </span>
                                    <span className="text-xs font-medium text-gray-600">
                                      {progress}% Complete
                                    </span>
                                  </div>
                                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div
                                      className="h-full bg-blue-600 transition-all duration-300"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="ml-4">
                              <svg
                                className="h-6 w-6 text-gray-400 transition-colors group-hover:text-blue-600"
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
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Linked Applications (Co-applicant) */}
              {linkedApplications.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Applications I'm Collaborating On (
                      {linkedApplications.length})
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {linkedApplications.map((application) => {
                      const progress = getProgressPercentage(
                        application.stepNumber || 0,
                      );

                      return (
                        <div
                          key={application.id}
                          onClick={() => handleApplicationClick(application)}
                          className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                                  {application.basicDetails?.title ||
                                    "Untitled Application"}
                                </h3>
                                {getStatusBadge(application)}
                                <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs text-blue-600">
                                  <svg
                                    className="mr-1 h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                  </svg>
                                  Co-applicant
                                </span>
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

                              {/* Progress Bar */}
                              {!application.isSubmitted && (
                                <div className="mt-4">
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600">
                                      Step {application.stepNumber || 0} of 7
                                    </span>
                                    <span className="text-xs font-medium text-gray-600">
                                      {progress}% Complete
                                    </span>
                                  </div>
                                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div
                                      className="h-full bg-blue-600 transition-all duration-300"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="ml-4">
                              <svg
                                className="h-6 w-6 text-gray-400 transition-colors group-hover:text-blue-600"
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
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
