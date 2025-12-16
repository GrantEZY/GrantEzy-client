'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import PMLayout from '@/components/layout/PMLayout';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { usePm } from '@/hooks/usePm';
import InviteProjectReviewerModal from '@/components/pm/InviteProjectReviewerModal';

export default function CriteriaSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = params.cycleSlug as string;
  const criteriaSlug = params.criteriaSlug as string;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { currentCycle, getCycleDetails } = usePm();
  const {
    assessments,
    currentAssessment,
    isAssessmentsLoading,
    getCycleCriteriaAssessments,
    clearAssessments,
  } = useProjectManagement();

  useEffect(() => {
    if (cycleSlug) {
      getCycleDetails({ cycleSlug });
    }
  }, [cycleSlug]);

  useEffect(() => {
    if (cycleSlug && criteriaSlug) {
      loadAssessments(1);
    }
    return () => {
      clearAssessments();
    };
  }, [cycleSlug, criteriaSlug]);

  const loadAssessments = async (page: number) => {
    await getCycleCriteriaAssessments({
      cycleSlug,
      criteriaSlug,
      page,
      numberOfResults: 20,
    });
    setCurrentPage(page);
  };

  const handleInviteReviewer = (assessmentId: string) => {
    setSelectedAssessmentId(assessmentId);
    setIsInviteModalOpen(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
              <Link href={`/pm/cycles/${cycleSlug}/assessments`} className="hover:text-gray-700">
                Assessments
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Submissions</span>
            </nav>

            {currentAssessment && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentAssessment.criteria?.name || 'Assessment Submissions'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {currentAssessment.criteria?.reviewBrief}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isAssessmentsLoading && assessments.length === 0 && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading submissions...</p>
              </div>
            </div>
          )}

          {/* Submissions List */}
          {!isAssessmentsLoading && (
            <div className="space-y-4">
              {assessments.length === 0 ? (
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Submissions Yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Project teams haven't submitted their assessments yet
                  </p>
                </div>
              ) : (
                assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {assessment.project?.application?.basicInfo?.title ||
                                'Project Assessment'}
                            </h3>
                            {assessment.reviews && assessment.reviews.length > 0 && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                {assessment.reviews.length}{' '}
                                {assessment.reviews.length === 1 ? 'Review' : 'Reviews'}
                              </span>
                            )}
                          </div>
                          
                          {assessment.reviewBrief && (
                            <p className="mt-2 text-sm text-gray-600">{assessment.reviewBrief}</p>
                          )}

                          {assessment.reviewDocument && (
                            <div className="mt-3 flex items-center text-sm text-gray-500">
                              <svg
                                className="mr-2 h-5 w-5"
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
                              <a
                                href={assessment.reviewDocument.storageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate font-medium text-blue-600 hover:text-blue-500"
                              >
                                {assessment.reviewDocument.title}
                              </a>
                              <span className="ml-2 text-xs">
                                ({assessment.reviewDocument.fileSize})
                              </span>
                            </div>
                          )}

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
                              Submitted: {formatDate(assessment.createdAt)}
                            </div>
                            {assessment.updatedAt !== assessment.createdAt && (
                              <div className="flex items-center">
                                <svg
                                  className="mr-1 h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                  />
                                </svg>
                                Updated: {formatDate(assessment.updatedAt)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          <button
                            onClick={() => handleInviteReviewer(assessment.id)}
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 4v16m8-8H4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                            Invite Reviewer
                          </button>
                        </div>
                      </div>

                      {/* Reviews List */}
                      {assessment.reviews && assessment.reviews.length > 0 && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-medium text-gray-700">Reviews</h4>
                          <div className="mt-2 space-y-2">
                            {assessment.reviews.map((review: any) => (
                              <div
                                key={review.id}
                                className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-2"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                    <svg
                                      className="h-4 w-4 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {review.reviewer?.firstName} {review.reviewer?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">{review.reviewer?.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {review.recommendation && (
                                    <span
                                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                        review.recommendation === 'PERFECT'
                                          ? 'bg-green-100 text-green-800'
                                          : review.recommendation === 'GOOD'
                                            ? 'bg-blue-100 text-blue-800'
                                            : review.recommendation === 'NEEDS_IMPROVEMENT'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {review.recommendation}
                                    </span>
                                  )}
                                  <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                      review.status === 'COMPLETED'
                                        ? 'bg-green-100 text-green-800'
                                        : review.status === 'IN_PROGRESS'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {review.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Invite Reviewer Modal */}
        {isInviteModalOpen && selectedAssessmentId && (
          <InviteProjectReviewerModal
            isOpen={isInviteModalOpen}
            onClose={() => {
              setIsInviteModalOpen(false);
              setSelectedAssessmentId(null);
            }}
            onSuccess={() => {
              setIsInviteModalOpen(false);
              setSelectedAssessmentId(null);
              loadAssessments(currentPage);
            }}
            assessmentId={selectedAssessmentId}
            criteriaName={currentAssessment?.criteria?.name}
          />
        )}
      </PMLayout>
    </AuthGuard>
  );
}
