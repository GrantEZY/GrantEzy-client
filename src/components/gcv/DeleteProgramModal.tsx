/**
 * Delete Program Confirmation Modal
 */

interface DeleteProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  programName: string;
  isLoading?: boolean;
}

export function DeleteProgramModal({
  isOpen,
  onClose,
  onConfirm,
  programName,
  isLoading = false,
}: DeleteProgramModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
      <div className="w-full max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-xl transition-all duration-200">
        <div className="mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>

        <div className="mb-4 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete Program</h3>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete the program{' '}
            <span className="font-semibold">&quot;{programName}&quot;</span>? This action cannot be
            undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={onConfirm}
            type="button"
          >
            {isLoading ? 'Deleting...' : 'Delete Program'}
          </button>
        </div>
      </div>
    </div>
  );
}
