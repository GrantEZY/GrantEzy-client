'use client';

import { useState, useEffect } from 'react';
import { useProjectAssessment } from '@/hooks/useProjectAssessment';
import InviteAssessmentReviewerModal from './InviteAssessmentReviewerModal';
import { ProjectReviewRecommendation } from '@/types/reviewer.types';

interface CriteriaSubmissionsViewProps {
  cycleSlug: string;
  criteriaSlug: string;
  criteriaName: string;
}

export function CriteriaSubmissionsView({
  cycleSlug,
  criteriaSlug,
  criteriaName,
}: CriteriaSubmissionsViewProps) {
  const { criteriaSubmissions, isLoadingSubmissions, getCycleCriteriaAssessments } =
    useProjectAssessment();

  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<{
    id: string;
    projectTitle: string;
  } | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  const loadAssessments = async (page: number) => {
    await getCycleCriteriaAssessments({
      cycleSlug,
      criteriaSlug,
      page,
      numberOfResults: 10,
    });
    setCurrentPage(page);
  };

  useEffect(() => {
    loadAssessments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleSlug, criteriaSlug]);

  const handleInviteReviewer = (assessmentId: string, projectTitle: string) => {
    setSelectedAssessment({ id: assessmentId, projectTitle });
    setIsInviteModalOpen(true);
  };

  const handleInviteSuccess = () => {
    // Optionally refresh the list or show a success notification
    loadAssessments(currentPage);
  };

  const getRecommendationBadge = (recommendation: ProjectReviewRecommendation) => {
    const badges = {
      [ProjectReviewRecommendation.PERFECT]: {
        class: 'bg-green-100 text-green-800',
        label: 'Perfect',
      },
      [ProjectReviewRecommendation.CAN_SPEED_UP]: {
        class: 'bg-blue-100 text-blue-800',
        label: 'Can Speed Up',
      },
      [ProjectReviewRecommendation.NO_IMPROVEMENT]: {
        class: 'bg-yellow-100 text-yellow-800',
        label: 'No Improvement',
      },
      [ProjectReviewRecommendation.NEED_SERIOUS_ACTION]: {
        class: 'bg-red-100 text-red-800',
        label: 'Need Serious Action',
      },
    };

    const badge = badges[recommendation];
    if (!badge) return null;

    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const toggleExpanded = (submissionId: string) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
  };

  if (isLoadingSubmissions) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-sm text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!criteriaSubmissions || criteriaSubmissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          className="h-12 w-12 text-gray-400"
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
        <h3 className="mt-4 text-lg font-medium text-gray-900">No submissions yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          No applicants have submitted assessments for &quot;{criteriaName}&quot; yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-lg font-semibold text-gray-900">
            Submissions for &quot;{criteriaName}&quot;
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            Total submissions: {criteriaSubmissions.length}
          </p>
        </div>
      </div>

      {/* Submissions List with Reviews */}
      <div className="space-y-4">
        {criteriaSubmissions.map((submission: any) => {
          const isExpanded = expandedSubmission === submission.id;
          const reviews = submission.reviews || [];
          const completedReviews = reviews.filter((r: any) => r.status === 'COMPLETED');

          return (
            <div
              key={submission.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              {/* Submission Header */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {submission.project?.application?.basicDetails?.title ||
                          submission.project?.title ||
                          submission.project?.name ||
                          'Untitled Project'}
                      </h4>
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                        Submitted
                      </span>
                    </div>

                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg
                          className="mr-1.5 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {submission.project?.application?.applicant?.person?.firstName &&
                        submission.project?.application?.applicant?.person?.lastName
                          ? `${submission.project.application.applicant.person.firstName} ${submission.project.application.applicant.person.lastName}`
                          : submission.project?.application?.applicant?.contact?.email ||
                            'No applicant info'}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="mr-1.5 h-4 w-4"
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
                        {new Date(
                          submission.updatedAt || submission.createdAt
                        ).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="mr-1.5 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-medium">
                          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                        </span>
                        {completedReviews.length > 0 && (
                          <span className="ml-1">({completedReviews.length} completed)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpanded(submission.id)}
                    className="ml-4 flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                    <svg
                      className={`ml-2 h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Submission Details */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">
                      Assessment Statement
                    </h5>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {submission.reviewBrief || 'No statement provided'}
                      </p>
                    </div>

                    {submission.reviewDocument?.storageUrl && (
                      <div className="mt-3">
                        <a
                          href={submission.reviewDocument.storageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          <svg
                            className="mr-1.5 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                          View Supporting Document ({submission.reviewDocument.fileName})
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Reviews Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-sm font-semibold text-gray-900">Reviews</h5>
                      <button
                        onClick={() =>
                          handleInviteReviewer(
                            submission.id,
                            submission.project?.application?.basicDetails?.title ||
                              submission.project?.title ||
                              'Project'
                          )
                        }
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <svg
                          className="mr-1.5 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Invite Reviewer
                      </button>
                    </div>

                    {reviews.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Invite a reviewer to evaluate this assessment.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {reviews.map((review: any) => (
                          <div
                            key={review.id}
                            className="border border-gray-200 rounded-lg p-4 bg-white"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {review.reviewer?.email ||
                                      (review.reviewer?.firstName && review.reviewer?.lastName
                                        ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
                                        : 'Anonymous Reviewer')}
                                  </p>
                                  <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                      review.status === 'COMPLETED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-orange-100 text-orange-800'
                                    }`}
                                  >
                                    {review.status}
                                  </span>
                                  {review.recommendation &&
                                    getRecommendationBadge(review.recommendation)}
                                </div>

                                {review.reviewAnalysis && review.status === 'COMPLETED' && (
                                  <div className="mt-3 bg-gray-50 rounded p-3">
                                    <p className="text-xs font-medium text-gray-700 mb-1">
                                      Analysis:
                                    </p>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                      {review.reviewAnalysis}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="text-xs text-gray-500 ml-4">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Invite Reviewer Modal */}
      {selectedAssessment && (
        <InviteAssessmentReviewerModal
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            setSelectedAssessment(null);
          }}
          onSuccess={handleInviteSuccess}
          assessmentId={selectedAssessment.id}
          projectTitle={selectedAssessment.projectTitle}
          criteriaName={criteriaName}
        />
      )}
    </div>
  );
}
