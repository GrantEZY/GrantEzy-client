"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import { usePm } from "@/hooks/usePm";
import { useGcv } from "@/hooks/useGcv";
import { CycleStatus } from "@/types/pm.types";
import { Program } from "@/types/gcv.types";

export default function PMDashboardPage() {
  const { cycles, selectedProgramId, setSelectedProgramId } = usePm();
  const { programs, getPrograms, isProgramsLoading } = useGcv();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Load programs on mount
  useEffect(() => {
    if (programs.length === 0 && !isProgramsLoading) {
      getPrograms({ page: 1, numberOfResults: 100 });
    }
  }, []);

  // Find selected program details
  useEffect(() => {
    if (selectedProgramId && programs.length > 0) {
      const program = programs.find((p) => p.id === selectedProgramId);
      setSelectedProgram(program || null);
    }
  }, [selectedProgramId, programs]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalCycles = cycles.length;
    const activeCycles = cycles.filter(cycle => cycle.status === CycleStatus.ACTIVE).length;
    const completedCycles = cycles.filter(cycle => cycle.status === CycleStatus.COMPLETED).length;
    const draftCycles = cycles.filter(cycle => cycle.status === CycleStatus.DRAFT).length;
    
    const totalBudget = cycles.reduce((sum, cycle) => sum + (cycle.budget?.amount || 0), 0);
    const activeBudget = cycles
      .filter(cycle => cycle.status === CycleStatus.ACTIVE)
      .reduce((sum, cycle) => sum + (cycle.budget?.amount || 0), 0);

    // Upcoming deadlines (cycles ending in next 30 days)
    const now = new Date();
    const upcomingDeadlines = cycles.filter(cycle => {
      if (!cycle.duration?.endDate || cycle.status === CycleStatus.COMPLETED) return false;
      const endDate = new Date(cycle.duration.endDate);
      const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilEnd <= 30 && daysUntilEnd > 0;
    }).length;

    return {
      totalCycles,
      activeCycles,
      completedCycles,
      draftCycles,
      totalBudget,
      activeBudget,
      upcomingDeadlines,
    };
  }, [cycles]);

  const formatCurrency = (amount: number, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const recentCycles = cycles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Program Manager Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                {selectedProgram 
                  ? `Analytics for ${selectedProgram.details.name}`
                  : "Overview of your cycle management activities"
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/pm/programs"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Select Program
              </Link>
              {selectedProgramId && (
                <Link
                  href={`/pm/cycles?programId=${selectedProgramId}`}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Manage Cycles
                </Link>
              )}
            </div>
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Cycles
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics.totalCycles}
                  </p>
                  <p className="text-sm text-gray-500">
                    All funding cycles
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
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics.activeCycles}
                  </p>
                  <p className="text-sm text-green-600">
                    Currently running
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-3">
                  <svg
                    className="h-8 w-8 text-purple-600"
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
                    {formatCurrency(metrics.totalBudget)}
                  </p>
                  <p className="text-sm text-purple-600">
                    All cycles combined
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-lg bg-orange-100 p-3">
                  <svg
                    className="h-8 w-8 text-orange-600"
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
                    {metrics.upcomingDeadlines}
                  </p>
                  <p className="text-sm text-orange-600">
                    Next 30 days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cycle Status Distribution
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">
                      ACTIVE
                    </span>
                    <span className="ml-2 text-sm text-gray-600">Active Cycles</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics.activeCycles}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                      COMPLETED
                    </span>
                    <span className="ml-2 text-sm text-gray-600">Completed Cycles</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics.completedCycles}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800">
                      DRAFT
                    </span>
                    <span className="ml-2 text-sm text-gray-600">Draft Cycles</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics.draftCycles}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Budget Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Allocated</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(metrics.totalBudget)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Cycles Budget</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(metrics.activeBudget)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average per Cycle</span>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics.totalCycles > 0 
                      ? formatCurrency(Math.round(metrics.totalBudget / metrics.totalCycles))
                      : formatCurrency(0)
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Cycles */}
          <div className="rounded-lg bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Cycles
              </h3>
            </div>
            <div className="overflow-x-auto">
              {recentCycles.length === 0 ? (
                <div className="p-12 text-center">
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
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No cycles yet
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {selectedProgram 
                      ? "Create your first cycle for this program"
                      : "Select a program to start managing cycles"
                    }
                  </p>
                  {selectedProgramId ? (
                    <Link
                      href={`/pm/cycles?programId=${selectedProgramId}`}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Create First Cycle
                    </Link>
                  ) : (
                    <Link
                      href="/pm/programs"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Select Program
                    </Link>
                  )}
                </div>
              ) : (
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentCycles.map((cycle) => (
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
                            {formatCurrency(cycle.budget.amount, cycle.budget.currency)}
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
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {cycle.duration.startDate 
                            ? new Date(cycle.duration.startDate).toLocaleDateString()
                            : "Not set"
                          }
                          {cycle.duration.endDate && (
                            <div>to {new Date(cycle.duration.endDate).toLocaleDateString()}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pm/programs"
                className="inline-flex items-center rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                <svg
                  className="mr-2 h-4 w-4"
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
                Browse Programs
              </Link>
              {selectedProgramId && (
                <>
                  <Link
                    href={`/pm/cycles?programId=${selectedProgramId}`}
                    className="inline-flex items-center rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
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
                    Manage Cycles
                  </Link>
                </>
              )}
              <Link
                href="/gcv/programs"
                className="inline-flex items-center rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                View All Programs
              </Link>
            </div>
          </div>
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
