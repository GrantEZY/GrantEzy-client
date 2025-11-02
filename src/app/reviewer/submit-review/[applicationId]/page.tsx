"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReviewerLayout from "@/components/layout/ReviewerLayout";
import ReviewSubmissionForm from "@/components/reviewer/ReviewSubmissionForm";
import { useReviewer } from "@/hooks/useReviewer";

export default function SubmitReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { getUserReviews, reviews } = useReviewer();

  const applicationId = params.applicationId as string;
  const [applicationTitle, setApplicationTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviewData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Fetch user reviews to get the application title
        await getUserReviews({ page: 1, numberOfResults: 100 });

        // Find the review with matching applicationId from the store
        const review = reviews.find((r) => r.applicationId === applicationId);
        if (review && review.application?.title) {
          setApplicationTitle(review.application.title);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load application details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (applicationId) {
      fetchReviewData();
    }
  }, [applicationId, getUserReviews, reviews]);

  const handleSuccess = () => {
    router.push("/reviewer/reviews");
  };

  const handleCancel = () => {
    router.push("/reviewer/reviews");
  };

  return (
    <ReviewerLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/reviewer/reviews")}
            type="button"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Back to Reviews
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Submit Review</h1>
          <p className="mt-2 text-sm text-gray-600">
            Provide your evaluation scores, recommendation, and suggested budget
            for this application.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 animate-spin text-indigo-600"
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
              <p className="mt-2 text-sm text-gray-600">
                Loading application details...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
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
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Application
                </h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button
                  className="mt-4 rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
                  onClick={() => router.push("/reviewer/reviews")}
                  type="button"
                >
                  Go Back to Reviews
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Submission Form */}
        {!isLoading && !error && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <ReviewSubmissionForm
              applicationId={applicationId}
              applicationTitle={applicationTitle || "Application"}
              onCancel={handleCancel}
              onSuccess={handleSuccess}
            />
          </div>
        )}

        {/* Help Text */}
        {!isLoading && !error && (
          <div className="mt-6 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  fillRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Review Guidelines
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>
                      Rate each category from 0 to 100 based on the application's
                      merit
                    </li>
                    <li>
                      Technical: Feasibility and soundness of the technical
                      approach
                    </li>
                    <li>
                      Market: Market opportunity and potential for impact
                    </li>
                    <li>
                      Financial: Budget reasonableness and financial planning
                    </li>
                    <li>
                      Team: Team capability and relevant experience
                    </li>
                    <li>
                      Innovation: Novelty and innovative aspects of the project
                    </li>
                    <li>
                      Provide a clear recommendation (Approve, Reject, or Request
                      Revisions)
                    </li>
                    <li>
                      Suggest an appropriate budget considering the project scope
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ReviewerLayout>
  );
}
