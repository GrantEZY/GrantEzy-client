'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ApplicantLayout from '@/components/layout/ApplicantLayout';
import { useApplicant } from '@/hooks/useApplicant';

export default function ApplicantProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationSlug = params.applicationSlug as string;

  const { currentProject, isLoading, getProjectDetails } = useApplicant();

  useEffect(() => {
    if (applicationSlug) {
      getProjectDetails(applicationSlug);
    }
  }, [applicationSlug]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (money: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: money?.currency || 'INR',
      maximumFractionDigits: 0,
    }).format(money?.amount || 0);
  };

  const calculateDuration = (duration: { startDate: string; endDate: string }) => {
    if (!duration?.startDate || !duration?.endDate) return 'N/A';
    const start = new Date(duration.startDate);
    const end = new Date(duration.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <AuthGuard>
      <ApplicantLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <nav className="mb-4 flex text-sm text-gray-500">
              <Link href="/applicant/my-projects" className="hover:text-gray-700">
                My Projects
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Project Details</span>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
                <p className="mt-1 text-sm text-gray-500">
                  View your approved project information and budget allocation
                </p>
              </div>
              <Link
                href={`/applicant/my-projects/${applicationSlug}/assessments`}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                View Assessments
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading project details...</p>
              </div>
            </div>
          )}

          {/* Project Details */}
          {!isLoading && currentProject && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Title</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentProject.application?.basicDetails?.projectTitle || 'Untitled Project'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            currentProject.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : currentProject.status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-800'
                                : currentProject.status === 'ON_HOLD'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {currentProject.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Program</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentProject.application?.cycle?.program?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cycle</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentProject.application?.cycle?.slug || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {calculateDuration(currentProject.duration)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Created Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(currentProject.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Information */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Budget Allocation</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-6">
                    {/* ManPower */}
                    {currentProject.allotedBudget?.ManPower && currentProject.allotedBudget.ManPower.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">ManPower</h3>
                        <div className="mt-2 space-y-2">
                          {currentProject.allotedBudget.ManPower.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.BudgetReason}</span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(item.Budget)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Equipment */}
                    {currentProject.allotedBudget?.Equipment && currentProject.allotedBudget.Equipment.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Equipment</h3>
                        <div className="mt-2 space-y-2">
                          {currentProject.allotedBudget.Equipment.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.BudgetReason}</span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(item.Budget)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* OtherCosts */}
                    {currentProject.allotedBudget?.OtherCosts && currentProject.allotedBudget.OtherCosts.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Other Costs</h3>
                        <div className="mt-2 space-y-2">
                          {currentProject.allotedBudget.OtherCosts.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.BudgetReason}</span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(item.Budget)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fixed Items */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {currentProject.allotedBudget?.Consumables && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Consumables</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(currentProject.allotedBudget.Consumables.Budget)}
                            </span>
                          </div>
                        )}
                        {currentProject.allotedBudget?.Travel && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Travel</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(currentProject.allotedBudget.Travel.Budget)}
                            </span>
                          </div>
                        )}
                        {currentProject.allotedBudget?.Contigency && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Contingency</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(currentProject.allotedBudget.Contigency.Budget)}
                            </span>
                          </div>
                        )}
                        {currentProject.allotedBudget?.Overhead && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Overhead</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(currentProject.allotedBudget.Overhead.Budget)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              {currentProject.application?.basicDetails?.projectOverview && (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {currentProject.application.basicDetails.projectOverview}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Project Found */}
          {!isLoading && !currentProject && (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Project Not Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                This project could not be found or you don't have access to it.
              </p>
              <div className="mt-6">
                <Link
                  href="/applicant/my-projects"
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Back to My Projects
                </Link>
              </div>
            </div>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
