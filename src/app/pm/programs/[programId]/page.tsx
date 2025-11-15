/**
 * Individual Program Management Page
 * Shows cycle management for a specific program assigned to the PM
 */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import { usePm } from "@/hooks/usePm";
import { Program } from "@/types/gcv.types";
import { CycleStatus, Cycle } from "@/types/pm.types";
import CreateCycleModal from "@/components/pm/CreateCycleModal";

export default function ProgramDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.programId as string;
  
  const {
    cycles,
    cyclesPagination,
    isCyclesLoading,
    cyclesError,
    getProgramCycles,
    deleteCycle,
  } = usePm();

  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load cycles on mount - backend automatically determines the program from logged-in PM user
  useEffect(() => {
    loadCycles(1);
  }, []);

  // Extract program info from cycles
  useEffect(() => {
    if (cycles && cycles.length > 0) {
      const program = cycles.find(cycle => cycle.program?.id === programId)?.program;
      if (program) {
        setCurrentProgram(program);
      }
    }
  }, [cycles, programId]);

  const loadCycles = async (page: number) => {
    try {
      await getProgramCycles({
        page,
        numberOfResults: 10,
      });
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load cycles:", error);
    }
  };

  // Filter cycles for the current program
  const programCycles = cycles.filter(cycle => cycle.program?.id === programId);

  const handleCreateCycle = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadCycles(1);
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

  if (isCyclesLoading && !currentProgram) {
    return (
      <AuthGuard>
        <PMLayout>
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading program details...</p>
            </div>
          </div>
        </PMLayout>
      </AuthGuard>
    );
  }

  if (!currentProgram && !isCyclesLoading) {
    return (
      <AuthGuard>
        <PMLayout>
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="text-red-600">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium">Program Not Found</h3>
                <p className="mt-1 text-sm">This program is not assigned to you or doesn't exist.</p>
                <button
                  onClick={() => router.push("/pm/programs")}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  ← Back to Programs
                </button>
              </div>
            </div>
          </div>
        </PMLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Program Header */}
          {currentProgram && (
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push("/pm/programs")}
                    className="flex-shrink-0 p-2 rounded-lg bg-white bg-opacity-60 hover:bg-opacity-80 transition-colors"
                  >
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {currentProgram.details?.name || "Program Management"}
                        </h1>
                        <p className="text-gray-600">
                          {currentProgram.details?.description || "Innovation Program Management"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Program Manager</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{programCycles.length}</div>
                    <div className="text-xs text-gray-600">Active Cycles</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(currentProgram.budget?.amount || 0, currentProgram.budget?.currency || "INR")}
                    </div>
                    <div className="text-xs text-gray-600">Total Budget</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentProgram.minTRL} - {currentProgram.maxTRL}
                    </div>
                    <div className="text-xs text-gray-600">TRL Range</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentProgram.manager ? `${currentProgram.manager.person.firstName} ${currentProgram.manager.person.lastName}` : "You"}
                    </div>
                    <div className="text-xs text-gray-600">Program Manager</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cycles Management */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Program Cycles
              </h2>
              <p className="mt-1 text-gray-600">
                Manage funding cycles for this program
              </p>
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

          {cyclesError && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{cyclesError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cycles Table */}
          {programCycles.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Cycles Yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first program cycle.
              </p>
              <div className="mt-6">
                <button
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
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
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Cycle Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Budget & Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {programCycles.map((cycle) => (
                      <tr key={cycle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Round {cycle.round?.year} - {cycle.round?.type}
                            </div>
                            <div className="text-sm text-gray-500">
                              Created {formatDate(cycle.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(
                                cycle.budget?.amount || 0,
                                cycle.budget?.currency || "INR"
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(cycle.duration?.startDate)} -{" "}
                              {formatDate(cycle.duration?.endDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(cycle.status)}`}
                          >
                            {cycle.status || "DRAFT"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
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
            </div>
          )}

          {/* Pagination */}
          {cyclesPagination && cyclesPagination.total > 10 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={currentPage === 1}
                  onClick={() => loadCycles(currentPage - 1)}
                >
                  Previous
                </button>
                <button
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={currentPage === cyclesPagination.totalPages}
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
                      {(currentPage - 1) * cyclesPagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * cyclesPagination.limit,
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
              </div>
            </div>
          )}
        </div>

        {/* Create Cycle Modal */}
        <CreateCycleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
          programId={programId}
        />
      </PMLayout>
    </AuthGuard>
  );
}