/**
 * useReviewer Hook
 * Custom hook for accessing reviewer store state and actions
 */
import { useReviewerStore } from "../store/reviewer.store";

export const useReviewer = () => {
  // State
  const reviews = useReviewerStore((state) => state.reviews);
  const currentReview = useReviewerStore((state) => state.currentReview);
  const reviewsPagination = useReviewerStore((state) => state.reviewsPagination);
  const isLoadingReviews = useReviewerStore((state) => state.isLoadingReviews);
  const reviewsError = useReviewerStore((state) => state.reviewsError);

  // Actions
  const getUserReviews = useReviewerStore((state) => state.getUserReviews);
  const getReviewDetails = useReviewerStore((state) => state.getReviewDetails);
  const submitReview = useReviewerStore((state) => state.submitReview);
  const updateInviteStatus = useReviewerStore((state) => state.updateInviteStatus);
  const clearReviews = useReviewerStore((state) => state.clearReviews);
  const clearCurrentReview = useReviewerStore((state) => state.clearCurrentReview);
  const clearError = useReviewerStore((state) => state.clearError);

  return {
    // State
    reviews,
    currentReview,
    reviewsPagination,
    isLoadingReviews,
    reviewsError,

    // Actions
    getUserReviews,
    getReviewDetails,
    submitReview,
    updateInviteStatus,
    clearReviews,
    clearCurrentReview,
    clearError,
  };
};
