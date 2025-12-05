"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";

import { useProjectManagement } from "@/hooks/useProjectManagement";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = params.cycleSlug as string;
  const applicationSlug = params.applicationSlug as string;

  const {
    currentProject,
    isProjectLoading,
    projectError,
    getProjectDetails,
    clearProject,
  } = useProjectManagement();

  useEffect(() => {
    if (cycleSlug && applicationSlug) {
      getProjectDetails({ cycleSlug, applicationSlug });
    }
    return () => {
      clearProject();
    };
  }, [cycleSlug, applicationSlug, getProjectDetails, clearProject]);

  const calculateBudgetTotal = (budget: any) => {
    if (!budget) return 0;

    let total = 0;

    // Sum array items
    if (budget.ManPower && Array.isArray(budget.ManPower)) {
      total += budget.ManPower.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0,
      );
    }
    if (budget.Equipment && Array.isArray(budget.Equipment)) {
      total += budget.Equipment.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0,
      );
    }
    if (budget.OtherCosts && Array.isArray(budget.OtherCosts)) {
      total += budget.OtherCosts.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0,
      );
    }

    // Add single items
    total += budget.Consumables?.Budget?.amount || 0;
    total += budget.Travel?.Budget?.amount || 0;
    total += budget.Contigency?.Budget?.amount || 0;
    total += budget.Overhead?.Budget?.amount || 0;

    return total;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
              Back to Projects
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Project Details
            </h1>
            <p className="mt-2 text-gray-600">
              View complete project information and budget breakdown
            </p>
          </div>

          {/* Loading State */}
          {isProjectLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading project details...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {projectError && !isProjectLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
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
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading project
                  </h3>
                  <p className="mt-2 text-sm text-red-700">{projectError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Project Details */}
          {!isProjectLoading && currentProject && (
            <>
              {/* Project Overview Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {currentProject.application?.basicInfo?.title ||
                          currentProject.application?.title ||
                          "Untitled Project"}
                      </h2>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(currentProject.status)}`}
                      >
                        {currentProject.status}
                      </span>
                    </div>
                    {currentProject.application?.basicInfo?.summary && (
                      <p className="mt-2 text-gray-600">
                        {currentProject.application.basicInfo.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-900">
                      Total Budget
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">
                      INR{" "}
                      {calculateBudgetTotal(
                        currentProject.allocatedBudget,
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-900">
                      Duration
                    </p>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                      {currentProject.plannedDuration?.startDate &&
                      currentProject.plannedDuration?.endDate
                        ? calculateDuration(
                            currentProject.plannedDuration.startDate.toString(),
                            currentProject.plannedDuration.endDate.toString(),
                          )
                        : "N/A"}{" "}
                      days
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <p className="text-sm font-medium text-purple-900">
                      Project ID
                    </p>
                    <p className="mt-2 font-mono text-sm text-purple-600">
                      {currentProject.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {currentProject.plannedDuration && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Project Timeline
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Start Date
                      </p>
                      <p className="mt-1 text-base text-gray-900">
                        {currentProject.plannedDuration.startDate
                          ? new Date(
                              currentProject.plannedDuration.startDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        End Date
                      </p>
                      <p className="mt-1 text-base text-gray-900">
                        {currentProject.plannedDuration.endDate
                          ? new Date(
                              currentProject.plannedDuration.endDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Breakdown */}
              {currentProject.allocatedBudget && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Budget Breakdown
                  </h3>

                  <div className="mt-4 space-y-6">
                    {/* ManPower */}
                    {currentProject.allocatedBudget.ManPower &&
                      Array.isArray(currentProject.allocatedBudget.ManPower) &&
                      currentProject.allocatedBudget.ManPower.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900">
                            ManPower
                          </h4>
                          <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Item
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {currentProject.allocatedBudget.ManPower.map(
                                  (item: any, idx: number) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {item.BudgetReason || "N/A"}
                                      </td>
                                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                                        {item.Budget?.currency || "INR"}{" "}
                                        {item.Budget?.amount?.toLocaleString() ||
                                          "0"}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {/* Equipment */}
                    {currentProject.allocatedBudget.Equipment &&
                      Array.isArray(currentProject.allocatedBudget.Equipment) &&
                      currentProject.allocatedBudget.Equipment.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Equipment
                          </h4>
                          <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Item
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {currentProject.allocatedBudget.Equipment.map(
                                  (item: any, idx: number) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {item.BudgetReason || "N/A"}
                                      </td>
                                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                                        {item.Budget?.currency || "INR"}{" "}
                                        {item.Budget?.amount?.toLocaleString() ||
                                          "0"}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {/* Other Costs */}
                    {currentProject.allocatedBudget.OtherCosts &&
                      Array.isArray(
                        currentProject.allocatedBudget.OtherCosts,
                      ) &&
                      currentProject.allocatedBudget.OtherCosts.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Other Costs
                          </h4>
                          <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Item
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {currentProject.allocatedBudget.OtherCosts.map(
                                  (item: any, idx: number) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {item.BudgetReason || "N/A"}
                                      </td>
                                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                                        {item.Budget?.currency || "INR"}{" "}
                                        {item.Budget?.amount?.toLocaleString() ||
                                          "0"}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {/* Single Budget Items */}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Additional Costs
                      </h4>
                      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {currentProject.allocatedBudget.Consumables?.Budget
                          ?.amount > 0 && (
                          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                            <span className="text-sm text-gray-600">
                              Consumables
                            </span>
                            <span className="font-medium text-gray-900">
                              {currentProject.allocatedBudget.Consumables.Budget
                                .currency || "INR"}{" "}
                              {currentProject.allocatedBudget.Consumables.Budget.amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {currentProject.allocatedBudget.Travel?.Budget?.amount >
                          0 && (
                          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                            <span className="text-sm text-gray-600">
                              Travel
                            </span>
                            <span className="font-medium text-gray-900">
                              {currentProject.allocatedBudget.Travel.Budget
                                .currency || "INR"}{" "}
                              {currentProject.allocatedBudget.Travel.Budget.amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {currentProject.allocatedBudget.Contigency?.Budget
                          ?.amount > 0 && (
                          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                            <span className="text-sm text-gray-600">
                              Contingency
                            </span>
                            <span className="font-medium text-gray-900">
                              {currentProject.allocatedBudget.Contigency.Budget
                                .currency || "INR"}{" "}
                              {currentProject.allocatedBudget.Contigency.Budget.amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {currentProject.allocatedBudget.Overhead?.Budget
                          ?.amount > 0 && (
                          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                            <span className="text-sm text-gray-600">
                              Overhead
                            </span>
                            <span className="font-medium text-gray-900">
                              {currentProject.allocatedBudget.Overhead.Budget
                                .currency || "INR"}{" "}
                              {currentProject.allocatedBudget.Overhead.Budget.amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Total Budget
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          INR{" "}
                          {calculateBudgetTotal(
                            currentProject.allocatedBudget,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Details */}
              {currentProject.application && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Associated Application
                    </h3>
                    <Link
                      href={`/pm/cycles/${cycleSlug}/applications/${currentProject.application.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View Full Application →
                    </Link>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Application ID
                      </p>
                      <p className="mt-1 font-mono text-sm text-gray-900">
                        {currentProject.application.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Application Status
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentProject.application.status}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Project Metadata
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Created At
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(currentProject.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Last Updated
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(currentProject.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!isProjectLoading && !currentProject && !projectError && (
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
                Project Not Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The project you're looking for doesn't exist or you don't have
                access to it.
              </p>
              <div className="mt-6">
                <Link
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  href={`/pm/cycles/${cycleSlug}`}
                >
                  Back to Cycle
                </Link>
              </div>
            </div>
          )}
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
