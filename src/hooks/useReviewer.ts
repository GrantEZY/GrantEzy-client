/**
 * useReviewer Hook
 * Custom hook for accessing reviewer store state and actions
 */
import { useReviewerStore } from '../store/reviewer.store';

export const useReviewer = () => {
  // Application Reviews State
  const reviews = useReviewerStore((state) => state.reviews);
  const currentReview = useReviewerStore((state) => state.currentReview);
  const currentApplication = useReviewerStore((state) => state.currentApplication);
  const reviewsPagination = useReviewerStore((state) => state.reviewsPagination);
  const isLoadingReviews = useReviewerStore((state) => state.isLoadingReviews);
  const reviewsError = useReviewerStore((state) => state.reviewsError);

  // Project Assessment Reviews State
  const projectReviews = useReviewerStore((state) => state.projectReviews);
  const currentProjectReview = useReviewerStore((state) => state.currentProjectReview);
  const currentAssessment = useReviewerStore((state) => state.currentAssessment);
  const projectReviewsPagination = useReviewerStore((state) => state.projectReviewsPagination);
  const isLoadingProjectReviews = useReviewerStore((state) => state.isLoadingProjectReviews);
  const projectReviewsError = useReviewerStore((state) => state.projectReviewsError);

  // Application Review Actions
  const getUserReviews = useReviewerStore((state) => state.getUserReviews);
  const getReviewDetails = useReviewerStore((state) => state.getReviewDetails);
  const submitReview = useReviewerStore((state) => state.submitReview);
  const updateInviteStatus = useReviewerStore((state) => state.updateInviteStatus);

  // Project Assessment Review Actions
  const getUserProjectReviews = useReviewerStore((state) => state.getUserProjectReviews);
  const getProjectReviewDetails = useReviewerStore((state) => state.getProjectReviewDetails);
  const submitProjectAssessmentReview = useReviewerStore(
    (state) => state.submitProjectAssessmentReview
  );
  const submitProjectAssessmentReviewInviteStatus = useReviewerStore(
    (state) => state.submitProjectAssessmentReviewInviteStatus
  );

  // Utility Actions
  const clearReviews = useReviewerStore((state) => state.clearReviews);
  const clearCurrentReview = useReviewerStore((state) => state.clearCurrentReview);
  const clearProjectReviews = useReviewerStore((state) => state.clearProjectReviews);
  const clearCurrentProjectReview = useReviewerStore((state) => state.clearCurrentProjectReview);
  const clearError = useReviewerStore((state) => state.clearError);

  // Computed values
  const hasReviews = reviews.length > 0;
  const hasProjectReviews = projectReviews.length > 0;
  const isLoading = isLoadingReviews || isLoadingProjectReviews;
  const hasError = reviewsError !== null || projectReviewsError !== null;

  return {
    // Application Reviews State
    reviews,
    currentReview,
    currentApplication,
    reviewsPagination,
    isLoadingReviews,
    reviewsError,

    // Project Assessment Reviews State
    projectReviews,
    currentProjectReview,
    currentAssessment,
    projectReviewsPagination,
    isLoadingProjectReviews,
    projectReviewsError,

    // Application Review Actions
    getUserReviews,
    getReviewDetails,
    submitReview,
    updateInviteStatus,

    // Project Assessment Review Actions
    getUserProjectReviews,
    getProjectReviewDetails,
    submitProjectAssessmentReview,
    submitProjectAssessmentReviewInviteStatus,

    // Utility Actions
    clearReviews,
    clearCurrentReview,
    clearProjectReviews,
    clearCurrentProjectReview,
    clearError,

    // Computed values
    hasReviews,
    hasProjectReviews,
    isLoading,
    hasError,
  };
};
