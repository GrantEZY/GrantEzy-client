'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import CoApplicantLayout from '@/components/layout/CoApplicantLayout';
import { useCoApplicant } from '@/hooks/useCoApplicant';

export default function CoApplicantProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { linkedProjects, isLoading, getUserLinkedProjects } = useCoApplicant();

  useEffect(() => {
    loadProjects();
  }, [currentPage]);

  const loadProjects = async () => {
    await getUserLinkedProjects(currentPage, 10);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AuthGuard>
      <CoApplicantLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Linked Projects</h1>
            <p className="mt-2 text-sm text-gray-600">
              Projects where you are listed as a co-applicant
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading your linked projects...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && linkedProjects.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No linked projects</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't been added as a co-applicant to any projects yet.
              </p>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && linkedProjects.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {linkedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/co-applicant/my-projects/${project.slug}`}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {project.title || 'Untitled Project'}
                    </h3>

                    {/* Project ID */}
                    {project.projectId && (
                      <div className="mb-4 rounded-md bg-blue-50 p-3">
                        <p className="text-xs text-blue-900">Project ID</p>
                        <p className="text-sm font-medium text-blue-800">
                          {project.projectId.substring(0, 8)}...
                        </p>
                      </div>
                    )}

                    {/* Project Details */}
                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      {project.project?.allocatedBudget && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Budget:</span>
                          <span className="font-medium text-gray-900">
                            ${project.project.allocatedBudget.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {project.createdAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Created:</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(project.createdAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* View Link */}
                    <div className="mt-4 flex items-center justify-end text-sm font-medium text-blue-600">
                      View Details
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && linkedProjects.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={linkedProjects.length < 10}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </CoApplicantLayout>
    </AuthGuard>
  );
}
