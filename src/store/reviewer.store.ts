/**
 * Reviewer Store - State management for reviewer module
 * Manages reviews, invitations, and reviewer-specific data
 */
import { create } from 'zustand';

import { reviewerService } from '../services/reviewer.service';
import {
  GetReviewDetailsRequest,
  GetUserReviewsRequest,
  ReviewerState,
  SubmitReviewRequest,
  UpdateInviteStatusRequest,
} from '../types/reviewer.types';

export const useReviewerStore = create<ReviewerState>((set, get) => ({
  // ============= Application Reviews State =============
  reviews: [],
  currentReview: null,
  currentApplication: null,
  reviewsPagination: null,
  isLoadingReviews: false,
  reviewsError: null,

  // ============= Project Reviews State =============
  projectReviews: [],
  currentProjectReview: null,
  currentProjectReviewAssessment: null,
  currentProjectReviewProject: null,
  currentProjectReviewCriteria: null,
  isLoadingProjectReviews: false,
  projectReviewsError: null,

  // ============= Application Review Actions =============

  /**
   * Get all reviews submitted by the current reviewer
   */
  getUserReviews: async (params: GetUserReviewsRequest) => {
    try {
      set({ isLoadingReviews: true, reviewsError: null });

      const response = await reviewerService.getUserReviews(params);

      if (response.status === 200 && response.res) {
        set({
          reviews: response.res.reviews || [],
          isLoadingReviews: false,
        });
      } else {
        set({
          reviewsError: response.message || 'Failed to fetch reviews',
          isLoadingReviews: false,
        });
      }
    } catch (error) {
      set({
        reviewsError:
          error instanceof Error ? error.message : 'An error occurred while fetching reviews',
        isLoadingReviews: false,
      });
    }
  },

  /**
   * Get detailed information about a specific review
   */
  getReviewDetails: async (params: GetReviewDetailsRequest) => {
    try {
      set({ isLoadingReviews: true, reviewsError: null });

      const response = await reviewerService.getReviewDetails(params);

      if (response.status === 200 && response.res) {
        set({
          currentReview: response.res.review,
          currentApplication: response.res.application,
          isLoadingReviews: false,
        });
      } else {
        set({
          reviewsError: response.message || 'Failed to fetch review details',
          isLoadingReviews: false,
        });
      }
    } catch (error) {
      set({
        reviewsError:
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching review details',
        isLoadingReviews: false,
      });
    }
  },

  /**
   * Submit a review for an application
   * Returns true if successful, false otherwise
   */
  submitReview: async (params: SubmitReviewRequest): Promise<boolean> => {
    try {
      set({ isLoadingReviews: true, reviewsError: null });

      const response = await reviewerService.submitReview(params);

      if (response.status === 200 || response.status === 201) {
        set({ isLoadingReviews: false });

        // Optionally refresh the reviews list
        const currentParams = {
          page: 1,
          numberOfResults: 10,
        };
        get().getUserReviews(currentParams);

        return true;
      } else {
        set({
          reviewsError: response.message || 'Failed to submit review',
          isLoadingReviews: false,
        });
        return false;
      }
    } catch (error) {
      set({
        reviewsError:
          error instanceof Error ? error.message : 'An error occurred while submitting review',
        isLoadingReviews: false,
      });
      return false;
    }
  },

  /**
   * Update reviewer invite status (accept or reject)
   * Returns true if successful, throws error otherwise
   */
  updateInviteStatus: async (params: UpdateInviteStatusRequest): Promise<boolean> => {
    try {
      set({ isLoadingReviews: true, reviewsError: null });

      const response = await reviewerService.updateInviteStatus(params);

      if (response.status === 200 || response.status === 201) {
        set({ isLoadingReviews: false });
        return true;
      } else {
        const errorMsg = response.message || 'Failed to update invite status';
        set({
          reviewsError: errorMsg,
          isLoadingReviews: false,
        });
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'An error occurred while updating invite status';

      set({
        reviewsError: errorMsg,
        isLoadingReviews: false,
      });
      throw error;
    }
  },

  // ============= Utility Actions =============

  /**
   * Clear reviews list
   */
  clearReviews: () => {
    set({ reviews: [], reviewsPagination: null });
  },

  /**
   * Clear current review
   */
  clearCurrentReview: () => {
    set({ currentReview: null, currentApplication: null });
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ reviewsError: null, projectReviewsError: null });
  },

  // ============= Project Review Actions =============

  /**
   * Get all project reviews assigned to the current reviewer
   */
  getUserProjectReviews: async (params: any) => {
    try {
      set({ isLoadingProjectReviews: true, projectReviewsError: null });

      const response = await reviewerService.getUserProjectReviews(params);

      if (response.status === 200 && response.res) {
        set({
          projectReviews: response.res.reviews || [],
          isLoadingProjectReviews: false,
        });
      } else {
        set({
          projectReviewsError: response.message || 'Failed to fetch project reviews',
          isLoadingProjectReviews: false,
        });
      }
    } catch (error) {
      set({
        projectReviewsError:
          error instanceof Error ? error.message : 'An error occurred while fetching project reviews',
        isLoadingProjectReviews: false,
      });
    }
  },

  /**
   * Get detailed information about a specific project review
   */
  getProjectReviewDetails: async (params: any) => {
    try {
      set({ isLoadingProjectReviews: true, projectReviewsError: null });

      const response = await reviewerService.getProjectReviewDetails(params);

      if (response.status === 200 && response.res) {
        set({
          currentProjectReview: response.res.review,
          currentProjectReviewAssessment: response.res.assessment,
          currentProjectReviewProject: response.res.project,
          currentProjectReviewCriteria: response.res.criteria,
          isLoadingProjectReviews: false,
        });
      } else {
        set({
          projectReviewsError: response.message || 'Failed to fetch project review details',
          isLoadingProjectReviews: false,
        });
      }
    } catch (error) {
      set({
        projectReviewsError:
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching project review details',
        isLoadingProjectReviews: false,
      });
    }
  },

  /**
   * Submit a review for a project assessment
   */
  submitProjectReview: async (params: any): Promise<boolean> => {
    try {
      set({ isLoadingProjectReviews: true, projectReviewsError: null });

      const response = await reviewerService.submitProjectReview(params);

      if (response.status === 200 || response.status === 201) {
        set({ isLoadingProjectReviews: false });

        // Optionally refresh the project reviews list
        const currentParams = {
          page: 1,
          numberOfResults: 10,
        };
        get().getUserProjectReviews(currentParams);

        return true;
      } else {
        set({
          projectReviewsError: response.message || 'Failed to submit project review',
          isLoadingProjectReviews: false,
        });
        return false;
      }
    } catch (error) {
      set({
        projectReviewsError:
          error instanceof Error ? error.message : 'An error occurred while submitting project review',
        isLoadingProjectReviews: false,
      });
      return false;
    }
  },

  /**
   * Update project review invite status (accept or reject)
   */
  updateProjectReviewInviteStatus: async (params: any): Promise<boolean> => {
    try {
      set({ isLoadingProjectReviews: true, projectReviewsError: null });

      const response = await reviewerService.updateProjectReviewInviteStatus(params);

      if (response.status === 200 || response.status === 201) {
        set({ isLoadingProjectReviews: false });
        return true;
      } else {
        const errorMsg = response.message || 'Failed to update project review invite status';
        set({
          projectReviewsError: errorMsg,
          isLoadingProjectReviews: false,
        });
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : 'An error occurred while updating project review invite status';

      set({
        projectReviewsError: errorMsg,
        isLoadingProjectReviews: false,
      });
      throw error;
    }
  },

  /**
   * Clear project reviews list
   */
  clearProjectReviews: () => {
    set({ projectReviews: [] });
  },

  /**
   * Clear current project review
   */
  clearCurrentProjectReview: () => {
    set({
      currentProjectReview: null,
      currentProjectReviewAssessment: null,
      currentProjectReviewProject: null,
      currentProjectReviewCriteria: null,
    });
  },
}));
