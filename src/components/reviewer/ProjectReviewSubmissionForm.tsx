'use client';

import { useState } from 'react';
import { useReviewer } from '@/hooks/useReviewer';
import { ProjectReviewRecommendation } from '@/types/reviewer.types';

interface ProjectReviewSubmissionFormProps {
  assessmentId: string;
  assessmentDetails: {
    criteria?: {
      name: string;
      briefReview: string;
      templateFile?: {
        fileName: string;
        storageUrl: string;
      };
    };
    project?: {
      application?: {
        basicDetails?: {
          title: string;
        };
      };
    };
    reviewBrief?: string;
    reviewDocument?: {
      fileName: string;
      storageUrl: string;
    };
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectReviewSubmissionForm({
  assessmentId,
  assessmentDetails,
  onSuccess,
  onCancel,
}: ProjectReviewSubmissionFormProps) {
  const { submitProjectAssessmentReview, isLoadingProjectReviews } = useReviewer();

  const [recommendation, setRecommendation] = useState<ProjectReviewRecommendation | ''>('');
  const [reviewAnalysis, setReviewAnalysis] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recommendations = [
    {
      value: ProjectReviewRecommendation.PERFECT,
      label: 'Perfect',
      description: 'Excellent work, meets all criteria perfectly',
      color: 'bg-green-100 text-green-800 border-green-300',
    },
    {
      value: ProjectReviewRecommendation.CAN_SPEED_UP,
      label: 'Can Speed Up',
      description: 'Good work, can be improved with faster execution',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      value: ProjectReviewRecommendation.NO_IMPROVEMENT,
      label: 'No Improvement',
      description: 'Minimal progress, needs attention',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    {
      value: ProjectReviewRecommendation.NEED_SERIOUS_ACTION,
      label: 'Need Serious Action',
      description: 'Significant issues, immediate intervention required',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!recommendation) {
      newErrors.recommendation = 'Please select a recommendation';
    }

    if (!reviewAnalysis.trim()) {
      newErrors.reviewAnalysis = 'Review analysis is required';
    } else if (reviewAnalysis.trim().length < 50) {
      newErrors.reviewAnalysis = 'Review analysis must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const response = await submitProjectAssessmentReview({
      assessmentId,
      recommendation: recommendation as ProjectReviewRecommendation,
      reviewAnalysis,
    });

    setIsSubmitting(false);

    if (response) {
      onSuccess?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Assessment Details */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="font-medium text-gray-900">Assessment Details</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Project:</span>{' '}
            <span className="text-gray-600">
              {assessmentDetails.project?.application?.basicDetails?.title || 'Untitled'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Criteria:</span>{' '}
            <span className="text-gray-600">{assessmentDetails.criteria?.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Description:</span>{' '}
            <span className="text-gray-600">{assessmentDetails.criteria?.briefReview}</span>
          </div>
        </div>
      </div>

      {/* Applicant Submission */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="font-medium text-blue-900">Applicant's Submission</h4>
        {assessmentDetails.criteria?.templateFile && (
          <a
            href={assessmentDetails.criteria.templateFile.storageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            View Criteria Template
          </a>
        )}
        <div className="mt-3 rounded-md bg-white p-3">
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            {assessmentDetails.reviewBrief || 'No statement provided'}
          </p>
        </div>
        {assessmentDetails.reviewDocument && (
          <a
            href={assessmentDetails.reviewDocument.storageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {assessmentDetails.reviewDocument.fileName}
          </a>
        )}
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recommendation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Recommendation <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recommendations.map((rec) => (
              <button
                key={rec.value}
                type="button"
                onClick={() => setRecommendation(rec.value)}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  recommendation === rec.value
                    ? rec.color + ' border-current shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 ${
                      recommendation === rec.value ? 'border-current bg-current' : 'border-gray-300'
                    }`}
                  >
                    {recommendation === rec.value && (
                      <svg
                        className="h-full w-full text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{rec.label}</div>
                    <div className="mt-1 text-xs opacity-75">{rec.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.recommendation && (
            <p className="mt-1 text-sm text-red-600">{errors.recommendation}</p>
          )}
        </div>

        {/* Review Analysis */}
        <div>
          <label htmlFor="reviewAnalysis" className="block text-sm font-medium text-gray-700">
            Review Analysis <span className="text-red-500">*</span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Provide detailed feedback on the applicant's assessment (minimum 50 characters)
          </p>
          <textarea
            id="reviewAnalysis"
            rows={8}
            value={reviewAnalysis}
            onChange={(e) => setReviewAnalysis(e.target.value)}
            className={`mt-2 block w-full rounded-md border ${
              errors.reviewAnalysis ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            placeholder="Explain your recommendation and provide constructive feedback..."
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.reviewAnalysis ? (
              <p className="text-sm text-red-600">{errors.reviewAnalysis}</p>
            ) : (
              <p className="text-xs text-gray-500">{reviewAnalysis.length} characters</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isLoadingProjectReviews}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting || isLoadingProjectReviews ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
