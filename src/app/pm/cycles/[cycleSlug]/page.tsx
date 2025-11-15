"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import { usePm } from "@/hooks/usePm";

export default function CycleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = params.cycleSlug as string;

  const {
    currentCycle,
    currentCycleApplications,
    isCycleDetailsLoading,
    getCycleDetails,
  } = usePm();

  useEffect(() => {
    if (cycleSlug) {
      getCycleDetails({ cycleSlug });
    }
  }, [cycleSlug, getCycleDetails]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "REVISION_REQUESTED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <button
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() => router.back()}
              type="button"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Back to Cycles
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentCycle
                ? `${currentCycle.round.type} ${currentCycle.round.year}`
                : "Cycle Details"}
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage applications for this funding cycle
            </p>
          </div>

          {/* Cycle Info Card */}
          {currentCycle && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Cycle Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {currentCycle.budget?.currency || "INR"}{" "}
                    {currentCycle.budget?.amount?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(currentCycle.status || "DRAFT")}`}
                  >
                    {currentCycle.status || "DRAFT"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentCycle.duration?.startDate
                      ? new Date(
                          currentCycle.duration.startDate,
                        ).toLocaleDateString()
                      : "Not set"}{" "}
                    -{" "}
                    {currentCycle.duration?.endDate
                      ? new Date(currentCycle.duration.endDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isCycleDetailsLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading cycle details...
                </p>
              </div>
            </div>
          )}

          {/* Applications List */}
          {!isCycleDetailsLoading && currentCycleApplications && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Applications ({currentCycleApplications.length})
                </h2>
              </div>

              {currentCycleApplications.length === 0 ? (
                <div className="p-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No Applications
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No applications have been submitted for this cycle yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Applicant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Submitted
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {currentCycleApplications.map((application) => (
                        <tr
                          key={application.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.basicInfo?.title || "Untitled Application"}
                            </div>
                            {application.basicInfo?.summary && (
                              <div className="mt-1 text-sm text-gray-500">
                                {application.basicInfo.summary.substring(0, 100)}
                                {application.basicInfo.summary.length > 100 && "..."}
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {application.applicant?.email || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(application.status)}`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {application.createdAt
                              ? new Date(application.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <Link
                              className="text-blue-600 hover:text-blue-700"
                              href={`/pm/cycles/${cycleSlug}/applications/${application.slug}`}
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Empty State - No cycle loaded */}
          {!isCycleDetailsLoading && !currentCycle && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Cycle Not Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The cycle you're looking for doesn't exist or you don't have
                access to it.
              </p>
              <div className="mt-6">
                <Link
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  href="/pm/programs"
                >
                  Back to Programs
                </Link>
              </div>
            </div>
          )}
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
