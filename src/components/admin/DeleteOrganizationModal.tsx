'use client';

import { Organization } from '../../types/admin.types';

interface DeleteOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
  organization: Organization | null;
  isLoading: boolean;
}

export function DeleteOrganizationModal({
  isOpen,
  onClose,
  onConfirm,
  organization,
  isLoading,
}: DeleteOrganizationModalProps) {
  const handleConfirm = async () => {
    const result = await onConfirm();
    if (result.success) {
      onClose();
    }
  };

  if (!isOpen || !organization) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="mx-4 w-full max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-xl transition-all duration-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-red-600">Delete Organization</h2>

          <button
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
            onClick={onClose}
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

        <div className="mb-6">
          <div className="mb-4 flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>

            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>

              <p className="mt-1 text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete the organization{' '}
              <span className="font-semibold">{organization.name}</span>?
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Type:{' '}
              {organization.type
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            disabled={isLoading}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>

          <button
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
            disabled={isLoading}
            onClick={handleConfirm}
            type="button"
          >
            {isLoading ? 'Deleting...' : 'Delete Organization'}
          </button>
        </div>
      </div>
    </div>
  );
}
