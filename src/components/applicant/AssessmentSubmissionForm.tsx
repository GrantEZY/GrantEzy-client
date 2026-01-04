'use client';

import { useState } from 'react';
import { useProjectAssessment } from '@/hooks/useProjectAssessment';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { CycleAssessmentCriteria } from '@/types/project-management.types';

interface AssessmentSubmissionFormProps {
  cycleSlug: string;
  criteriaId: string;
  criteria: CycleAssessmentCriteria;
  existingSubmission?: {
    reviewStatement?: string;
    reviewSubmissionFile?: {
      title: string;
      fileName: string;
      storageUrl: string;
    };
  };
  onSuccess?: () => void;
}

export default function AssessmentSubmissionForm({
  cycleSlug,
  criteriaId,
  criteria,
  existingSubmission,
  onSuccess,
}: AssessmentSubmissionFormProps) {
  const { createApplicantAssessmentSubmission, isLoading } = useProjectAssessment();
  const { uploadFile, uploading } = useCloudinaryUpload();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [reviewStatement, setReviewStatement] = useState(existingSubmission?.reviewStatement || '');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
    url: string;
    publicId: string;
  } | null>(
    existingSubmission?.reviewSubmissionFile
      ? {
          name: existingSubmission.reviewSubmissionFile.fileName,
          size: 0, // Size not available from existing submission
          type: 'application/octet-stream', // Default type for existing files
          url: existingSubmission.reviewSubmissionFile.storageUrl,
          publicId: '', // Not stored in DocumentObject
        }
      : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, file: 'File size must be less than 10MB' });
      return;
    }

    setUploadError(null);
    const result = await uploadFile(file);
    if (result) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type, // Capture MIME type from the File object
        url: result.url,
        publicId: result.public_id,
      });
      setErrors({ ...errors, file: '' });
    } else {
      setUploadError('Failed to upload file');
      setErrors({ ...errors, file: 'Failed to upload file. Please try again.' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!reviewStatement.trim()) {
      newErrors.reviewStatement = 'Assessment statement is required';
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

    try {
      // Transform the file data to match backend expectations (DocumentObjectDTO)
      const reviewSubmissionFile = uploadedFile
        ? {
            title: uploadedFile.name,
            fileName: uploadedFile.name,
            fileSize: `${(uploadedFile.size / 1024).toFixed(2)}KB`,
            mimeType: uploadedFile.type || 'application/octet-stream',
            storageUrl: uploadedFile.url,
          }
        : undefined;

      const response = await createApplicantAssessmentSubmission({
        criteriaId,
        cycleSlug,
        reviewStatement,
        reviewSubmissionFile,
      });

      if (response) {
        // Clear form
        setReviewStatement('');
        setUploadedFile(null);
        setErrors({});

        // Call success callback
        onSuccess?.();
      } else {
        setErrors({ ...errors, submit: 'Failed to submit assessment. Please try again.' });
      }
    } catch (error: any) {
      setErrors({
        ...errors,
        submit: error.message || 'Failed to submit assessment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Criteria Details */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h4 className="font-medium text-blue-900">{criteria.name}</h4>
          <p className="mt-2 text-sm text-blue-700">{criteria.reviewBrief}</p>
          {criteria.templateFile && (
            <a
              href={criteria.templateFile.storageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Review Statement */}
        <div>
          <label htmlFor="reviewStatement" className="block text-sm font-medium text-gray-700">
            Assessment Statement <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reviewStatement"
            rows={6}
            value={reviewStatement}
            onChange={(e) => setReviewStatement(e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.reviewStatement ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            placeholder="Provide a detailed assessment of your project against this criteria..."
          />
          {errors.reviewStatement && (
            <p className="mt-1 text-sm text-red-600">{errors.reviewStatement}</p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supporting Document (Optional)
          </label>
          <div className="mt-2">
            {uploadedFile ? (
              <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-3">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <span className="ml-2 text-sm text-green-700">{uploadedFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFile(null);
                    setUploadError(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <label className="flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4 hover:border-gray-400">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="mt-2 flex items-center text-sm text-blue-600">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    Uploading...
                  </div>
                )}
                {uploadError && (
                  <p className="mt-2 text-sm text-red-600">Failed to upload: {uploadError}</p>
                )}
              </div>
            )}
          </div>
          {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
        </div>

        {/* Submission Error */}
        {errors.submit && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
          \n{' '}
          <button
            type="submit"
            disabled={isSubmitting || isLoading || uploading}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting || isLoading ? (
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
                {existingSubmission ? 'Update Assessment' : 'Submit Assessment'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
