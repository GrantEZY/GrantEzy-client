/**
 * Step 7: Team Members Form (Final Step)
 * Collects: emails[] + isSubmitted boolean for final submission
 */
"use client";

import { useEffect, useState } from "react";

import { showToast } from "@/components/ui/ToastNew";

import { useApplicant } from "@/hooks/useApplicant";

/**
 * Step 7: Team Members Form (Final Step)
 * Collects: emails[] + isSubmitted boolean for final submission
 */

/**
 * Step 7: Team Members Form (Final Step)
 * Collects: emails[] + isSubmitted boolean for final submission
 */

export default function TeamMembersForm() {
  const {
    addTeammates,
    isLoading,
    goToPreviousStep,
    currentApplication,
    successMessage,
  } = useApplicant();

  const [emails, setEmails] = useState<string[]>(
    currentApplication?.teamMateInvites?.map((invite) => invite.email) || [],
  );
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Show celebration toast when application is successfully submitted
  useEffect(() => {
    if (successMessage && successMessage.includes("🎉") && hasSubmitted) {
      showToast.success(successMessage);
      setHasSubmitted(false); // Reset to prevent duplicate toasts
    }
  }, [successMessage, hasSubmitted]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    if (!newEmail.trim()) {
      setErrors((prev) => ({ ...prev, newEmail: "Email address is required" }));
      return;
    }

    if (!validateEmail(newEmail)) {
      setErrors((prev) => ({ ...prev, newEmail: "Invalid email format" }));
      return;
    }

    if (emails.includes(newEmail)) {
      setErrors((prev) => ({
        ...prev,
        newEmail: "This email has already been added",
      }));
      return;
    }

    setEmails([...emails, newEmail]);
    setNewEmail("");
    setErrors((prev) => ({ ...prev, newEmail: "" }));
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    submitApplication: boolean = false,
  ) => {
    e.preventDefault();

    // Validate at least one email if submitting
    if (submitApplication && emails.length === 0) {
      setErrors((prev) => ({
        ...prev,
        general: "Add at least one team member before submitting",
      }));
      return;
    }

    setIsSubmitting(submitApplication);

    // Track if this is a final submission for toast notification
    if (submitApplication) {
      setHasSubmitted(true);
    }

    await addTeammates(emails, submitApplication);
  };

  return (
    <form className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <p className="mt-1 text-sm text-gray-600">
          {emails.length === 0
            ? "Invite your team members to collaborate on this application"
            : "Review and finalize your team composition"}
        </p>
      </div>

      {/* Add Email Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900">
          Invite Team Members
        </h3>

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setErrors((prev) => ({ ...prev, newEmail: "" }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addEmail();
                }
              }}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.newEmail ? "border-red-300" : ""
              }`}
              placeholder="teammate@example.com"
            />
            {errors.newEmail && (
              <p className="mt-1 text-sm text-red-500">{errors.newEmail}</p>
            )}
          </div>
          <button
            type="button"
            onClick={addEmail}
            className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add
          </button>
        </div>

        {errors.general && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="ml-3 text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        )}
      </div>

      {/* Team Members List */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Team Members ({emails.length})
          </h3>
        </div>

        {emails.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              No team members added yet
            </p>
            <p className="text-xs text-gray-400">
              Team members will receive email invitations to collaborate
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {emails.map((email: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{email}</p>
                    <p className="text-xs text-gray-500">Pending invitation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="text-red-600 hover:text-red-700"
                  title="Remove team member"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information Banner */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex">
          <svg
            className="mt-0.5 h-5 w-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Application Submission
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-inside list-disc space-y-1">
                <li>You can save as draft and add team members later</li>
                <li>Once submitted, the application cannot be edited</li>
                <li>Team members will receive email notifications</li>
                <li>All team members must accept their invitations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isLoading}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading && !isSubmitting ? "Saving..." : "Save as Draft"}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
            className="inline-flex items-center rounded-md bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading && isSubmitting ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
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
                Submitting...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Submit Application
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
