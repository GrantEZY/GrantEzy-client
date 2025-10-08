"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";

export default function PMDashboard() {
  return (
    <AuthGuard >
      <PMLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Program Manager Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Manage program cycles, review applications, and track progress
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/pm/cycles"
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Manage Cycles
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Create and manage program cycles
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  View Cycles →
                </span>
              </div>
            </Link>

            <Link
              href="/pm/programs"
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-green-300"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    View Programs
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    See all available programs
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-green-600 group-hover:text-green-700">
                  View Programs →
                </span>
              </div>
            </Link>

            <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-purple-100 p-3">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Documentation
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Guide for program managers
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-purple-600">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

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
                    As a Program Manager, you can create and manage program cycles.
                    Each cycle defines funding rounds, budgets, TRL criteria, and
                    scoring schemes for evaluating applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
