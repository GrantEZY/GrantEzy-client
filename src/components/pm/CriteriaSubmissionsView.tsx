'use client';

import { useState, useEffect } from 'react';
import { useProjectAssessment } from '@/hooks/useProjectAssessment';

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
  const {
    criteriaSubmissions,
    isLoadingSubmissions,
    getCycleCriteriaAssessments,
  } = useProjectAssessment();

  const [currentPage, setCurrentPage] = useState(1);

  const loadAssessments = async (page: number) => {
    console.log('📊 Loading assessments for:', {
      cycleSlug,
      criteriaSlug,
      page,
      numberOfResults: 10,
    });
    
    await getCycleCriteriaAssessments({
      cycleSlug,
      criteriaSlug,
      page,
      numberOfResults: 10,
    });
    setCurrentPage(page);
  };

  useEffect(() => {
    console.log('🔄 CriteriaSubmissionsView mounted with:', {
      cycleSlug,
      criteriaSlug,
      criteriaName,
    });
    loadAssessments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleSlug, criteriaSlug]);

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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Applicant
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Project
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Statement
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Document
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Submitted At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {criteriaSubmissions.map((submission: any) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                  <div className="font-medium text-gray-900">
                    {submission.project?.application?.applicant?.name || 'Unknown'}
                  </div>
                  <div className="text-gray-500">
                    {submission.project?.application?.applicant?.email || 'N/A'}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {submission.project?.title || submission.project?.name || 'N/A'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                    Submitted
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">
                  <div className="truncate">{submission.reviewBrief || 'No statement'}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  {submission.reviewFile?.storageUrl ? (
                    <a
                      href={submission.reviewFile.storageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="text-gray-400">No document</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {submission.submittedAt || submission.createdAt
                    ? new Date(submission.submittedAt || submission.createdAt).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
