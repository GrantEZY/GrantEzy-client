'use client';

import { useState } from 'react';
import { pmService } from '@/services/pm.service';

interface InviteAssessmentReviewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  assessmentId: string;
  projectTitle?: string;
  criteriaName?: string;
}

export default function InviteAssessmentReviewerModal({
  isOpen,
  onClose,
  onSuccess,
  assessmentId,
  projectTitle,
  criteriaName,
}: InviteAssessmentReviewerModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      const response = await pmService.inviteAssessmentReviewer({
        assessmentId,
        email,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setEmail('');

        // Call onSuccess callback to refresh if needed
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
    } catch (err: any) {
      setError(
        err?.message || err?.res?.message || 'An unexpected error occurred. Please try again.'
      );
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
        className="fixed inset-0 bg-white/10 backdrop-blur-md transition-opacity"
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Invite an expert to evaluate this project assessment submission.
                </p>
                {projectTitle && (
                  <div className="mt-2 rounded-md bg-blue-50 p-3">
                    <p className="text-sm font-medium text-blue-900">Project: {projectTitle}</p>
                    {criteriaName && (
                      <p className="text-sm text-blue-700">Criteria: {criteriaName}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="reviewer-email" className="block text-sm font-medium text-gray-700">
                  Reviewer Email Address
                </label>
                <input
                  type="email"
                  id="reviewer-email"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="reviewer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  The reviewer will receive an email invitation with a link to evaluate the
                  submission.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 rounded-md bg-green-50 p-3">
                  <p className="text-sm text-green-800">
                    Invitation sent successfully! The reviewer will receive an email shortly.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting || !email}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Invitation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
