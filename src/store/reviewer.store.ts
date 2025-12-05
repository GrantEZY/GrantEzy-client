/**
 * Reviewer Store - State management for reviewer module
 * Manages reviews, invitations, and reviewer-specific data
 */
import { create } from "zustand";
import { reviewerService } from "../services/reviewer.service";
import {
  Review,
  ReviewerState,
  PaginationMeta,
  GetUserReviewsRequest,
  GetReviewDetailsRequest,
  SubmitReviewRequest,
  UpdateInviteStatusRequest,
} from "../types/reviewer.types";

export const useReviewerStore = create<ReviewerState>((set, get) => ({
  // ============= State =============
  reviews: [],
  currentReview: null,
  reviewsPagination: null,
  isLoadingReviews: false,
  reviewsError: null,

  // ============= Actions =============

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
          reviewsError: response.message || "Failed to fetch reviews",
          isLoadingReviews: false,
        });
      }
    } catch (error) {
      set({
        reviewsError:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching reviews",
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
          isLoadingReviews: false,
        });
      } else {
        set({
          reviewsError:
            response.message || "Failed to fetch review details",
          isLoadingReviews: false,
        });
      }
    } catch (error) {
      set({
        reviewsError:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching review details",
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
          reviewsError: response.message || "Failed to submit review",
          isLoadingReviews: false,
        });
        return false;
      }
    } catch (error) {
      set({
        reviewsError:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting review",
        isLoadingReviews: false,
      });
      return false;
    }
  },

  /**
   * Update reviewer invite status (accept or reject)
   * Returns true if successful, throws error otherwise
   */
  updateInviteStatus: async (
    params: UpdateInviteStatusRequest,
  ): Promise<boolean> => {
    try {
      set({ isLoadingReviews: true, reviewsError: null });

      const response = await reviewerService.updateInviteStatus(params);

      if (response.status === 200 || response.status === 201) {
        set({ isLoadingReviews: false });
        return true;
      } else {
        const errorMsg = response.message || "Failed to update invite status";
        set({
          reviewsError: errorMsg,
          isLoadingReviews: false,
        });
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error
        ? error.message
        : "An error occurred while updating invite status";
      
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
    set({ currentReview: null });
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ reviewsError: null });
  },
}));
