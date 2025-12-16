/**
 * useReviewer Hook
 * Custom hook for accessing reviewer store state and actions
 */
import { useReviewerStore } from '../store/reviewer.store';

export const useReviewer = () => {
  // Application Review State
  const reviews = useReviewerStore((state) => state.reviews);
  const currentReview = useReviewerStore((state) => state.currentReview);
  const currentApplication = useReviewerStore((state) => state.currentApplication);
  const reviewsPagination = useReviewerStore((state) => state.reviewsPagination);
  const isLoadingReviews = useReviewerStore((state) => state.isLoadingReviews);
  const reviewsError = useReviewerStore((state) => state.reviewsError);

  // Project Review State
  const projectReviews = useReviewerStore((state) => state.projectReviews);
  const currentProjectReview = useReviewerStore((state) => state.currentProjectReview);
  const currentProjectReviewAssessment = useReviewerStore((state) => state.currentProjectReviewAssessment);
  const currentProjectReviewProject = useReviewerStore((state) => state.currentProjectReviewProject);
  const currentProjectReviewCriteria = useReviewerStore((state) => state.currentProjectReviewCriteria);
  const isLoadingProjectReviews = useReviewerStore((state) => state.isLoadingProjectReviews);
  const projectReviewsError = useReviewerStore((state) => state.projectReviewsError);

  // Application Review Actions
  const getUserReviews = useReviewerStore((state) => state.getUserReviews);
  const getReviewDetails = useReviewerStore((state) => state.getReviewDetails);
  const submitReview = useReviewerStore((state) => state.submitReview);
  const updateInviteStatus = useReviewerStore((state) => state.updateInviteStatus);
  const clearReviews = useReviewerStore((state) => state.clearReviews);
  const clearCurrentReview = useReviewerStore((state) => state.clearCurrentReview);
  const clearError = useReviewerStore((state) => state.clearError);

  // Project Review Actions
  const getUserProjectReviews = useReviewerStore((state) => state.getUserProjectReviews);
  const getProjectReviewDetails = useReviewerStore((state) => state.getProjectReviewDetails);
  const submitProjectReview = useReviewerStore((state) => state.submitProjectReview);
  const updateProjectReviewInviteStatus = useReviewerStore((state) => state.updateProjectReviewInviteStatus);
  const clearProjectReviews = useReviewerStore((state) => state.clearProjectReviews);
  const clearCurrentProjectReview = useReviewerStore((state) => state.clearCurrentProjectReview);

  return {
    // Application Review State
    reviews,
    currentReview,
    currentApplication,
    reviewsPagination,
    isLoadingReviews,
    reviewsError,

    // Project Review State
    projectReviews,
    currentProjectReview,
    currentProjectReviewAssessment,
    currentProjectReviewProject,
    currentProjectReviewCriteria,
    isLoadingProjectReviews,
    projectReviewsError,

    // Application Review Actions
    getUserReviews,
    getReviewDetails,
    submitReview,
    updateInviteStatus,
    clearReviews,
    clearCurrentReview,
    clearError,

    // Project Review Actions
    getUserProjectReviews,
    getProjectReviewDetails,
    submitProjectReview,
    updateProjectReviewInviteStatus,
    clearProjectReviews,
    clearCurrentProjectReview,
  };
};
