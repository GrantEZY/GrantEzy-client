/**
 * Co-applicant store using Zustand
 */
import { create } from "zustand";
import { coApplicantService } from "../services/co-applicant.service";
import {
  CoApplicantState,
  CoApplicantActions,
  ApplicationDetails,
  InviteStatus,
} from "../types/co-applicant.types";

type CoApplicantStore = CoApplicantState & CoApplicantActions;

export const useCoApplicantStore = create<CoApplicantStore>()((set, get) => ({
  // Initial state
  applicationDetails: null,
  tokenDetails: null,
  isLoading: false,
  error: null,

  // Actions
  getApplicationDetails: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coApplicantService.getApplicationDetails(applicationId);
      
      if (response.status === 200) {
        set({
          applicationDetails: response.res.application,
          isLoading: false,
        });
      } else {
        set({
          error: response.message || "Failed to fetch application details",
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  getTokenDetails: async (token: string, slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coApplicantService.getTokenDetails(token, slug);
      
      if (response.status === 200) {
        set({
          tokenDetails: response.res,
          isLoading: false,
        });
      } else {
        set({
          error: response.message || "Failed to fetch token details",
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  updateInviteStatus: async (
    token: string, 
    slug: string, 
    status: InviteStatus.ACCEPTED | InviteStatus.REJECTED
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coApplicantService.updateInviteStatus(token, slug, status);
      
      if (response.status === 200) {
        set({
          isLoading: false,
        });
        // Optionally refresh token details or application details here
        // get().getTokenDetails(token, slug);
      } else {
        set({
          error: response.message || "Failed to update invite status",
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearState: () => {
    set({
      applicationDetails: null,
      tokenDetails: null,
      isLoading: false,
      error: null,
    });
  },
}));