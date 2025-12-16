'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import PMLayout from '@/components/layout/PMLayout';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { usePm } from '@/hooks/usePm';

export default function AssessmentsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = params.cycleSlug as string;

  const { currentCycle, getCycleDetails } = usePm();
  const { criterias, isCriteriasLoading, getCycleCriterias } = useProjectManagement();

  useEffect(() => {
    if (cycleSlug) {
      getCycleDetails({ cycleSlug });
      getCycleCriterias({ cycleSlug });
    }
  }, [cycleSlug]);

  return (
    <AuthGuard allowedRoles={['PROGRAM_MANAGER']}>
      <PMLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <nav className="mb-4 flex text-sm text-gray-500">
              <Link href="/pm" className="hover:text-gray-700">
                Dashboard
              </Link>
              <span className="mx-2">/</span>
              <Link href={`/pm/cycles/${cycleSlug}`} className="hover:text-gray-700">
                Cycle Details
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Assessment Criteria</span>
            </nav>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assessment Criteria Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                View submissions and manage reviews for each assessment criteria
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isCriteriasLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading criteria...</p>
              </div>
            </div>
          )}

          {/* Criteria List */}
          {!isCriteriasLoading && (
            <div className="space-y-4">
              {criterias.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Criteria Found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create assessment criteria from the cycle details page
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/pm/cycles/${cycleSlug}`}
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Go to Cycle Details
                    </Link>
                  </div>
                </div>
              ) : (
                criterias.map((criteria) => (
                  <div
                    key={criteria.id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{criteria.name}</h3>
                          <p className="mt-1 text-sm text-gray-600">{criteria.reviewBrief}</p>
                          {criteria.templateFile && (
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <svg
                                className="mr-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                              <a
                                href={criteria.templateFile.storageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate hover:text-blue-600"
                              >
                                {criteria.templateFile.title}
                              </a>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/pm/cycles/${cycleSlug}/assessments/${criteria.slug}`}
                          className="ml-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          View Submissions
                          <svg
                            className="ml-2 h-4 w-4"
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
                        </Link>
                      </div>
                      <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          Created: {new Date(criteria.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
