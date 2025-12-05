"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/AuthGuard";
import PMLayout from "@/components/layout/PMLayout";
import InviteReviewerModal from "@/components/pm/InviteReviewerModal";
import { usePm } from "@/hooks/usePm";
import { ReviewStatus, Recommendation } from "@/types/reviewer.types";

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cycleSlug = params.cycleSlug as string;
  const applicationSlug = params.applicationSlug as string;

  const {
    currentApplication,
    isApplicationLoading,
    getApplicationDetails,
    clearApplication,
    getApplicationReviews,
    reviews,
    pendingInvites,
    isReviewsLoading,
  } = usePm();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [recommendationFilter, setRecommendationFilter] = useState<string>("ALL");

  useEffect(() => {
    if (cycleSlug && applicationSlug) {
      getApplicationDetails({ cycleSlug, applicationSlug });
      getApplicationReviews({ cycleSlug, applicationSlug, page: 1, numberOfResults: 50 });
    }

    return () => {
      clearApplication();
    };
  }, [cycleSlug, applicationSlug, getApplicationDetails, clearApplication, getApplicationReviews]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Application Details Page State:', {
      reviews: reviews?.length || 0,
      pendingInvites: pendingInvites?.length || 0,
      pendingInvitesData: pendingInvites,
      isLoading: isReviewsLoading
    });
  }, [reviews, pendingInvites, isReviewsLoading]);

  // Calculate review analytics
  const reviewAnalytics = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return null;
    }

    const completedReviews = reviews.filter((r: any) => 
      r.status === ReviewStatus.COMPLETED || (r.recommendation && r.scores)
    );

    const totalReviews = reviews.length;
    const completedCount = completedReviews.length;
    const inProgressCount = reviews.filter((r: any) => 
      r.status === ReviewStatus.IN_PROGRESS && !r.recommendation
    ).length;

    // Calculate average scores
    const scoresSum = completedReviews.reduce((acc: any, review: any) => {
      if (review.scores) {
        return {
          technical: acc.technical + (review.scores.technical || 0),
          market: acc.market + (review.scores.market || 0),
          financial: acc.financial + (review.scores.financial || 0),
          team: acc.team + (review.scores.team || 0),
          innovation: acc.innovation + (review.scores.innovation || 0),
        };
      }
      return acc;
    }, { technical: 0, market: 0, financial: 0, team: 0, innovation: 0 });

    const avgScores = completedCount > 0 ? {
      technical: (scoresSum.technical / completedCount).toFixed(1),
      market: (scoresSum.market / completedCount).toFixed(1),
      financial: (scoresSum.financial / completedCount).toFixed(1),
      team: (scoresSum.team / completedCount).toFixed(1),
      innovation: (scoresSum.innovation / completedCount).toFixed(1),
      overall: ((scoresSum.technical + scoresSum.market + scoresSum.financial + scoresSum.team + scoresSum.innovation) / (completedCount * 5)).toFixed(1),
    } : null;

    // Calculate recommendation distribution
    const recommendations = completedReviews.reduce((acc: any, review: any) => {
      if (review.recommendation) {
        acc[review.recommendation] = (acc[review.recommendation] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalReviews,
      completedCount,
      inProgressCount,
      completionRate: totalReviews > 0 ? ((completedCount / totalReviews) * 100).toFixed(0) : 0,
      avgScores,
      recommendations,
    };
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    
    return reviews.filter((review: any) => {
      const statusMatch = statusFilter === "ALL" || 
        (statusFilter === "COMPLETED" && (review.status === ReviewStatus.COMPLETED || (review.recommendation && review.scores))) ||
        (statusFilter === "IN_PROGRESS" && review.status === ReviewStatus.IN_PROGRESS && !review.recommendation);
      
      const recommendationMatch = recommendationFilter === "ALL" || review.recommendation === recommendationFilter;
      
      return statusMatch && recommendationMatch;
    });
  }, [reviews, statusFilter, recommendationFilter]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "REVISION_REQUESTED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendationBadgeClass = (recommendation: string) => {
    switch (recommendation) {
      case "APPROVE":
        return "bg-green-100 text-green-800";
      case "REJECT":
        return "bg-red-100 text-red-800";
      case "REVISE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuthGuard>
      <PMLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <button
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() => router.push(`/pm/cycles/${cycleSlug}`)}
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
              Back to Cycle
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentApplication?.basicInfo?.title ||
                    "Application Details"}
                </h1>
                <p className="mt-2 text-gray-600">
                  Review application details and manage reviewers
                </p>
              </div>
              <button
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setIsInviteModalOpen(true)}
                type="button"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Invite Reviewer
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isApplicationLoading && (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading application details...
                </p>
              </div>
            </div>
          )}

          {/* Application Content */}
          {!isApplicationLoading && currentApplication && (
            <>
              {/* Status Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Application Status
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClass(currentApplication.status)}`}
                    >
                      {currentApplication.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Submitted On
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(
                        currentApplication.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Last Updated
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(
                        currentApplication.updatedAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Applicant Info */}
              {currentApplication.applicant && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Applicant Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.applicant.firstName}{" "}
                        {currentApplication.applicant.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.applicant.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              {currentApplication.basicInfo && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Project Overview
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Summary
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.basicInfo.summary}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Problem Statement
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.basicInfo.problem}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Proposed Solution
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.basicInfo.solution}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Innovation
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {currentApplication.basicInfo.innovation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="space-y-6">
                {/* Review Analytics Card */}
                {reviewAnalytics && reviewAnalytics.completedCount > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Analytics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      {/* Summary Stats */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{reviewAnalytics.totalReviews}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{reviewAnalytics.completedCount}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">{reviewAnalytics.inProgressCount}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{reviewAnalytics.completionRate}%</p>
                      </div>
                    </div>

                    {/* Average Scores */}
                    {reviewAnalytics.avgScores && (
                      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Average Scores (out of 100)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                          <div>
                            <p className="text-xs text-gray-600">Technical</p>
                            <p className="text-lg font-bold text-blue-600">{reviewAnalytics.avgScores.technical}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Market</p>
                            <p className="text-lg font-bold text-green-600">{reviewAnalytics.avgScores.market}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Financial</p>
                            <p className="text-lg font-bold text-purple-600">{reviewAnalytics.avgScores.financial}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Team</p>
                            <p className="text-lg font-bold text-orange-600">{reviewAnalytics.avgScores.team}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Innovation</p>
                            <p className="text-lg font-bold text-pink-600">{reviewAnalytics.avgScores.innovation}</p>
                          </div>
                          <div className="border-l-2 border-gray-200 pl-3">
                            <p className="text-xs text-gray-600 font-semibold">Overall</p>
                            <p className="text-xl font-bold text-indigo-600">{reviewAnalytics.avgScores.overall}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendation Distribution */}
                    {Object.keys(reviewAnalytics.recommendations).length > 0 && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommendations</h4>
                        <div className="flex flex-wrap gap-3">
                          {reviewAnalytics.recommendations.APPROVE && (
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                                ✓ Approve: {reviewAnalytics.recommendations.APPROVE}
                              </span>
                            </div>
                          )}
                          {reviewAnalytics.recommendations.REJECT && (
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                                ✗ Reject: {reviewAnalytics.recommendations.REJECT}
                              </span>
                            </div>
                          )}
                          {reviewAnalytics.recommendations.REVISE && (
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                                ↻ Revise: {reviewAnalytics.recommendations.REVISE}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pending Invites Section */}
                {!isReviewsLoading && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6">
                    <h3 className="font-semibold text-blue-900">Debug Info</h3>
                    <p className="text-sm text-blue-700">
                      Pending Invites Count: {pendingInvites?.length || 0}
                    </p>
                    <p className="text-sm text-blue-700">
                      Reviews Count: {reviews?.length || 0}
                    </p>
                    <p className="text-sm text-blue-700">
                      Is Loading: {isReviewsLoading ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}
                
                {pendingInvites && pendingInvites.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 shadow-sm mb-6">
                    <div className="border-b border-amber-200 px-6 py-4">
                      <h2 className="text-lg font-semibold text-amber-900">
                        Pending Invitations ({pendingInvites.length})
                      </h2>
                      <p className="text-sm text-amber-700 mt-1">
                        Reviewers who have been invited but haven't accepted yet
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {pendingInvites.map((invite) => (
                          <div
                            key={invite.id}
                            className="flex items-center justify-between rounded-lg border border-amber-200 bg-white p-4"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                <svg
                                  className="h-5 w-5 text-amber-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{invite.email}</p>
                                <p className="text-xs text-gray-500">
                                  Invited {new Date(invite.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                {invite.status === "SENT" ? "⏳ Pending" : invite.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Reviews ({filteredReviews?.length || 0})
                      </h2>
                      
                      {/* Filters */}
                      {reviews && reviews.length > 0 && (
                        <div className="flex items-center space-x-3">
                          <select
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onChange={(e) => setStatusFilter(e.target.value)}
                            value={statusFilter}
                          >
                            <option value="ALL">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="IN_PROGRESS">In Progress</option>
                          </select>
                          
                          <select
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onChange={(e) => setRecommendationFilter(e.target.value)}
                            value={recommendationFilter}
                          >
                            <option value="ALL">All Recommendations</option>
                            <option value="APPROVE">Approve</option>
                            <option value="REJECT">Reject</option>
                            <option value="REVISE">Revise</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                {isReviewsLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredReviews && filteredReviews.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredReviews.map((review: any) => {
                      const isCompleted = review.status === ReviewStatus.COMPLETED || (review.recommendation && review.scores);
                      const displayStatus = isCompleted ? "COMPLETED" : "IN_PROGRESS";
                      
                      return (
                        <div key={review.id} className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {review.reviewer?.email || review.reviewer?.firstName && review.reviewer?.lastName 
                                    ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
                                    : "Anonymous Reviewer"}
                                </p>
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                    displayStatus === "COMPLETED" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {displayStatus}
                                </span>
                                {review.recommendation && (
                                  <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRecommendationBadgeClass(review.recommendation)}`}
                                  >
                                    {review.recommendation}
                                  </span>
                                )}
                              </div>
                              
                              {/* Show scores if completed */}
                              {review.scores && (
                                <div className="mt-3 grid grid-cols-5 gap-2">
                                  <div className="bg-blue-50 rounded px-2 py-1">
                                    <p className="text-xs text-gray-600">Technical</p>
                                    <p className="text-sm font-semibold text-blue-700">{review.scores.technical}</p>
                                  </div>
                                  <div className="bg-green-50 rounded px-2 py-1">
                                    <p className="text-xs text-gray-600">Market</p>
                                    <p className="text-sm font-semibold text-green-700">{review.scores.market}</p>
                                  </div>
                                  <div className="bg-purple-50 rounded px-2 py-1">
                                    <p className="text-xs text-gray-600">Financial</p>
                                    <p className="text-sm font-semibold text-purple-700">{review.scores.financial}</p>
                                  </div>
                                  <div className="bg-orange-50 rounded px-2 py-1">
                                    <p className="text-xs text-gray-600">Team</p>
                                    <p className="text-sm font-semibold text-orange-700">{review.scores.team}</p>
                                  </div>
                                  <div className="bg-pink-50 rounded px-2 py-1">
                                    <p className="text-xs text-gray-600">Innovation</p>
                                    <p className="text-sm font-semibold text-pink-700">{review.scores.innovation}</p>
                                  </div>
                                </div>
                              )}

                              {/* Show suggested budget if available */}
                              {review.suggestedBudget && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500">Suggested Budget</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {review.suggestedBudget.currency} {review.suggestedBudget.amount.toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                              {isCompleted && (
                                <Link
                                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                  href={`/pm/cycles/${cycleSlug}/applications/${applicationSlug}/reviews/${review.slug}`}
                                >
                                  View Details
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="p-12 text-center">
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
                      No reviews match your filters
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your filter criteria.
                    </p>
                    <button
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        setStatusFilter("ALL");
                        setRecommendationFilter("ALL");
                      }}
                      type="button"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="p-12 text-center">
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
                      No Reviews Yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Invite reviewers to start the review process.
                    </p>
                    <div className="mt-6">
                      <button
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        onClick={() => setIsInviteModalOpen(true)}
                        type="button"
                      >
                        Invite Reviewer
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </>
          )}

          {/* Empty State - No application loaded */}
          {!isApplicationLoading && !currentApplication && (
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
                Application Not Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The application you're looking for doesn't exist or you don't
                have access to it.
              </p>
              <div className="mt-6">
                <Link
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  href={`/pm/cycles/${cycleSlug}`}
                >
                  Back to Cycle
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Invite Reviewer Modal */}
        {currentApplication && (
          <InviteReviewerModal
            applicationId={currentApplication.id}
            applicationTitle={currentApplication.basicInfo?.title}
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onSuccess={() => {
              // Refresh the reviews list after successful invite
              getApplicationReviews({ 
                cycleSlug, 
                applicationSlug, 
                page: 1, 
                numberOfResults: 50 
              });
            }}
          />
        )}
      </PMLayout>
    </AuthGuard>
  );
}
