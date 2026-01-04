/**
 * Delete Application Modal Component
 * Confirmation modal for deleting draft applications
 */
'use client';

import { UserApplication } from '@/types/applicant.types';

interface DeleteApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  application: UserApplication | null;
}

export default function DeleteApplicationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  application,
}: DeleteApplicationModalProps) {
  if (!isOpen || !application) return null;

  const formatDate = (dateString: Date | string | undefined | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/50 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Draft Application</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this draft application? This action cannot be undone.
          </p>

          {/* Application Details */}
          <div className="rounded-lg bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Application Title:</span>
              <span className="text-gray-900">
                {(application as any).basicInfo?.title || 'Untitled Application'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Cycle:</span>
              <span className="text-gray-900">
                {application.cycle?.round?.year || 'N/A'} -{' '}
                {application.cycle?.round?.type || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Created:</span>
              <span className="text-gray-900">{formatDate(application.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Last Updated:</span>
              <span className="text-gray-900">{formatDate(application.updatedAt)}</span>
            </div>
          </div>

          {/* Warning Box */}
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-800">
                All progress on this application will be permanently lost.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              'Delete Application'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
