"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import CreateCycleModal from "@/components/pm/CreateCycleModal";
import { usePm } from "@/hooks/usePm";
import { useGcv } from "@/hooks/useGcv";
import { CycleStatus, Cycle } from "@/types/pm.types";
import { Program } from "@/types/gcv.types";

function CyclesPageContent() {
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId");

  const {
    cycles,
    cyclesPagination,
    isCyclesLoading,
    cyclesError,
    selectedProgramId,
    getProgramCycles,
    setSelectedProgramId,
    deleteCycle,
  } = usePm();

  const { programs, getPrograms, isProgramsLoading } = useGcv();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Load programs on mount
  useEffect(() => {
    if (programs.length === 0 && !isProgramsLoading) {
      getPrograms({ page: 1, numberOfResults: 100 });
    }
  }, []);

  // Set selected program from URL parameter
  useEffect(() => {
    if (programId && programId !== selectedProgramId) {
      setSelectedProgramId(programId);
    }
  }, [programId, selectedProgramId, setSelectedProgramId]);

  // Find selected program details from GCV programs
  useEffect(() => {
    if (selectedProgramId && programs.length > 0) {
      const program = programs.find((p) => p.id === selectedProgramId);
      setSelectedProgram(program || null);
    }
  }, [selectedProgramId, programs]);

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
        loadCycles(currentPage);
      } catch (error) {
        console.error("Failed to delete cycle:", error);
        alert("Failed to delete cycle. Please try again.");
      }
    }
  };

  const handleCreateCycle = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadCycles(1);
  };

  const getStatusBadgeColor = (status?: CycleStatus) => {
    switch (status) {
      case CycleStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case CycleStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case CycleStatus.DRAFT:
        return "bg-gray-100 text-gray-800";
      case CycleStatus.INACTIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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
                Manage funding cycles for programs
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

            <div className="flex space-x-3">
              <Link
                href="/pm/programs"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Change Program
              </Link>
              <button
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={handleCreateCycle}
                disabled={!selectedProgramId}
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
          </div>

          {cyclesError && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
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
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading cycles
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{cyclesError}</p>
                </div>
              </div>
            </div>
          )}

          {!isCyclesLoading && cycles.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gray-400"
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
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No cycles yet
              </h3>
              <p className="mb-4 text-gray-600">
                Get started by creating your first funding cycle
              </p>
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
                Create First Cycle
              </button>
            </div>
          ) : (
            <div className="rounded-lg bg-white shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Round
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {cycles.map((cycle: Cycle) => (
                      <tr key={cycle.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            Year {cycle.round.year}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cycle.round.type}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(
                              cycle.budget.amount,
                              cycle.budget.currency
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(cycle.duration.startDate)}
                          </div>
                          <div className="text-sm text-gray-500">
                            to {formatDate(cycle.duration.endDate)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(
                              cycle.status
                            )}`}
                          >
                            {cycle.status || "DRAFT"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteCycle(cycle.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {cyclesPagination && cyclesPagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={currentPage <= 1 || isCyclesLoading}
                      onClick={() => loadCycles(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={
                        currentPage >= cyclesPagination.totalPages ||
                        isCyclesLoading
                      }
                      onClick={() => loadCycles(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * (cyclesPagination.limit || 10) +
                            1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * (cyclesPagination.limit || 10),
                            cyclesPagination.total
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {cyclesPagination.total}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <button
                          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={currentPage <= 1 || isCyclesLoading}
                          onClick={() => loadCycles(currentPage - 1)}
                        >
                          Previous
                        </button>
                        <button
                          className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={
                            currentPage >= cyclesPagination.totalPages ||
                            isCyclesLoading
                          }
                          onClick={() => loadCycles(currentPage + 1)}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

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

export default function CyclesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CyclesPageContent />
    </Suspense>
  );
}
