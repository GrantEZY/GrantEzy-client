"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import { useGcv } from "@/hooks/useGcv";
import { usePm } from "@/hooks/usePm";
import { ProgramStatus } from "@/types/gcv.types";

export default function PMProgramsPage() {
  const { programs, getPrograms, isProgramsLoading, programsError } = useGcv();
  const { setSelectedProgramId } = usePm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (programs.length === 0 && !isProgramsLoading) {
      getPrograms({ page: 1, numberOfResults: 50 });
    }
  }, []);

  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    window.location.href = `/pm/cycles?programId=${programId}`;
  };

  const getStatusBadgeColor = (status?: ProgramStatus) => {
    switch (status) {
      case ProgramStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case ProgramStatus.IN_ACTIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPrograms = programs.filter((program) =>
    program.details.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.details.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isProgramsLoading && programs.length === 0) {
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
                Select Program to Manage
              </h1>
              <p className="mt-2 text-gray-600">
                Choose a program to manage its cycles and activities
              </p>
            </div>
            <Link
              href="/pm"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="max-w-md">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </div>
              <input
                className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Search programs..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {programsError && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading programs</h3>
                  <p className="mt-1 text-sm text-red-700">{programsError}</p>
                </div>
              </div>
            </div>
          )}

          {filteredPrograms.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow">
              <svg className="mx-auto mb-4 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {searchTerm ? "No programs found" : "No programs available"}
              </h3>
              <p className="mb-4 text-gray-600">
                {searchTerm ? "Try adjusting your search terms" : "There are no programs available to manage at this time"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  className="cursor-pointer rounded-lg bg-white p-6 shadow transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                  onClick={() => handleSelectProgram(program.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {program.details.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {program.details.description}
                      </p>
                    </div>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(program.status)}`}>
                      {program.status === ProgramStatus.IN_ACTIVE ? "INACTIVE" : program.status || "DRAFT"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                      Budget: {program.budget ? 
                        new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: program.budget.currency || "INR",
                          maximumFractionDigits: 0,
                        }).format(program.budget.amount) : 
                        "Not specified"
                      }
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Click to manage cycles</span>
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">How it works</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Select a program to manage its funding cycles. You will be able to:</p>
                  <ul className="mt-1 list-disc list-inside">
                    <li>Create new funding cycles</li>
                    <li>Manage existing cycle details</li>
                    <li>Set TRL criteria and scoring schemes</li>
                    <li>Track cycle budgets and timelines</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PMLayout>
    </AuthGuard>
  );
}