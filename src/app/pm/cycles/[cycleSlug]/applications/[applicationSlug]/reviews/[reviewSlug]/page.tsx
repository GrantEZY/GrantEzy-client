"use client";

import { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";

import { usePm } from "@/hooks/usePm";

import { Recommendation, ReviewStatus } from "@/types/reviewer.types";

export default function PMReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = params.cycleSlug as string;
  const applicationSlug = params.applicationSlug as string;
  const reviewSlug = params.reviewSlug as string;

  const {
    currentReview,
    isReviewLoading,
    reviewError,
    getReviewDetails,
    clearReview,
  } = usePm();

  useEffect(() => {
    if (cycleSlug && applicationSlug && reviewSlug) {
      getReviewDetails({ cycleSlug, applicationSlug, reviewSlug });
    }

    return () => {
      clearReview();
    };
  }, [cycleSlug, applicationSlug, reviewSlug, getReviewDetails, clearReview]);

  const getRecommendationBadgeClass = (recommendation: Recommendation) => {
    switch (recommendation) {
      case Recommendation.APPROVE:
        return "bg-green-100 text-green-800";
      case Recommendation.REJECT:
        return "bg-red-100 text-red-800";
      case Recommendation.REVISE:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeClass = (status: ReviewStatus | string) => {
    if (status === ReviewStatus.COMPLETED || status === "COMPLETED") {
      return "bg-green-100 text-green-800";
    } else if (
      status === ReviewStatus.IN_PROGRESS ||
      status === "IN_PROGRESS"
    ) {
      return "bg-orange-100 text-orange-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <button
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() =>
                router.push(
                  `/pm/cycles/${cycleSlug}/applications/${applicationSlug}`,
                )
              }
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
              Back to Application
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Review Details</h1>
            <p className="mt-2 text-gray-600">
              Complete review breakdown and evaluation
            </p>
          </div>

          {/* Loading State */}
          {isReviewLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading review details...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {reviewError && !isReviewLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <h3 className="text-sm font-medium text-red-900">
                Error Loading Review
              </h3>
              <p className="mt-1 text-sm text-red-700">{reviewError}</p>
            </div>
          )}

          {/* Review Content */}
          {!isReviewLoading && !reviewError && currentReview && (
            <>
              {/* Review Overview Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center space-x-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Review by{" "}
                        {currentReview.reviewer?.firstName &&
                        currentReview.reviewer?.lastName
                          ? `${currentReview.reviewer.firstName} ${currentReview.reviewer.lastName}`
                          : currentReview.reviewer?.email ||
                            "Anonymous Reviewer"}
                      </h2>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(currentReview.status)}`}
                      >
                        {currentReview.status === ReviewStatus.COMPLETED ||
                        (currentReview.recommendation && currentReview.scores)
                          ? "COMPLETED"
                          : "IN_PROGRESS"}
                      </span>
                    </div>

                    {currentReview.reviewer?.email && (
                      <p className="text-sm text-gray-600">
                        {currentReview.reviewer.email}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">
                      Submitted
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(currentReview.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(currentReview.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendation Card */}
              {currentReview.recommendation && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Recommendation
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center rounded-lg px-6 py-3 text-lg font-bold ${getRecommendationBadgeClass(currentReview.recommendation as Recommendation)}`}
                    >
                      {currentReview.recommendation ===
                        Recommendation.APPROVE && "✓ APPROVE"}
                      {currentReview.recommendation === Recommendation.REJECT &&
                        "✗ REJECT"}
                      {currentReview.recommendation === Recommendation.REVISE &&
                        "↻ REVISE"}
                    </span>
                    <p className="text-sm text-gray-600">
                      {currentReview.recommendation ===
                        Recommendation.APPROVE &&
                        "The reviewer recommends approving this application for funding."}
                      {currentReview.recommendation === Recommendation.REJECT &&
                        "The reviewer recommends rejecting this application."}
                      {currentReview.recommendation === Recommendation.REVISE &&
                        "The reviewer recommends requesting revisions before proceeding."}
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Scores Card */}
              {currentReview.scores && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Evaluation Scores
                  </h3>

                  <div className="space-y-4">
                    {/* Technical Score */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <svg
                              className="h-6 w-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              Technical Feasibility
                            </h4>
                            <p className="text-xs text-gray-500">
                              Assesses the technical viability and
                              implementation approach
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${getScoreColor(currentReview.scores.technical)}`}
                        >
                          <p className="text-2xl font-bold">
                            {currentReview.scores.technical}
                          </p>
                          <p className="text-xs">/ 100</p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${currentReview.scores.technical}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Market Score */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                            <svg
                              className="h-6 w-6 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              Market Potential
                            </h4>
                            <p className="text-xs text-gray-500">
                              Evaluates market opportunity and competitive
                              positioning
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${getScoreColor(currentReview.scores.market)}`}
                        >
                          <p className="text-2xl font-bold">
                            {currentReview.scores.market}
                          </p>
                          <p className="text-xs">/ 100</p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-600 transition-all"
                          style={{ width: `${currentReview.scores.market}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Financial Score */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                            <svg
                              className="h-6 w-6 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              Financial Viability
                            </h4>
                            <p className="text-xs text-gray-500">
                              Reviews budget, revenue model, and financial
                              sustainability
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${getScoreColor(currentReview.scores.financial)}`}
                        >
                          <p className="text-2xl font-bold">
                            {currentReview.scores.financial}
                          </p>
                          <p className="text-xs">/ 100</p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-purple-600 transition-all"
                          style={{
                            width: `${currentReview.scores.financial}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Team Score */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                            <svg
                              className="h-6 w-6 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              Team Capability
                            </h4>
                            <p className="text-xs text-gray-500">
                              Assesses team expertise, experience, and execution
                              capacity
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${getScoreColor(currentReview.scores.team)}`}
                        >
                          <p className="text-2xl font-bold">
                            {currentReview.scores.team}
                          </p>
                          <p className="text-xs">/ 100</p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-orange-600 transition-all"
                          style={{ width: `${currentReview.scores.team}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Innovation Score */}
                    <div className="pb-2">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
                            <svg
                              className="h-6 w-6 text-pink-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              Innovation & Impact
                            </h4>
                            <p className="text-xs text-gray-500">
                              Evaluates novelty, differentiation, and potential
                              impact
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${getScoreColor(currentReview.scores.innovation)}`}
                        >
                          <p className="text-2xl font-bold">
                            {currentReview.scores.innovation}
                          </p>
                          <p className="text-xs">/ 100</p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-pink-600 transition-all"
                          style={{
                            width: `${currentReview.scores.innovation}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="mt-6 rounded-lg border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            Overall Average Score
                          </h4>
                          <p className="text-sm text-gray-600">
                            Calculated from all evaluation criteria
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-indigo-600">
                            {(
                              (currentReview.scores.technical +
                                currentReview.scores.market +
                                currentReview.scores.financial +
                                currentReview.scores.team +
                                currentReview.scores.innovation) /
                              5
                            ).toFixed(1)}
                          </p>
                          <p className="text-sm text-gray-600">/ 100</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Budget Card */}
              {currentReview.suggestedBudget && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Suggested Budget
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {currentReview.suggestedBudget.currency}{" "}
                        {currentReview.suggestedBudget.amount.toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Recommended funding amount based on the review
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Info (if available) */}
              {currentReview.application && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Application Information
                  </h3>
                  <div className="space-y-2">
                    {currentReview.application.title && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Title
                        </p>
                        <p className="text-sm text-gray-900">
                          {currentReview.application.title}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Application ID
                        </p>
                        <p className="font-mono text-xs text-gray-700">
                          {currentReview.applicationId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Review ID
                        </p>
                        <p className="font-mono text-xs text-gray-700">
                          {currentReview.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isReviewLoading && !reviewError && !currentReview && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Review Not Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The review you're looking for doesn't exist or you don't have
                access to it.
              </p>
            </div>
          )}
        </div>
      </PMLayout>
    </AuthGuard>
  );
}
