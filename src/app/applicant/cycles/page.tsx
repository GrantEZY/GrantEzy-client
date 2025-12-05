/**
 * Applicant Cycles Page - Shows all available cycles for applications
 * Allows applicants to browse and apply to open funding cycles
 */
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { AuthGuard } from "@/components/guards/AuthGuard";
import ApplicantLayout from "@/components/layout/ApplicantLayout";

import { ProgramCycle, publicService } from "@/services/public.service";

/**
 * Applicant Cycles Page - Shows all available cycles for applications
 * Allows applicants to browse and apply to open funding cycles
 */

export default function ApplicantCyclesPage() {
  const router = useRouter();
  const [cycles, setCycles] = useState<ProgramCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch active cycles from backend - try without isActive filter first
        console.log("Fetching cycles without isActive filter...");
        const response = await publicService.getActiveProgramCycles({
          page: 1,
          numberOfResults: 100, // Get all cycles
          // Temporarily removing isActive filter to see all cycles
        });

        console.log("Public API response:", response);

        if (response.res && response.res.programs) {
          console.log("Programs received:", response.res.programs);

          // Flatten all cycles from all programs
          const allCycles: ProgramCycle[] = [];
          response.res.programs.forEach((program) => {
            console.log("Processing program:", program);
            console.log("Program cycles:", program.cycles);
            console.log("Cycles is array?", Array.isArray(program.cycles));
            console.log("Cycles length:", program.cycles?.length || 0);

            if (
              program.cycles &&
              Array.isArray(program.cycles) &&
              program.cycles.length > 0
            ) {
              console.log("Found cycles, processing each one...");
              program.cycles.forEach((cycle, index) => {
                console.log(`Processing cycle ${index}:`, cycle);
                allCycles.push({
                  ...cycle,
                  program: {
                    id: program.id,
                    name: program.details?.name || "Unnamed Program",
                    description: program.details?.description || "",
                  },
                });
              });
            } else {
              console.log("No cycles found for this program");
            }
          });

          console.log("Total cycles collected:", allCycles.length);

          console.log("All cycles processed:", allCycles);
          console.log(
            "Cycle statuses found:",
            allCycles.map((c) => ({
              id: c.id,
              status: c.status,
              slug: c.slug,
            })),
          );

          // Check for missing slugs
          const cyclesWithoutSlugs = allCycles.filter((c) => !c.slug);
          if (cyclesWithoutSlugs.length > 0) {
            console.warn("Cycles without slugs found:", cyclesWithoutSlugs);
          }
          setCycles(allCycles);
        } else {
          console.log("No programs in response or invalid response structure");
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

  // Filter cycles based on search and status
  const filteredCycles = cycles.filter((cycle) => {
    const matchesSearch =
      (cycle.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (cycle.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (cycle.program?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );

    const matchesStatus =
      statusFilter === "all" || cycle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "CLOSED":
      case "INACTIVE":
      case "COMPLETED":
        return "bg-red-100 text-red-800 border-red-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "OPEN":
      case "ACTIVE":
        return "Open for Applications";
      case "CLOSED":
      case "INACTIVE":
      case "COMPLETED":
        return "Applications Closed";
      case "DRAFT":
        return "Draft - Coming Soon";
      default:
        return "Coming Soon";
    }
  };

  // Normalize status for applicant logic (treat ACTIVE as OPEN)
  const isActiveStatus = (status: string) => {
    return status === "OPEN" || status === "ACTIVE";
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <ApplicantLayout>
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">
              Loading available funding cycles...
            </p>
          </div>
        </ApplicantLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <ApplicantLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Available Funding Cycles
              </h1>
              <p className="mt-2 text-gray-600">
                Browse and apply to open innovation funding opportunities
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Search cycles, programs, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 leading-5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
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
          )}

          {/* Cycles Grid */}
          {filteredCycles.length === 0 && !error ? (
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || statusFilter !== "all"
                  ? "No cycles found"
                  : "No Funding Cycles Available"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters"
                  : "There are currently no funding cycles available. Check back later for new opportunities."}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCycles.map((cycle) => {
                const isActive = isActiveStatus(cycle.status);
                const startDate = cycle.duration?.startDate || cycle.startDate;
                const endDate = cycle.duration?.endDate || cycle.endDate;

                return (
                  <div
                    key={cycle.id}
                    className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          {cycle.program && (
                            <p className="mb-1 text-sm font-medium text-blue-600">
                              {cycle.program.name}
                            </p>
                          )}
                          <h3 className="mb-2 text-lg font-semibold text-gray-900">
                            {cycle.title || "Innovation Funding Cycle"}
                          </h3>
                        </div>
                        <span
                          className={`ml-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(cycle.status)}`}
                        >
                          {getStatusText(cycle.status)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                        {cycle.description ||
                          cycle.program?.description ||
                          "Apply for innovation funding to accelerate your startup journey."}
                      </p>

                      {/* Details */}
                      <div className="mb-6 space-y-3">
                        {(startDate || endDate) && (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg
                              className="mr-2 h-4 w-4"
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
                            <span>
                              {startDate ? formatDate(startDate) : "TBD"} -{" "}
                              {endDate ? formatDate(endDate) : "TBD"}
                            </span>
                          </div>
                        )}

                        {cycle.budget && (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg
                              className="mr-2 h-4 w-4"
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
                            <span>
                              Funding: {cycle.budget.currency}{" "}
                              {cycle.budget.amount.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {cycle.round && (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg
                              className="mr-2 h-4 w-4"
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
                            <span>
                              Round: {cycle.round.year} - {cycle.round.type}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Apply Button */}
                      <button
                        onClick={() => handleApplyToCycle(cycle.slug)}
                        disabled={!isActive}
                        className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                          isActive
                            ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            : "cursor-not-allowed bg-gray-300"
                        }`}
                      >
                        {isActive ? "Apply Now" : "Applications Closed"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Statistics */}
          {filteredCycles.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                <div>
                  <div className="text-2xl font-bold text-blue-900">
                    {filteredCycles.length}
                  </div>
                  <div className="text-sm text-blue-700">Available Cycles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">
                    {filteredCycles.filter((c) => c.status === "OPEN").length}
                  </div>
                  <div className="text-sm text-blue-700">
                    Open for Applications
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">
                    {new Set(filteredCycles.map((c) => c.program?.id)).size}
                  </div>
                  <div className="text-sm text-blue-700">Active Programs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
