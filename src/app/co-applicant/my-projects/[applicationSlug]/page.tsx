'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import CoApplicantLayout from '@/components/layout/CoApplicantLayout';
import { useCoApplicant } from '@/hooks/useCoApplicant';

export default function CoApplicantProjectDetailsPage() {
  const params = useParams();
  const applicationSlug = params.applicationSlug as string;

  const { currentProject, isLoading, getProjectDetails } = useCoApplicant();

  useEffect(() => {
    loadProjectDetails();
  }, [applicationSlug]);

  const loadProjectDetails = async () => {
    await getProjectDetails(applicationSlug);
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
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AuthGuard>
      <CoApplicantLayout>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex text-sm text-gray-500">
            <Link href="/co-applicant/my-projects" className="hover:text-gray-700">
              My Linked Projects
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Project Details</span>
          </nav>

          {/* Loading State */}
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading project details...</p>
              </div>
            </div>
          )}

          {/* Project Content */}
          {!isLoading && currentProject && (
            <div className="space-y-6">
              {/* Header */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentProject.title || 'Project Details'}
                    </h1>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(currentProject.status)}`}
                    >
                      {currentProject.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {currentProject.basicInfo && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Problem Statement</h3>
                      <p className="mt-2 text-sm text-gray-700">{currentProject.basicInfo.problem}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Details */}
              {currentProject.project && (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Project Information</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Allocated Budget */}
                      {currentProject.project.allocatedBudget && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Allocated Budget</p>
                          <p className="mt-1 text-2xl font-semibold text-gray-900">
                            ${currentProject.project.allocatedBudget.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Planned Duration */}
                      {currentProject.project.plannedDuration && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Planned Duration</p>
                          <p className="mt-1 text-2xl font-semibold text-gray-900">
                            {currentProject.project.plannedDuration} months
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Additional Project Info */}
                    <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                      {currentProject.createdAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Application Created:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(currentProject.createdAt)}
                          </span>
                        </div>
                      )}
                      {currentProject.updatedAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Last Updated:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(currentProject.updatedAt)}
                          </span>
                        </div>
                      )}
                      {currentProject.project.createdAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Project Started:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(currentProject.project.createdAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Applicant Information */}
              {currentProject.basicInfo && (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Project Information</h3>
                  </div>
                  <div className="p-6">
                    {currentProject.basicInfo.name && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Project Name</h4>
                        <p className="mt-1 text-sm text-gray-700">{currentProject.basicInfo.name}</p>
                      </div>
                    )}
                    {currentProject.basicInfo.solution && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900">Solution</h4>
                        <p className="mt-1 text-sm text-gray-700">{currentProject.basicInfo.solution}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Co-Applicant Notice */}
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Co-Applicant Access</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      You are viewing this project as a co-applicant. For assessment submissions and
                      modifications, please contact the primary applicant.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="flex justify-start">
                <Link
                  href="/co-applicant/my-projects"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 19l-7-7 7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  Back to My Linked Projects
                </Link>
              </div>
            </div>
          )}
        </div>
      </CoApplicantLayout>
    </AuthGuard>
  );
}
