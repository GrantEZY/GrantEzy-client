/**
 * Applicant Dashboard - Landing page for applicants
 * Shows available cycles and application status
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/guards/AuthGuard";
import ApplicantLayout from "@/components/layout/ApplicantLayout";
import { useAuth } from "@/hooks/useAuth";
import { publicService, ProgramCycle } from "@/services/public.service";

export default function ApplicantDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [cycles, setCycles] = useState<ProgramCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        // Fetch active cycles from backend
        const response = await publicService.getActiveProgramCycles({
          page: 1,
          numberOfResults: 100, // Get all cycles
        });

        if (response.res && response.res.programs) {
          // Flatten all cycles from all programs
          const allCycles: ProgramCycle[] = [];
          response.res.programs.forEach((program) => {
            
            if (program.cycles && Array.isArray(program.cycles) && program.cycles.length > 0) {
              program.cycles.forEach((cycle) => {
                allCycles.push({
                  ...cycle,
                  program: {
                    id: program.id,
                    name: program.details?.name || "Unnamed Program",
                    description: program.details?.description || "",
                  },
                });
              });
            }
          });
          
          setCycles(allCycles);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cycles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCycles();
  }, []);

  const handleApplyToCycle = (cycleSlug: string) => {
    router.push(`/applicant/new-application?cycleSlug=${cycleSlug}`);
  };

  return (
    <AuthGuard>
      <ApplicantLayout>
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName || "Applicant"}
          </h1>
          <p className="mt-2 text-gray-600">
            Apply for grants and track your applications
          </p>
        </div>
          {/* Available Cycles */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Available Grant Cycles
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Loading cycles...</p>
              </div>
            ) : error ? (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-red-900">
                  Error Loading Cycles
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            ) : cycles.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No Open Cycles
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are currently no grant cycles open for applications.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cycles.map((cycle) => {
                  // Check if cycle is open based on status field
                  const isActive = cycle.status === 'OPEN';
                  const cycleStatus = cycle.status || "UNKNOWN";
                  
                  // Safely get dates
                  const startDate = cycle.duration?.startDate || cycle.startDate;
                  const endDate = cycle.duration?.endDate || cycle.endDate;
                  
                  return (
                    <div
                      key={cycle.id}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {cycle.program && (
                            <p className="text-xs font-medium text-blue-600 mb-1">
                              {cycle.program.name}
                            </p>
                          )}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {cycle.title}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600">
                            {cycle.description}
                          </p>
                        </div>
                        <span
                          className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {cycleStatus}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <svg
                          className="mr-1.5 h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {startDate ? new Date(startDate).toLocaleDateString() : "N/A"} -{" "}
                          {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
                        </span>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => handleApplyToCycle(cycle.slug)}
                          disabled={!isActive}
                          className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white ${
                            isActive
                              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                        >
                          {isActive ? "Apply Now" : "Closed"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Applications Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              My Applications
            </h2>
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No Applications Yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't submitted any applications yet. Apply to an open cycle to get started.
              </p>
            </div>
          </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
