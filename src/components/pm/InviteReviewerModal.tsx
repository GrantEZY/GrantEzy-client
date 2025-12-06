'use client';

import { useState } from 'react';
import { usePm } from '@/hooks/usePm';

interface InviteReviewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  applicationId: string;
  applicationTitle?: string;
}

export default function InviteReviewerModal({
  isOpen,
  onClose,
  onSuccess,
  applicationId,
  applicationTitle,
}: InviteReviewerModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { inviteReviewer } = usePm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await inviteReviewer({
        applicationId,
        email,
      });

      if (result) {
        setSuccess(true);
        setEmail('');

        // Call onSuccess callback to refresh the reviews list
        if (onSuccess) {
          onSuccess();
        }

        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError('Failed to send invitation. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Invite Reviewer</h3>
              <button
                className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                onClick={handleClose}
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
            {applicationTitle && (
              <p className="mt-1 text-sm text-gray-600">
                For application: <span className="font-medium">{applicationTitle}</span>
              </p>
            )}
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="reviewer-email"
                >
                  Reviewer Email Address
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="reviewer-email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reviewer@example.com"
                  required
                  type="email"
                  value={email}
                />
                <p className="mt-2 text-xs text-gray-500">
                  The reviewer will receive an invitation email with a link to review this
                  application.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        fillRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 rounded-md bg-green-50 p-3">
                  <div className="flex">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        fillRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">Invitation sent successfully!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Info */}
              <div className="rounded-md bg-blue-50 p-3">
                <div className="flex">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-xs text-blue-800">
                      <strong>Application ID:</strong> {applicationId.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleClose}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting || success}
                  type="submit"
                >
                  {isSubmitting ? 'Sending...' : success ? 'Sent!' : 'Send Invitation'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
