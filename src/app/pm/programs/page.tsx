"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";

import { usePm } from "@/hooks/usePm";

import { ProgramStatus } from "@/types/gcv.types";

export default function PMProgramsPage() {
  const {
    assignedPrograms,
    programsPagination,
    isProgramsLoading,
    programsError,
    getAssignedPrograms,
    setSelectedProgramId,
  } = usePm();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isFirstLoad) {
      loadPrograms(1);
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  const loadPrograms = async (page: number) => {
    try {
      await getAssignedPrograms({
        page,
        numberOfResults: 10,
      });
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load programs:", error);
    }
  };

  const handleViewCycles = (programId: string) => {
    setSelectedProgramId(programId);
  };

  if (isProgramsLoading && isFirstLoad) {
    return (
      <AuthGuard>
        <PMLayout>
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        </PMLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Programs</h1>

              <p className="mt-2 text-gray-600">
                Programs assigned to you for management
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-2">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Programs
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {
                      assignedPrograms.filter(
                        (p) => p.status === ProgramStatus.ACTIVE,
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-yellow-100 p-2">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L2.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Inactive Programs
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {
                      assignedPrograms.filter(
                        (p) => p.status === ProgramStatus.IN_ACTIVE,
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-2">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Programs
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {assignedPrograms.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Programs Table */}
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Assigned Programs
                </h2>
              </div>

              {programsError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>

                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error loading programs
                      </h3>

                      <div className="mt-2 text-sm text-red-700">
                        <p>{programsError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {assignedPrograms.length === 0 && !isProgramsLoading ? (
                <div className="py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>

                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No programs assigned
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    You haven&apos;t been assigned to any programs yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Program Name
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Organization
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Budget
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          TRL Range
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Status
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Duration
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {assignedPrograms.map((program) => (
                        <tr className="hover:bg-gray-50" key={program.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {program.details.name}
                              </div>

                              <div className="text-sm text-gray-500">
                                {program.details.description}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {program.organization?.name || "N/A"}
                            </div>

                            <div className="text-sm text-gray-500">
                              {program.organization?.type || ""}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ₹{(program.budget.amount / 100000).toFixed(1)}L
                            </div>

                            <div className="text-sm text-gray-500">
                              {program.budget.currency}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {program.minTRL} - {program.maxTRL}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                program.status === ProgramStatus.ACTIVE
                                  ? "bg-green-100 text-green-800"
                                  : program.status === ProgramStatus.IN_ACTIVE
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {program.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(
                                program.duration.startDate,
                              ).toLocaleDateString()}
                            </div>

                            {program.duration.endDate && (
                              <div className="text-sm text-gray-500">
                                to{" "}
                                {new Date(
                                  program.duration.endDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Link href={`/pm/cycles?programId=${program.id}`}>
                                <button
                                  className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-200"
                                  onClick={() => handleViewCycles(program.id)}
                                >
                                  View Cycles
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {programsPagination && programsPagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    {(currentPage - 1) * (programsPagination.limit || 10) + 1}{" "}
                    to{" "}
                    {Math.min(
                      currentPage * (programsPagination.limit || 10),
                      programsPagination.total,
                    )}{" "}
                    of {programsPagination.total} results
                  </div>

                  <div className="flex space-x-2">
                    <button
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={currentPage <= 1 || isProgramsLoading}
                      onClick={() => loadPrograms(currentPage - 1)}
                    >
                      Previous
                    </button>

                    <button
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={
                        currentPage >= programsPagination.totalPages ||
                        isProgramsLoading
                      }
                      onClick={() => loadPrograms(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
