"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import CreateCycleModal from "@/components/pm/CreateCycleModal";

import { usePm } from "@/hooks/usePm";

import { Cycle, CycleStatus } from "@/types/pm.types";

export default function PMDashboard() {
  const {
    program,
    isProgramLoading,
    getAssignedProgram,
    cycles,
    cyclesPagination,
    isCyclesLoading,
    cyclesError,
    isProgramAssigned,
    getProgramCycles,
    deleteCycle,
  } = usePm();

  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load program and cycles on mount
  useEffect(() => {
    loadProgramAndCycles();
  }, []);

  const loadProgramAndCycles = async () => {
    try {
      // First, get the assigned program
      await getAssignedProgram();
      // Then load cycles
      await loadCycles(1);
    } catch (error) {
      console.error("Failed to load program and cycles:", error);
    }
  };

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

  const handleCreateCycle = () => {
    console.log("Opening create cycle modal. Current program:", program);
    console.log("Program ID to pass to modal:", program?.id);
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

  // Derived states for better readability
  // const isAssignedToProgram = isProgramAssigned === true;  // commented out as it's unused
  const isNotAssigned = isProgramAssigned === false;
  const isLoading = isProgramLoading || isCyclesLoading;

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Loading program details...
                </span>
              </div>
            </div>
          ) : program ? (
            <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {program.details?.name || "Program Management"}
                      </h1>
                      <p className="text-gray-600">
                        {program.details?.description ||
                          "Innovation Program Management"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Program Manager</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="bg-opacity-60 flex items-center space-x-3 rounded-lg bg-white p-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {cycles.length}
                    </div>
                    <div className="text-xs text-gray-600">Active Cycles</div>
                  </div>
                </div>

                <div className="bg-opacity-60 flex items-center space-x-3 rounded-lg bg-white p-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(
                        program.budget?.amount || 0,
                        program.budget?.currency || "INR",
                      )}
                    </div>
                    <div className="text-xs text-gray-600">Total Budget</div>
                  </div>
                </div>

                <div className="bg-opacity-60 flex items-center space-x-3 rounded-lg bg-white p-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {program.minTRL} - {program.maxTRL}
                    </div>
                    <div className="text-xs text-gray-600">TRL Range</div>
                  </div>
                </div>

                <div className="bg-opacity-60 flex items-center space-x-3 rounded-lg bg-white p-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {program.manager
                        ? `${program.manager.person.firstName} ${program.manager.person.lastName}`
                        : "You"}
                    </div>
                    <div className="text-xs text-gray-600">Program Manager</div>
                  </div>
                </div>
              </div>
            </div>
          ) : isNotAssigned && !isLoading ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    No Program Assigned
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    You don't appear to be assigned to any program yet. Contact
                    your administrator.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Program Cycles
              </h2>
              <p className="mt-1 text-gray-600">
                Manage application cycles for your program
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
                Get started by creating your first funding cycle for your
                assigned program
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
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Program Cycles
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Manage funding cycles for your assigned program
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Round
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
                      <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {cycles.map((cycle: Cycle) => (
                      <tr
                        key={cycle.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          (window.location.href = `/pm/cycles/${cycle.slug}`)
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Year {cycle.round.year}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cycle.round.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(
                              cycle.budget.amount,
                              cycle.budget.currency,
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(cycle.duration.startDate)}
                          </div>
                          <div className="text-sm text-gray-500">
                            to {formatDate(cycle.duration.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${getStatusBadgeColor(
                              cycle.status,
                            )}`}
                          >
                            {cycle.status || "DRAFT"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-3">
                            <Link
                              href={`/pm/cycles/${cycle.slug}`}
                              className="text-blue-600 hover:text-blue-900"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Details
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCycle(cycle.id);
                              }}
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
                            cyclesPagination.total,
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

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Getting Started
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    As a Program Manager, you can create and manage program
                    cycles. Each cycle defines funding rounds, budgets, TRL
                    criteria, and scoring schemes for evaluating applications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Cycle Modal */}
          {isCreateModalOpen && (
            <CreateCycleModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSuccess={handleCreateSuccess}
              programId={program?.id} // Pass the assigned program ID
            />
          )}
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
