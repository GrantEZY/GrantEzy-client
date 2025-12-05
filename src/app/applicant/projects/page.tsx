"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import ApplicantLayout from "@/components/layout/ApplicantLayout";
import { applicantService } from "@/services/applicant.service";
import { Project } from "@/types/project.types";

export default function ApplicantProjectsPage() {
  // const router = useRouter(); // Uncomment if navigation is needed
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    loadProjects();
  }, [currentPage]);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await applicantService.getUserProjects(currentPage, resultsPerPage);

      if (response.status === 200 && response.res) {
        setProjects(response.res.projects);
        setTotalPages(response.res.pagination?.totalPages || 1);
      } else {
        throw new Error(response.message || "Failed to load projects");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateBudgetTotal = (budget: any) => {
    if (!budget) return 0;

    let total = 0;

    if (budget.ManPower && Array.isArray(budget.ManPower)) {
      total += budget.ManPower.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0
      );
    }
    if (budget.Equipment && Array.isArray(budget.Equipment)) {
      total += budget.Equipment.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0
      );
    }
    if (budget.OtherCosts && Array.isArray(budget.OtherCosts)) {
      total += budget.OtherCosts.reduce(
        (sum: number, item: any) => sum + (item.Budget?.amount || 0),
        0
      );
    }

    total += budget.Consumables?.Budget?.amount || 0;
    total += budget.Travel?.Budget?.amount || 0;
    total += budget.Contigency?.Budget?.amount || 0;
    total += budget.Overhead?.Budget?.amount || 0;

    return total;
  };

  return (
    <AuthGuard>
      <ApplicantLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="mt-2 text-gray-600">
              View and manage all projects created from your approved applications
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading projects...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex">
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
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading projects</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Projects List */}
          {!isLoading && !error && (
            <>
              {projects.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Projects Yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Projects will appear here once your applications are approved and converted to
                    projects by the program manager.
                  </p>
                  <div className="mt-6">
                    <Link
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      href="/applicant/applications"
                    >
                      View My Applications
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      All Projects ({projects.length})
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Project Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Budget
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {projects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {project.application?.basicInfo?.title ||
                                  project.application?.title ||
                                  "Untitled Project"}
                              </div>
                              <div className="mt-1 text-sm text-gray-500">
                                ID: {project.id.substring(0, 8)}...
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(project.status)}`}
                              >
                                {project.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              INR {calculateBudgetTotal(project.allocatedBudget).toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {project.plannedDuration?.startDate && project.plannedDuration?.endDate
                                ? `${new Date(project.plannedDuration.startDate).toLocaleDateString()} - ${new Date(project.plannedDuration.endDate).toLocaleDateString()}`
                                : "Not set"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                              <Link
                                className="text-blue-600 hover:text-blue-700"
                                href={`/applicant/projects/${project.application?.slug || project.slug}`}
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          type="button"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          type="button"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
