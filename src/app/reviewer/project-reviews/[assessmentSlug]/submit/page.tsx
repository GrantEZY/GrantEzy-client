'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ReviewerLayout from '@/components/layout/ReviewerLayout';
import { useReviewer } from '@/hooks/useReviewer';
import { ProjectReviewRecommendation } from '@/types/project.types';
import { useToast } from '@/components/ui/Toast';

export default function SubmitReviewPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentSlug = params.assessmentSlug as string;

  const [recommendation, setRecommendation] = useState<ProjectReviewRecommendation>(ProjectReviewRecommendation.GOOD);
  const [reviewAnalysis, setReviewAnalysis] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const { showToast } = useToast();
  const { currentProjectReview, isLoadingProjectReviews, getProjectReviewDetails, submitProjectReview } =
    useReviewer();

  useEffect(() => {
    loadReviewDetails();
  }, [assessmentSlug]);

  const loadReviewDetails = async () => {
    await getProjectReviewDetails({ assessmentSlug });
  };

  useEffect(() => {
    if (currentProjectReview?.review) {
      // Pre-fill form if review already started
      if (currentProjectReview.review.recommendation) {
        setRecommendation(currentProjectReview.review.recommendation);
      }
      if (currentProjectReview.review.reviewAnalysis) {
        setReviewAnalysis(currentProjectReview.review.reviewAnalysis);
        setIsUpdate(true);
      }
    }
  }, [currentProjectReview]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!reviewAnalysis.trim()) {
      newErrors.reviewAnalysis = 'Review analysis is required';
    } else if (reviewAnalysis.trim().length < 100) {
      newErrors.reviewAnalysis = 'Please provide at least 100 characters of analysis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !currentProjectReview?.assessment) {
      return;
    }

    setIsSubmitting(true);

    const success = await submitProjectReview({
      assessmentId: currentProjectReview.assessment.id,
      recommendation,
      reviewAnalysis,
    });

    setIsSubmitting(false);

    if (success) {
      showToast({
        type: 'success',
        message: `Review ${isUpdate ? 'updated' : 'submitted'} successfully!`,
        duration: 3000,
      });
      setTimeout(() => {
        router.push('/reviewer/project-reviews');
      }, 1500);
    }
  };

  const getRecommendationDescription = (rec: ProjectReviewRecommendation) => {
    switch (rec) {
      case 'PERFECT':
        return 'Exceptional work that exceeds all expectations';
      case 'GOOD':
        return 'Meets all requirements with good quality';
      case 'NEEDS_IMPROVEMENT':
        return 'Meets basic requirements but needs refinement';
      case 'POOR':
        return 'Does not meet requirements, significant issues';
      default:
        return '';
    }
  };

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex text-sm text-gray-500">
            <Link href="/reviewer/project-reviews" className="hover:text-gray-700">
              My Reviews
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/reviewer/project-reviews/${assessmentSlug}`}
              className="hover:text-gray-700"
            >
              Review Details
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Submit Review</span>
          </nav>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isUpdate ? 'Update' : 'Submit'} Project Review
            </h1>
            {currentProjectReview?.assessment?.project && (
              <p className="mt-1 text-sm text-gray-500">
                {currentProjectReview.assessment.project.title}
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoadingProjectReviews && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}

          {/* Form */}
          {!isLoadingProjectReviews && currentProjectReview && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Assessment Context */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">Assessment Context</h3>
                </div>
                <div className="p-6">
                  {/* Criteria */}
                  {currentProjectReview.assessment.criteria && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Criteria</h4>
                      <p className="mt-1 text-sm text-gray-700">
                        {currentProjectReview.assessment.criteria.name}
                      </p>
                      {currentProjectReview.assessment.criteria.reviewBrief && (
                        <p className="mt-2 text-sm text-gray-600">
                          {currentProjectReview.assessment.criteria.reviewBrief}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Applicant's Statement */}
                  {currentProjectReview.assessment.reviewBrief && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Applicant's Statement</h4>
                      <div className="mt-2 max-h-40 overflow-y-auto rounded-md bg-gray-50 p-3">
                        <p className="whitespace-pre-wrap text-sm text-gray-700">
                          {currentProjectReview.assessment.reviewBrief}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submitted Document */}
                  {currentProjectReview.assessment.reviewDocument && (
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            className="h-8 w-8 text-blue-600"
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
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {currentProjectReview.assessment.reviewDocument.title ||
                                currentProjectReview.assessment.reviewDocument.fileName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {currentProjectReview.assessment.reviewDocument.fileSize}
                            </p>
                          </div>
                        </div>
                        <a
                          href={currentProjectReview.assessment.reviewDocument.storageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Download & Review
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendation */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Recommendation</h3>
                </div>
                <div className="p-6">
                  <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">
                    Select Recommendation
                  </label>
                  <select
                    id="recommendation"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value as ProjectReviewRecommendation)}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="PERFECT">Perfect - Exceptional Quality</option>
                    <option value="GOOD">Good - Meets All Requirements</option>
                    <option value="NEEDS_IMPROVEMENT">Needs Improvement - Requires Refinement</option>
                    <option value="POOR">Poor - Significant Issues</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    {getRecommendationDescription(recommendation)}
                  </p>
                </div>
              </div>

              {/* Review Analysis */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">Detailed Review Analysis</h3>
                </div>
                <div className="p-6">
                  <label htmlFor="reviewAnalysis" className="sr-only">
                    Review Analysis
                  </label>
                  <textarea
                    id="reviewAnalysis"
                    rows={12}
                    value={reviewAnalysis}
                    onChange={(e) => {
                      setReviewAnalysis(e.target.value);
                      setErrors((prev) => ({ ...prev, reviewAnalysis: '' }));
                    }}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.reviewAnalysis ? 'border-red-300' : ''
                    }`}
                    placeholder="Provide a comprehensive analysis of the project assessment. Include:&#10;&#10;1. Strengths and achievements&#10;2. Areas for improvement&#10;3. Alignment with criteria&#10;4. Specific feedback and recommendations&#10;5. Overall assessment justification"
                  />
                  {errors.reviewAnalysis && (
                    <p className="mt-2 text-sm text-red-600">{errors.reviewAnalysis}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {reviewAnalysis.length} characters (minimum 100 required)
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      {isUpdate ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    <>{isUpdate ? 'Update Review' : 'Submit Review'}</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </ReviewerLayout>
    </AuthGuard>
  );
}
