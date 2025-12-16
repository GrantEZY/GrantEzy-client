'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ApplicantLayout from '@/components/layout/ApplicantLayout';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { useApplicant } from '@/hooks/useApplicant';

export default function ProjectAssessmentsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationSlug = params.applicationSlug as string;

  const { currentProject, getProjectDetails } = useApplicant();
  const { criterias, isCriteriasLoading, getApplicantCycleCriterias, clearCriterias } =
    useProjectManagement();

  const [cycleSlug, setCycleSlug] = useState<string | null>(null);

  useEffect(() => {
    if (applicationSlug) {
      loadProjectAndCriterias();
    }
    return () => {
      clearCriterias();
    };
  }, [applicationSlug]);

  const loadProjectAndCriterias = async () => {
    const project = await getProjectDetails(applicationSlug);
    if (project?.application?.cycle?.slug) {
      const slug = project.application.cycle.slug;
      setCycleSlug(slug);
      await getApplicantCycleCriterias({ cycleSlug: slug });
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
      <ApplicantLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <nav className="mb-4 flex text-sm text-gray-500">
              <Link href="/applicant/my-projects" className="hover:text-gray-700">
                My Projects
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Assessments</span>
            </nav>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Assessments</h1>
              <p className="mt-1 text-sm text-gray-500">
                Submit your project assessments based on evaluation criteria
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isCriteriasLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading assessment criteria...</p>
              </div>
            </div>
          )}

          {/* Criteria List */}
          {!isCriteriasLoading && (
            <div className="space-y-6">
              {/* Summary Stats */}
              {criterias.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Total Criteria</p>
                        <p className="text-2xl font-semibold text-gray-900">{criterias.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Submitted</p>
                        <p className="text-2xl font-semibold text-green-600">
                          {criterias.filter((c) => c.hasSubmitted).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <p className="text-2xl font-semibold text-yellow-600">
                          {criterias.filter((c) => !c.hasSubmitted).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* My Submissions Section */}
              {criterias.some((c) => c.hasSubmitted) && (
                <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    My Submissions
                  </h2>
                  <div className="space-y-3">
                    {criterias
                      .filter((c) => c.hasSubmitted)
                      .map((criteria) => (
                        <div
                          key={criteria.id}
                          className="flex items-center justify-between rounded-md border border-green-300 bg-white p-4"
                        >
                          <div className="flex items-center space-x-3">
                            <svg
                              className="h-5 w-5 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900">
                                {criteria.name}
                              </p>
                              {criteria.submittedAt && (
                                <p className="text-sm text-gray-500">
                                  Submitted on {formatDate(criteria.submittedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                          <Link
                            href={`/applicant/my-projects/${applicationSlug}/assessments/${criteria.slug}/submit?cycleSlug=${currentProject?.application?.cycle?.slug}`}
                            className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800"
                          >
                            View / Edit
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
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Criteria Cards */}
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No Assessment Criteria
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Assessment criteria haven't been created for this cycle yet
                    </p>
                  </div>
                ) : (
                  criterias.map((criteria) => {
                    const cycleSlug = currentProject?.application?.cycle?.slug;
                    
                    return (
                      <div
                        key={criteria.id}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">{criteria.name}</h3>
                                {criteria.hasSubmitted && (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Submitted
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 text-sm text-gray-600">{criteria.reviewBrief}</p>

                              {criteria.templateFile && (
                                <div className="mt-3 flex items-center text-sm text-gray-500">
                                  <svg
                                    className="mr-2 h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                    />
                                  </svg>
                                  <a
                                    href={criteria.templateFile.storageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                  >
                                    Download Template
                                  </a>
                                </div>
                              )}

                              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                <span>Created: {formatDate(criteria.createdAt)}</span>
                                {criteria.hasSubmitted && criteria.submittedAt && (
                                  <span className="text-green-600">
                                    Submitted: {formatDate(criteria.submittedAt)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link
                              href={`/applicant/my-projects/${applicationSlug}/assessments/${criteria.slug}/submit?cycleSlug=${cycleSlug}`}
                              className={`ml-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white ${
                                criteria.hasSubmitted
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {criteria.hasSubmitted ? (
                                <>
                                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                  </svg>
                                  Update Submission
                                </>
                              ) : (
                                <>
                                  Submit Assessment
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
                                </>
                              )}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
