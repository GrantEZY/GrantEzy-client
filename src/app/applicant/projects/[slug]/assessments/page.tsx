'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ApplicantLayout from '@/components/layout/ApplicantLayout';
import { useProjectAssessment } from '@/hooks/useProjectAssessment';
import { applicantService } from '@/services/applicant.service';
import AssessmentSubmissionForm from '@/components/applicant/AssessmentSubmissionForm';

export default function ProjectAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [selectedCriteria, setSelectedCriteria] = useState<string | null>(null);
  const [cycleSlug, setCycleSlug] = useState<string>('');
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fetchKeyRef = useRef(`criteria-fetch-${slug}`);

  // Track component mount/unmount and cleanup
  useEffect(() => {
    // Clear the fetch flag on mount to ensure fresh fetch
    const fetchKey = `criteria-fetch-${slug}`;
    sessionStorage.removeItem(fetchKey);
    
    return () => {
      // Cleanup on unmount
    };
  }, [slug]);

  const {
    applicantCriterias,
    applicantCurrentSubmission,
    isLoadingApplicantCriterias,
    isLoading,
    error,
    getApplicantCycleCriterias,
    getApplicantAssessmentSubmission,
  } = useProjectAssessment();

  // Fetch project details to get cycle slug
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!slug) return;
      
      try {
        setIsLoadingProject(true);
        const response = await applicantService.getProjectDetails(slug);
        
        if (response.status === 200 && response.res?.project) {
          const { project } = response.res;
          
          // Get cycle slug from the project's application
          if (project.application?.cycle?.slug) {
            setCycleSlug(project.application.cycle.slug);
          }
        }
      } catch (err) {
        // Error loading project details
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]); // Only depend on slug

  // Fetch criterias once we have the cycle slug
  useEffect(() => {
    const fetchKey = fetchKeyRef.current;
    const alreadyFetched = sessionStorage.getItem(fetchKey);
    
    if (cycleSlug && !alreadyFetched) {
      sessionStorage.setItem(fetchKey, 'true');
      getApplicantCycleCriterias(cycleSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleSlug]); // Only depend on cycleSlug, not the function

  const handleCriteriaSelect = (criteriaId: string, criteriaSlug: string) => {
    setSelectedCriteria(criteriaId);
    if (cycleSlug) {
      getApplicantAssessmentSubmission(cycleSlug, criteriaSlug);
    }
  };

  const handleSubmissionSuccess = () => {
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
    
    // Close modal
    setSelectedCriteria(null);
    
    // No need to refetch - the store already updated the criteria with hasSubmitted status
  };

  const getSubmissionStatus = (criteriaId: string) => {
    const criteria = applicantCriterias.find((c: any) => c.id === criteriaId);
    if (!criteria) return 'not-started';

    // Check submission status from backend
    if (criteria.hasSubmitted) {
      return 'submitted';
    }
    return 'not-started';
  };

  const getStatusBadge = (criteriaId: string) => {
    const status = getSubmissionStatus(criteriaId);
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Submitted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Pending
          </span>
        );
    }
  };

  const submittedCount = applicantCriterias.filter(
    (c: any) => getSubmissionStatus(c.id) === 'submitted'
  ).length;
  const totalCount = applicantCriterias.length;

  return (
    <AuthGuard>
      <ApplicantLayout>
        <div className="space-y-6">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="ml-3 text-sm font-medium text-green-800">
                  Assessment submitted successfully! Your submission has been recorded.
                </p>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div>
            <button
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() => router.back()}
              type="button"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Back to Projects
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Project Assessments</h1>
            <p className="mt-2 text-gray-600">
              Submit assessments for your project based on the evaluation criteria
            </p>
          </div>

          {/* Progress Card */}
          {!isLoadingApplicantCriterias && totalCount > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Assessment Progress</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {submittedCount} of {totalCount} criteria completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${totalCount > 0 ? (submittedCount / totalCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {(isLoadingProject || isLoadingApplicantCriterias) && (
            <div className="flex h-32 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">
                  {isLoadingProject ? 'Loading project details...' : 'Loading assessment criteria...'}
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoadingApplicantCriterias && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* No Criteria State */}
          {!isLoadingProject && !isLoadingApplicantCriterias && (!applicantCriterias || applicantCriterias.length === 0) && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Assessment Criteria</h3>
              <p className="mt-1 text-sm text-gray-500">
                The program manager hasn't created any assessment criteria for this cycle yet.
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Debug: isLoadingProject={isLoadingProject.toString()}, isLoadingApplicantCriterias={isLoadingApplicantCriterias.toString()}, 
                criterias={applicantCriterias?.length || 0}
              </p>
            </div>
          )}

          {/* Criteria List */}
          {!isLoadingApplicantCriterias && applicantCriterias && applicantCriterias.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Assessment Criteria ({applicantCriterias.length})</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {applicantCriterias.map((criteria: any) => (
                  <div
                    key={criteria.id}
                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{criteria.name}</h3>
                          {getStatusBadge(criteria.id)}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{criteria.briefReview}</p>
                        {criteria.templateFile && (
                          <a
                            href={criteria.templateFile.storageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            <svg
                              className="mr-1 h-4 w-4"
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
                            Download Template
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCriteriaSelect(criteria.id, criteria.slug)}
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        type="button"
                      >
                        {getSubmissionStatus(criteria.id) === 'submitted'
                          ? 'Update Assessment'
                          : 'Submit Assessment'}
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
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Form Modal */}
          {selectedCriteria && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/50 backdrop-blur-md p-4">
              <div
                className="fixed inset-0"
                onClick={() => setSelectedCriteria(null)}
              ></div>
              <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Submit Assessment</h2>
                    <button
                      onClick={() => setSelectedCriteria(null)}
                      className="text-gray-400 hover:text-gray-600"
                      type="button"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="flex h-32 items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading...</p>
                      </div>
                    </div>
                  ) : (
                    <AssessmentSubmissionForm
                      cycleSlug={cycleSlug}
                      criteriaId={selectedCriteria}
                      criteria={applicantCriterias.find((c: any) => c.id === selectedCriteria)!}
                      existingSubmission={
                        applicantCurrentSubmission
                          ? {
                              reviewStatement: applicantCurrentSubmission.reviewBrief,
                              reviewSubmissionFile: applicantCurrentSubmission.reviewFile,
                            }
                          : undefined
                      }
                      onSuccess={handleSubmissionSuccess}
                    />
                  )}
                </div>
            </div>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
