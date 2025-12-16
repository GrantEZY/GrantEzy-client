'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ApplicantLayout from '@/components/layout/ApplicantLayout';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { FileUpload } from '@/components/ui/FileUpload';
import { useToast } from '@/components/ui/Toast';

export default function SubmitAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationSlug = params.applicationSlug as string;
  const criteriaSlug = params.criteriaSlug as string;
  const cycleSlugFromUrl = searchParams.get('cycleSlug');

  const [cycleSlug, setCycleSlug] = useState<string | null>(cycleSlugFromUrl);
  const [reviewStatement, setReviewStatement] = useState('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const { uploadFile, uploading, error: uploadError } = useCloudinaryUpload();
  const { showToast } = useToast();
  const {
    currentCriteria,
    currentAssessment,
    isAssessmentsLoading,
    getApplicantAssessmentSubmission,
    createAssessmentSubmission,
    clearCurrentCriteria,
  } = useProjectManagement();

  useEffect(() => {
    if (criteriaSlug && cycleSlug) {
      loadData();
    }
    return () => {
      clearCurrentCriteria();
    };
  }, [criteriaSlug, cycleSlug]);

  const loadData = async () => {
    if (!cycleSlug) return;
    
    await getApplicantAssessmentSubmission({
      cycleSlug,
      criteriaSlug,
    });
  };

  useEffect(() => {
    if (currentAssessment) {
      // Pre-fill form with existing submission data
      setReviewStatement(currentAssessment.reviewStatement || '');
      if (currentAssessment.reviewSubmissionFile) {
        setUploadedFile(currentAssessment.reviewSubmissionFile);
        setIsUpdate(true);
      }
    }
  }, [currentAssessment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!reviewStatement.trim()) {
      newErrors.reviewStatement = 'Assessment statement is required';
    } else if (reviewStatement.trim().length < 50) {
      newErrors.reviewStatement = 'Please provide at least 50 characters';
    }

    if (!uploadedFile) {
      newErrors.file = 'Assessment document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = async (result: {
    url: string;
    publicId: string;
    fileName: string;
    fileSize: string;
    mimeType: string;
  }) => {
    setUploadedFile({
      title: result.fileName,
      description: null,
      fileName: result.fileName,
      fileSize: result.fileSize,
      mimeType: result.mimeType,
      storageUrl: result.url,
      metaData: {
        publicId: result.publicId,
        uploadedAt: new Date().toISOString(),
      },
    });
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const handleFileError = (error: string) => {
    setErrors((prev) => ({ ...prev, file: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !cycleSlug || !currentCriteria?.id) {
      return;
    }

    setIsSubmitting(true);

    const success = await createAssessmentSubmission({
      criteriaId: currentCriteria.id,
      cycleSlug,
      reviewStatement,
      reviewSubmissionFile: uploadedFile,
    });

    setIsSubmitting(false);

    if (success) {
      showToast({
        type: 'success',
        message: `Assessment ${isUpdate ? 'updated' : 'submitted'} successfully!`,
        duration: 3000,
      });
      setTimeout(() => {
        router.push(`/applicant/my-projects/${applicationSlug}/assessments`);
      }, 1500);
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
      <ApplicantLayout>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <nav className="mb-4 flex text-sm text-gray-500">
              <Link href="/applicant/my-projects" className="hover:text-gray-700">
                My Projects
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/applicant/my-projects/${applicationSlug}/assessments`}
                className="hover:text-gray-700"
              >
                Assessments
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Submit</span>
            </nav>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isUpdate ? 'Update' : 'Submit'} Assessment
              </h1>
              {currentCriteria && (
                <p className="mt-1 text-sm text-gray-500">{currentCriteria.name}</p>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isAssessmentsLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}

          {/* Form */}
          {!isAssessmentsLoading && currentCriteria && (
            <div className="space-y-6">
              {/* Criteria Information */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">Assessment Criteria</h3>
                </div>
                <div className="p-6">
                  <h4 className="font-medium text-gray-900">{currentCriteria.name}</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {currentCriteria.reviewBrief}
                  </p>
                  
                  {currentCriteria.templateFile && (
                    <div className="mt-4 flex items-center rounded-md bg-blue-50 px-4 py-3">
                      <svg
                        className="h-5 w-5 text-blue-600"
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
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-blue-900">Template Available</p>
                        <a
                          href={currentCriteria.templateFile.storageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-700 hover:text-blue-600"
                        >
                          Download template file →
                        </a>
                      </div>
                    </div>
                  )}

                  {isUpdate && currentAssessment.createdAt && (
                    <div className="mt-4 rounded-md bg-yellow-50 p-4">
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
                          <h3 className="text-sm font-medium text-yellow-800">
                            Updating Existing Submission
                          </h3>
                          <p className="mt-1 text-sm text-yellow-700">
                            Originally submitted on {formatDate(currentAssessment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Review Statement */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Assessment Statement</h3>
                  </div>
                  <div className="p-6">
                    <label htmlFor="reviewStatement" className="sr-only">
                      Assessment Statement
                    </label>
                    <textarea
                      id="reviewStatement"
                      rows={10}
                      value={reviewStatement}
                      onChange={(e) => {
                        setReviewStatement(e.target.value);
                        setErrors((prev) => ({ ...prev, reviewStatement: '' }));
                      }}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.reviewStatement ? 'border-red-300' : ''
                      }`}
                      placeholder="Provide a detailed assessment of your project progress, achievements, challenges, and learnings..."
                    />
                    {errors.reviewStatement && (
                      <p className="mt-2 text-sm text-red-600">{errors.reviewStatement}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      {reviewStatement.length} characters (minimum 50 required)
                    </p>
                  </div>
                </div>

                {/* File Upload */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Assessment Document</h3>
                  </div>
                  <div className="p-6">
                    {!uploadedFile ? (
                      <>
                        <FileUpload
                          onUploadSuccess={handleFileSelect}
                          onUploadError={handleFileError}
                          allowedFormats={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']}
                          maxSizeMB={10}
                        />
                        {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
                      </>
                    ) : (
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
                                {uploadedFile.title}
                              </p>
                              <p className="text-sm text-gray-500">{uploadedFile.fileSize}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Upload your detailed assessment document (PDF, DOC, DOCX, PPT, PPTX - Max 10MB)
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
                    disabled={isSubmitting || uploading}
                    className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
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
                      <>{isUpdate ? 'Update Assessment' : 'Submit Assessment'}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* No Criteria Found */}
          {!isAssessmentsLoading && !currentCriteria && (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Criteria Not Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The assessment criteria could not be found or you don't have access to it.
              </p>
              <div className="mt-6">
                <Link
                  href={`/applicant/my-projects/${applicationSlug}/assessments`}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Back to Assessments
                </Link>
              </div>
            </div>
          )}
        </div>
      </ApplicantLayout>
    </AuthGuard>
  );
}
