"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useReviewer } from "@/hooks/useReviewer";

import { Recommendation } from "@/types/reviewer.types";

interface ReviewSubmissionFormProps {
  applicationId: string;
  applicationTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormErrors {
  technical?: string;
  market?: string;
  financial?: string;
  team?: string;
  innovation?: string;
  recommendation?: string;
  suggestedBudget?: string;
}

export default function ReviewSubmissionForm({
  applicationId,
  applicationTitle,
  onSuccess,
  onCancel,
}: ReviewSubmissionFormProps) {
  const router = useRouter();
  const { submitReview } = useReviewer();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [scores, setScores] = useState({
    technical: "",
    market: "",
    financial: "",
    team: "",
    innovation: "",
  });
  const [recommendation, setRecommendation] = useState<Recommendation | "">("");
  const [suggestedBudget, setSuggestedBudget] = useState({
    amount: "",
    currency: "USD",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validate a single score field
  const validateScore = (value: string, fieldName: string): string => {
    if (!value || value.trim() === "") {
      return `${fieldName} score is required`;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return `${fieldName} score must be a number`;
    }
    if (numValue < 0 || numValue > 100) {
      return `${fieldName} score must be between 0 and 100`;
    }
    return "";
  };

  // Validate all form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate scores
    Object.keys(scores).forEach((key) => {
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
      const error = validateScore(
        scores[key as keyof typeof scores],
        fieldName,
      );
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    // Validate recommendation
    if (!recommendation) {
      newErrors.recommendation = "Recommendation is required";
    }

    // Validate suggested budget
    if (!suggestedBudget.amount || suggestedBudget.amount.trim() === "") {
      newErrors.suggestedBudget = "Suggested budget is required";
    } else {
      const budgetValue = parseFloat(suggestedBudget.amount);
      if (isNaN(budgetValue) || budgetValue <= 0) {
        newErrors.suggestedBudget =
          "Suggested budget must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle score input change
  const handleScoreChange = (field: keyof typeof scores, value: string) => {
    setScores((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setSubmitError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const result = await submitReview({
        applicationId,
        scores: {
          technical: parseFloat(scores.technical),
          market: parseFloat(scores.market),
          financial: parseFloat(scores.financial),
          team: parseFloat(scores.team),
          innovation: parseFloat(scores.innovation),
        },
        recommendation: recommendation as Recommendation,
        budget: {
          amount: parseFloat(suggestedBudget.amount),
          currency: suggestedBudget.currency,
        },
      });

      if (result) {
        setSubmitSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/reviewer/reviews");
          }
        }, 2000);
      } else {
        setSubmitError("Failed to submit review. Please try again.");
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the review",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/reviewer/reviews");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Success Message */}
      {submitSuccess && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                fillRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Review submitted successfully! Redirecting to reviews list...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                fillRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Application Info */}
      {applicationTitle && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-900">
            Reviewing Application
          </h3>
          <p className="mt-1 text-sm text-gray-600">{applicationTitle}</p>
          <p className="mt-1 text-xs text-gray-500">ID: {applicationId}</p>
        </div>
      )}

      {/* Scores Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Evaluation Scores
        </h3>
        <p className="text-sm text-gray-600">
          Rate each category from 0 to 100, where 0 is the lowest and 100 is the
          highest.
        </p>

        {/* Technical Score */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="technical"
          >
            Technical Feasibility <span className="text-red-500">*</span>
          </label>
          <input
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.technical
                ? "border-red-300 text-red-900 placeholder-red-300"
                : "border-gray-300"
            }`}
            id="technical"
            name="technical"
            max="100"
            min="0"
            onChange={(e) => handleScoreChange("technical", e.target.value)}
            placeholder="0-100"
            step="0.1"
            type="number"
            value={scores.technical}
          />
          {errors.technical && (
            <p className="mt-1 text-sm text-red-600">{errors.technical}</p>
          )}
        </div>

        {/* Market Potential Score */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="market"
          >
            Market Potential <span className="text-red-500">*</span>
          </label>
          <input
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.market
                ? "border-red-300 text-red-900 placeholder-red-300"
                : "border-gray-300"
            }`}
            id="market"
            name="market"
            max="100"
            min="0"
            onChange={(e) => handleScoreChange("market", e.target.value)}
            placeholder="0-100"
            step="0.1"
            type="number"
            value={scores.market}
          />
          {errors.market && (
            <p className="mt-1 text-sm text-red-600">{errors.market}</p>
          )}
        </div>

        {/* Financial Viability Score */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="financial"
          >
            Financial Viability <span className="text-red-500">*</span>
          </label>
          <input
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.financial
                ? "border-red-300 text-red-900 placeholder-red-300"
                : "border-gray-300"
            }`}
            id="financial"
            name="financial"
            max="100"
            min="0"
            onChange={(e) => handleScoreChange("financial", e.target.value)}
            placeholder="0-100"
            step="0.1"
            type="number"
            value={scores.financial}
          />
          {errors.financial && (
            <p className="mt-1 text-sm text-red-600">{errors.financial}</p>
          )}
        </div>

        {/* Team Capability Score */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="team"
          >
            Team Capability <span className="text-red-500">*</span>
          </label>
          <input
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.team
                ? "border-red-300 text-red-900 placeholder-red-300"
                : "border-gray-300"
            }`}
            id="team"
            name="team"
            max="100"
            min="0"
            onChange={(e) => handleScoreChange("team", e.target.value)}
            placeholder="0-100"
            step="0.1"
            type="number"
            value={scores.team}
          />
          {errors.team && (
            <p className="mt-1 text-sm text-red-600">{errors.team}</p>
          )}
        </div>

        {/* Innovation Score */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="innovation"
          >
            Innovation <span className="text-red-500">*</span>
          </label>
          <input
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.innovation
                ? "border-red-300 text-red-900 placeholder-red-300"
                : "border-gray-300"
            }`}
            id="innovation"
            name="innovation"
            max="100"
            min="0"
            onChange={(e) => handleScoreChange("innovation", e.target.value)}
            placeholder="0-100"
            step="0.1"
            type="number"
            value={scores.innovation}
          />
          {errors.innovation && (
            <p className="mt-1 text-sm text-red-600">{errors.innovation}</p>
          )}
        </div>
      </div>

      {/* Recommendation */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="recommendation"
        >
          Recommendation <span className="text-red-500">*</span>
        </label>
        <select
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.recommendation
              ? "border-red-300 text-red-900"
              : "border-gray-300"
          }`}
          id="recommendation"
          name="recommendation"
          onChange={(e) => {
            setRecommendation(e.target.value as Recommendation);
            if (errors.recommendation) {
              setErrors((prev) => ({ ...prev, recommendation: undefined }));
            }
          }}
          value={recommendation}
        >
          <option value="">Select a recommendation</option>
          <option value={Recommendation.APPROVE}>Approve</option>
          <option value={Recommendation.REJECT}>Reject</option>
          <option value={Recommendation.REVISE}>Request Revisions</option>
        </select>
        {errors.recommendation && (
          <p className="mt-1 text-sm text-red-600">{errors.recommendation}</p>
        )}
      </div>

      {/* Suggested Budget */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="suggestedBudget"
        >
          Suggested Budget <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            className={`block w-full flex-1 rounded-none rounded-l-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.suggestedBudget
                ? "border-red-300 text-red-900 placeholder-red-300"
                : "border-gray-300"
            }`}
            id="suggestedBudget"
            name="suggestedBudget"
            min="0"
            onChange={(e) => {
              setSuggestedBudget((prev) => ({
                ...prev,
                amount: e.target.value,
              }));
              if (errors.suggestedBudget) {
                setErrors((prev) => ({ ...prev, suggestedBudget: undefined }));
              }
            }}
            placeholder="Enter amount"
            step="0.01"
            type="number"
            value={suggestedBudget.amount}
          />
          <select
            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            id="currency"
            name="currency"
            onChange={(e) =>
              setSuggestedBudget((prev) => ({
                ...prev,
                currency: e.target.value,
              }))
            }
            value={suggestedBudget.currency}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </div>
        {errors.suggestedBudget && (
          <p className="mt-1 text-sm text-red-600">{errors.suggestedBudget}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
        <button
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting || submitSuccess}
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting || submitSuccess}
          type="submit"
        >
          {isSubmitting ? (
            <span className="flex items-center">
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
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </form>
  );
}
