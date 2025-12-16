'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ApplicantLayout from '@/components/layout/ApplicantLayout';
import { useApplicant } from '@/hooks/useApplicant';

export default function MyProjectsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { projects, isProjectsLoading, projectsError, getUserProjects } = useApplicant();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    await getUserProjects(currentPage, 10);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  return (
    <AuthGuard>
      <ApplicantLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              View your approved applications that have been converted to projects
            </p>
          </div>

          {/* Loading State */}
          {isProjectsLoading && (!projects || projects.length === 0) && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading projects...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {projectsError && !isProjectsLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{projectsError}</p>
            </div>
          )}

          {/* Projects List */}
          {!isProjectsLoading && !projectsError && projects && (
            <>
              {projects.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Projects Yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Once your applications are approved, they will appear here as projects
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/applicant/my-applications"
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      View My Applications
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {projects.map((application) => (
                    <div
                      key={application.id}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-shadow hover:shadow-md"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.basicInfo?.title || application.title || 'Untitled Project'}
                            </h3>
                            {application.basicInfo?.summary && (
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {application.basicInfo.summary}
                              </p>
                            )}
                          </div>
                          <span
                            className="ml-4 inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                          >
                            ACTIVE
                          </span>
                        </div>

                        <div className="mt-4 flex items-center space-x-6 text-xs text-gray-500">
                          <div className="flex items-center">
                            <svg
                              className="mr-1 h-4 w-4"
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
                            Created: {formatDate(application.createdAt)}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 space-x-2">
                          <Link
                            href={`/applicant/my-projects/${application.slug || application.id}`}
                            className="inline-flex items-center rounded-md bg-gray-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700"
                          >
                            View Details
                          </Link>
                          <Link
                            href={`/applicant/my-projects/${application.slug || application.id}/assessments`}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                          >
                            View Assessments
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
