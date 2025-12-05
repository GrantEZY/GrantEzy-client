/**
 * Co-applicant store using Zustand
 */
import { create } from "zustand";

import { coApplicantService } from "../services/co-applicant.service";
import {
  CoApplicantActions,
  CoApplicantState,
  InviteStatus,
} from "../types/co-applicant.types";

type CoApplicantStore = CoApplicantState & CoApplicantActions;

export const useCoApplicantStore = create<CoApplicantStore>()((set, _get) => ({
  // Initial state
  applicationDetails: null,
  tokenDetails: null,
  linkedProjects: [],
  isLoading: false,
  error: null,

  // Actions
  getApplicationDetails: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response =
        await coApplicantService.getApplicationDetails(applicationId);

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
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  getTokenDetails: async (token: string, slug: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log("[CoApplicantStore] Fetching token details:", {
        token,
        slug,
      });
      const response = await coApplicantService.getTokenDetails(token, slug);
      console.log("[CoApplicantStore] Token details response:", response);

      if (response.status === 200) {
        console.log(
          "[CoApplicantStore] ✅ Token details loaded successfully:",
          response.res,
        );
        set({
          tokenDetails: response.res,
          isLoading: false,
        });
      } else {
        const errorMsg = response.message || "Failed to fetch token details";
        console.error(
          "[CoApplicantStore] ❌ Token details failed:",
          errorMsg,
          response,
        );
        set({
          error: errorMsg,
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error(
        "[CoApplicantStore] ❌ Token details error:",
        errorMessage,
        error,
      );
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  updateInviteStatus: async (
    token: string,
    slug: string,
    status: InviteStatus.ACCEPTED | InviteStatus.REJECTED,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coApplicantService.updateInviteStatus(
        token,
        slug,
        status,
      );

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
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  getUserLinkedProjects: async (page: number, numberOfResults: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await coApplicantService.getUserLinkedProjects(
        page,
        numberOfResults,
      );

      if (response.status === 200 && response.res) {
        set({
          linkedProjects: response.res.applications || [],
          isLoading: false,
        });
      } else {
        set({
          error: response.message || "Failed to fetch linked projects",
          isLoading: false,
          linkedProjects: [],
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      set({
        error: errorMessage,
        isLoading: false,
        linkedProjects: [],
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
      linkedProjects: [],
      isLoading: false,
      error: null,
    });
  },
}));
