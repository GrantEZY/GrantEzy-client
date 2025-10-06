"use client";

import { Suspense, useEffect, useState } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import CreateCycleModal from "@/components/pm/CreateCycleModal";

import { usePm } from "@/hooks/usePm";

import { CycleStatus } from "@/types/pm.types";

function CyclesPageContent() {
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId");

  const {
    assignedPrograms,
    cycles,
    cyclesPagination,
    isCyclesLoading,
    cyclesError,
    selectedProgramId,
    getProgramCycles,
    setSelectedProgramId,
    deleteCycle,
  } = usePm();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  // Set selected program from URL parameter
  useEffect(() => {
    if (programId && programId !== selectedProgramId) {
      setSelectedProgramId(programId);
    }
  }, [programId, selectedProgramId, setSelectedProgramId]);

  // Find selected program details
  useEffect(() => {
    if (selectedProgramId) {
      const program = assignedPrograms.find((p) => p.id === selectedProgramId);
      setSelectedProgram(program || null);
    }
  }, [selectedProgramId, assignedPrograms]);

  // Load cycles when program is selected
  useEffect(() => {
    if (selectedProgramId && isFirstLoad) {
      loadCycles(1);
      setIsFirstLoad(false);
    }
  }, [selectedProgramId, isFirstLoad]);

  const loadCycles = async (page: number) => {
    if (!selectedProgramId) return;

    try {
      await getProgramCycles({
        programId: selectedProgramId,
        page,
        numberOfResults: 10,
      });
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load cycles:", error);
    }
  };

  const handleDeleteCycle = async (cycleId: string) => {
    if (window.confirm("Are you sure you want to delete this cycle?")) {
      try {
        await deleteCycle({ cycleId });
        // Refresh cycles list
        loadCycles(currentPage);
      } catch (error) {
        console.error("Failed to delete cycle:", error);
      }
    }
  };

  const handleCreateCycle = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Refresh cycles list
    loadCycles(1);
  };

  if (!selectedProgramId) {
    return (
      <AuthGuard>
        <PMLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cycles Management
              </h1>

              <p className="mt-2 text-gray-600">
                Manage funding cycles for your programs
              </p>
            </div>

            <div className="rounded-lg bg-white p-8 text-center shadow">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>

              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Select a Program
              </h3>

              <p className="mb-4 text-gray-600">
                Please select a program to view and manage its cycles
              </p>

              <Link
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                href="/pm/programs"
              >
                View Programs
              </Link>
            </div>
          </div>
        </PMLayout>
      </AuthGuard>
    );
  }

  if (isCyclesLoading && isFirstLoad) {
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
              <h1 className="text-3xl font-bold text-gray-900">
                Cycles Management
              </h1>

              {selectedProgram && (
                <p className="mt-2 text-gray-600">
                  Managing cycles for:{" "}
                  <span className="font-medium">
                    {selectedProgram.details.name}
                  </span>
                </p>
              )}
            </div>

            <button
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={handleCreateCycle}
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Create New Cycle
            </button>
          </div>

          {/* Program Info Card */}
          {selectedProgram && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Program Budget
                  </p>

                  <p className="text-lg font-bold text-gray-900">
                    ₹{(selectedProgram.budget.amount / 100000).toFixed(1)}L
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">TRL Range</p>

                  <p className="text-lg font-bold text-gray-900">
                    {selectedProgram.minTRL} - {selectedProgram.maxTRL}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>

                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      selectedProgram.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedProgram.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Organization
                  </p>

                  <p className="text-lg font-bold text-gray-900">
                    {selectedProgram.organization?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cycles Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              { label: "Total Cycles", value: cycles.length, color: "blue" },
              {
                label: "Active Cycles",
                value: cycles.filter((c) => c.status === CycleStatus.ACTIVE)
                  .length,
                color: "green",
              },
              {
                label: "Draft Cycles",
                value: cycles.filter((c) => c.status === CycleStatus.DRAFT)
                  .length,
                color: "yellow",
              },
              {
                label: "Completed Cycles",
                value: cycles.filter((c) => c.status === CycleStatus.COMPLETED)
                  .length,
                color: "purple",
              },
            ].map((stat) => (
              <div className="rounded-lg bg-white p-6 shadow" key={stat.label}>
                <div className="flex items-center">
                  <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                    <svg
                      className={`h-6 w-6 text-${stat.color}-600`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>

                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cycles Table */}
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Program Cycles
                </h2>
              </div>

              {cyclesError && (
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
                        Error loading cycles
                      </h3>

                      <div className="mt-2 text-sm text-red-700">
                        <p>{cyclesError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {cycles.length === 0 && !isCyclesLoading ? (
                <div className="py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>

                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No cycles created
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first funding cycle.
                  </p>

                  <div className="mt-6">
                    <button
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={handleCreateCycle}
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      Create Cycle
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Cycle Info
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Budget
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Duration
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Status
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {cycles.map((cycle) => (
                        <tr className="hover:bg-gray-50" key={cycle.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {cycle.round.year} {cycle.round.type}
                              </div>

                              <div className="text-sm text-gray-500">
                                Created:{" "}
                                {new Date(cycle.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ₹{(cycle.budget.amount / 100000).toFixed(1)}L
                            </div>

                            <div className="text-sm text-gray-500">
                              {cycle.budget.currency}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(
                                cycle.duration.startDate,
                              ).toLocaleDateString()}
                            </div>

                            {cycle.duration.endDate && (
                              <div className="text-sm text-gray-500">
                                to{" "}
                                {new Date(
                                  cycle.duration.endDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                cycle.status === CycleStatus.ACTIVE
                                  ? "bg-green-100 text-green-800"
                                  : cycle.status === CycleStatus.DRAFT
                                    ? "bg-blue-100 text-blue-800"
                                    : cycle.status === CycleStatus.COMPLETED
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {cycle.status || "Active"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-200">
                                Edit
                              </button>

                              <button
                                className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-200"
                                onClick={() => handleDeleteCycle(cycle.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {cyclesPagination && cyclesPagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    {(currentPage - 1) * (cyclesPagination.limit || 10) + 1} to{" "}
                    {Math.min(
                      currentPage * (cyclesPagination.limit || 10),
                      cyclesPagination.total,
                    )}{" "}
                    of {cyclesPagination.total} results
                  </div>

                  <div className="flex space-x-2">
                    <button
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={currentPage <= 1 || isCyclesLoading}
                      onClick={() => loadCycles(currentPage - 1)}
                    >
                      Previous
                    </button>

                    <button
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={
                        currentPage >= cyclesPagination.totalPages ||
                        isCyclesLoading
                      }
                      onClick={() => loadCycles(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Cycle Modal */}
        {isCreateModalOpen && selectedProgramId && (
          <CreateCycleModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateSuccess}
            programId={selectedProgramId}
          />
        )}
      </PMLayout>
    </AuthGuard>
  );
}

export default function PMCyclesPage() {
  return (
    <Suspense
      fallback={
        <AuthGuard>
          <PMLayout>
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          </PMLayout>
        </AuthGuard>
      }
    >
      <CyclesPageContent />
    </Suspense>
  );
}
