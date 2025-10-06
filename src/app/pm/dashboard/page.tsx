"use client";

import { useEffect, useState } from "react";

import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";

import { usePm } from "@/hooks/usePm";

import { Program } from "@/types/gcv.types";
import type { Cycle } from "@/types/pm.types";

export default function PMDashboardPage() {
  const { assignedPrograms, cycles, isProgramsLoading, getAssignedPrograms } =
    usePm();

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      getAssignedPrograms({
        page: 1,
        numberOfResults: 10,
      });
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, getAssignedPrograms]);

  // Calculate dashboard metrics
  const totalPrograms = assignedPrograms.length;
  const activeCycles =
    cycles?.filter((cycle: Cycle) => cycle.status === "ACTIVE") || [];

  const totalBudget =
    cycles?.reduce(
      (sum: number, cycle: Cycle) => sum + cycle.budget.amount,
      0,
    ) || 0;
  const upcomingDeadlines = cycles?.filter((cycle: Cycle) => {
    if (!cycle.duration.endDate) return false;
    const endDate = new Date(cycle.duration.endDate);
    const now = new Date();
    const daysUntilEnd = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilEnd <= 30 && daysUntilEnd > 0;
  }).length;

  if (isProgramsLoading) {
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics & Reports
            </h1>

            <p className="mt-2 text-gray-600">
              Detailed insights into your program management activities
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-3">
                  <svg
                    className="h-8 w-8 text-blue-600"
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

                  <p className="text-3xl font-bold text-gray-900">
                    {totalPrograms}
                  </p>

                  <p className="text-sm text-green-600">
                    All assigned programs
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-3">
                  <svg
                    className="h-8 w-8 text-green-600"
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
                    Active Cycles
                  </p>

                  <p className="text-3xl font-bold text-gray-900">
                    {activeCycles}
                  </p>

                  <p className="text-sm text-green-600">Currently running</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <svg
                    className="h-8 w-8 text-yellow-600"
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

                  <p className="text-3xl font-bold text-gray-900">
                    ₹{(totalBudget / 100000).toFixed(1)}L
                  </p>

                  <p className="text-sm text-green-600">
                    Allocated across cycles
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-red-100 p-3">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>

                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Upcoming Deadlines
                  </p>

                  <p className="text-3xl font-bold text-gray-900">
                    {upcomingDeadlines}
                  </p>

                  <p className="text-sm text-red-600">Next 30 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Analytics Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Program Status Distribution */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Program Status Distribution
              </h3>

              <div className="space-y-4">
                {["ACTIVE", "INACTIVE", "ARCHIVED"].map((status) => {
                  const count = assignedPrograms.filter(
                    (program: Program) => program.status === status,
                  ).length;
                  const percentage =
                    totalPrograms > 0
                      ? Math.round((count / totalPrograms) * 100)
                      : 0;

                  return (
                    <div
                      className="flex items-center justify-between"
                      key={status}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            status === "ACTIVE"
                              ? "bg-green-500"
                              : status === "INACTIVE"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          }`}
                        ></div>

                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {status.toLowerCase()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${
                              status === "ACTIVE"
                                ? "bg-green-500"
                                : status === "INACTIVE"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        <span className="w-12 text-sm text-gray-600">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cycle Status Overview */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Cycle Status Overview
              </h3>

              <div className="space-y-4">
                {["ACTIVE", "INACTIVE", "DRAFT", "COMPLETED"].map((status) => {
                  const count = cycles.filter(
                    (cycle) => cycle.status === status,
                  ).length;
                  const percentage =
                    cycles.length > 0
                      ? Math.round((count / cycles.length) * 100)
                      : 0;

                  return (
                    <div
                      className="flex items-center justify-between"
                      key={status}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            status === "ACTIVE"
                              ? "bg-green-500"
                              : status === "DRAFT"
                                ? "bg-blue-500"
                                : status === "COMPLETED"
                                  ? "bg-purple-500"
                                  : "bg-gray-500"
                          }`}
                        ></div>

                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {status.toLowerCase()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${
                              status === "ACTIVE"
                                ? "bg-green-500"
                                : status === "DRAFT"
                                  ? "bg-blue-500"
                                  : status === "COMPLETED"
                                    ? "bg-purple-500"
                                    : "bg-gray-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        <span className="w-12 text-sm text-gray-600">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>

              <div className="space-y-4">
                {cycles.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cycles.slice(0, 5).map((cycle: Cycle) => (
                      <div
                        className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3"
                        key={cycle.id}
                      >
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Cycle {cycle.round.year} {cycle.round.type}
                          </p>

                          <p className="text-sm text-gray-600">
                            Budget: ₹{(cycle.budget.amount / 100000).toFixed(1)}
                            L • Status: {cycle.status || "Active"}
                          </p>
                        </div>

                        <div className="text-sm text-gray-500">
                          {new Date(cycle.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
