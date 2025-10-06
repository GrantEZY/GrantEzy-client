"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout.tsx";

import { usePm } from "@/hooks/usePm";

import { Program, ProgramStatus } from "@/types/gcv.types";
import type { Cycle } from "@/types/pm.types";

export default function PMDashboard() {
  const { assignedPrograms, isProgramsLoading, getAssignedPrograms, cycles } =
    usePm();

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      // Load assigned programs on first mount
      getAssignedPrograms({
        page: 1,
        numberOfResults: 10,
      });
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, getAssignedPrograms]);

  const activePrograms = assignedPrograms.filter(
    (program: Program) => program.status === ProgramStatus.ACTIVE,
  );

  const activeCyclesCount = cycles.filter(
    (cycle: Cycle) => cycle.status === "ACTIVE",
  ).length;

  const totalBudgetAllocated = cycles.reduce(
    (total: number, cycle: Cycle) => total + cycle.budget.amount,
    0,
  );

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Program Manager Dashboard
              </h1>

              <p className="mt-2 text-gray-600">
                Manage your assigned programs and cycles
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                    Active Cycles
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {activeCyclesCount}
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Budget
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(totalBudgetAllocated / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-2">
                  <svg
                    className="h-6 w-6 text-purple-600"
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
                </div>

                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Programs
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {activePrograms.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link
                  className="rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md"
                  href="/pm/cycles"
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <svg
                        className="h-5 w-5 text-blue-600"
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
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">
                        Create New Cycle
                      </h3>

                      <p className="text-sm text-gray-600">
                        Set up a new funding cycle
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  className="rounded-lg border border-gray-200 p-4 transition-all hover:border-green-300 hover:shadow-md"
                  href="/pm/programs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <svg
                        className="h-5 w-5 text-green-600"
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
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">
                        View Programs
                      </h3>

                      <p className="text-sm text-gray-600">
                        Manage your assigned programs
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  className="rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-300 hover:shadow-md"
                  href="/pm/dashboard"
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <svg
                        className="h-5 w-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">Analytics</h3>

                      <p className="text-sm text-gray-600">
                        View detailed analytics
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Programs */}
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Assigned Programs
                </h2>

                <Link
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  href="/pm/programs"
                >
                  View All
                </Link>
              </div>

              {isProgramsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
              ) : assignedPrograms.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No programs assigned yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedPrograms.slice(0, 5).map((program: Program) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                      key={program.id}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {program.details.name}
                        </h3>

                        <p className="text-sm text-gray-600">
                          {program.details.description}
                        </p>

                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-xs text-gray-500">
                            Budget: ₹
                            {(program.budget.amount / 100000).toFixed(1)}L
                          </span>

                          <span className="text-xs text-gray-500">
                            {program.organization?.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            program.status === ProgramStatus.ACTIVE
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {program.status}
                        </span>

                        <Link
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          href={`/pm/cycles?programId=${program.id}`}
                        >
                          View Cycles
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
