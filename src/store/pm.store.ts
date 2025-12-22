/**
 * PM (Program Manager) store using Zustand for PM-related state management
 */
import { create } from 'zustand';

import { pmService } from '../services/pm.service';
import { PaginationMeta } from '../types/admin.types';
import { Program } from '../types/gcv.types';
import {
  CreateCycleRequest,
  Cycle,
  CycleApplication,
  CycleStatus,
  DeleteCycleRequest,
  GetApplicationReviewsRequest,
  GetCycleDetailsRequest,
  GetPMApplicationDetailsRequest,
  GetProgramCyclesRequest,
  GetReviewDetailsRequest,
  InviteReviewerRequest,
  PendingInvite,
  Review,
  ReviewDetails,
  UpdateCycleRequest,
} from '../types/pm.types';

interface PMState {
  // Program state
  program: Program | null;
  isProgramLoading: boolean;
  programError: string | null;

  // Cycles state
  cycles: Cycle[];
  cyclesPagination: PaginationMeta | null;
  isCyclesLoading: boolean;
  cyclesError: string | null;

  // Current cycle details
  currentCycle: Cycle | null;
  currentCycleApplications: CycleApplication[];
  isCycleDetailsLoading: boolean;

  // Current application details
  currentApplication: CycleApplication | null;
  isApplicationLoading: boolean;

  // Reviews state
  reviews: Review[];
  pendingInvites: PendingInvite[];
  reviewsPagination: PaginationMeta | null;
  isReviewsLoading: boolean;
  reviewsError: string | null;

  // Current review details
  currentReview: ReviewDetails | null;
  isReviewLoading: boolean;

  // Program assignment state
  isProgramAssigned: boolean | null; // null = unknown, true = assigned, false = not assigned

  // Current selected program for cycle management
  selectedProgramId: string | null;
}

interface PMActions {
  // Program actions
  getAssignedProgram: () => Promise<void>;
  clearProgram: () => void;

  // Program selection
  setSelectedProgramId: (programId: string | null) => void;

  // Cycle actions
  createCycle: (data: CreateCycleRequest) => Promise<boolean>;
  getProgramCycles: (params: GetProgramCyclesRequest) => Promise<void>;
  getCycleDetails: (params: GetCycleDetailsRequest) => Promise<void>;
  updateCycle: (data: UpdateCycleRequest) => Promise<boolean>;
  deleteCycle: (data: DeleteCycleRequest) => Promise<boolean>;
  openCycleForApplication: (cycleSlug: string) => Promise<boolean>;
  closeCycleForApplication: (cycleSlug: string) => Promise<boolean>;
  archiveCycle: (cycleSlug: string) => Promise<boolean>;
  clearCycles: () => void;
  setCyclesError: (error: string | null) => void;

  // Application actions
  getApplicationDetails: (params: GetPMApplicationDetailsRequest) => Promise<void>;
  clearApplication: () => void;

  // Reviewer actions
  inviteReviewer: (data: InviteReviewerRequest) => Promise<boolean>;

  // Review actions
  getApplicationReviews: (params: GetApplicationReviewsRequest) => Promise<void>;
  getReviewDetails: (params: GetReviewDetailsRequest) => Promise<void>;
  clearReviews: () => void;
  clearReview: () => void;

  // Clear all
  clearAll: () => void;
}

type PMStore = PMState & PMActions;

export const usePMStore = create<PMStore>((set, get) => ({
  // Initial state
  program: null,
  isProgramLoading: false,
  programError: null,
  cycles: [],
  cyclesPagination: null,
  isCyclesLoading: false,
  cyclesError: null,
  currentCycle: null,
  currentCycleApplications: [],
  isCycleDetailsLoading: false,
  currentApplication: null,
  isApplicationLoading: false,
  reviews: [],
  pendingInvites: [],
  reviewsPagination: null,
  isReviewsLoading: false,
  reviewsError: null,
  currentReview: null,
  isReviewLoading: false,
  isProgramAssigned: null,
  selectedProgramId: null,

  // ============= Program Actions =============

  getAssignedProgram: async () => {
    set({ isProgramLoading: true, programError: null });
    try {
      const response = await pmService.getAssignedProgram();

      if (response.status === 200) {
        set({
          program: response.res.program,
          isProgramLoading: false,
          programError: null,
          isProgramAssigned: true,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch assigned program');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch assigned program';
      let isNotAssigned = false;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
        // Check if this is a "not assigned" error (403 with specific message)
        if (errorMessage.includes('Only Program Manager can access the Program')) {
          isNotAssigned = true;
        }
      }

      set({
        program: null,
        isProgramLoading: false,
        programError: errorMessage,
        isProgramAssigned: isNotAssigned ? false : null,
      });

      console.error('Get assigned program error:', error);
      throw error;
    }
  },

  clearProgram: () => {
    set({
      program: null,
      isProgramLoading: false,
      programError: null,
      isProgramAssigned: null,
    });
  },

  // ============= Program Selection =============

  setSelectedProgramId: (programId: string | null) => {
    set({ selectedProgramId: programId });
    // Clear cycles when switching programs
    if (programId !== get().selectedProgramId) {
      get().clearCycles();
    }
  },

  // ============= Cycle Actions =============

  createCycle: async (data: CreateCycleRequest) => {
    set({ isCyclesLoading: true, cyclesError: null });
    try {
      const response = await pmService.createCycle(data);

      if (response.status === 201) {
        set({ isCyclesLoading: false, cyclesError: null });

        // Refresh cycles list after creating a new cycle
        await get().getProgramCycles({
          page: 1,
          numberOfResults: 10,
        });

        return true;
      } else {
        throw new Error(response.message || 'Failed to create cycle');
      }
    } catch (error) {
      let errorMessage = 'Failed to create cycle';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      set({
        isCyclesLoading: false,
        cyclesError: errorMessage,
      });

      console.error('Create cycle error:', error);
      return false;
    }
  },

  getProgramCycles: async (params: GetProgramCyclesRequest) => {
    set({ isCyclesLoading: true, cyclesError: null });
    try {
      const response = await pmService.getProgramCycles(params);

      if (response.status === 200) {
        const { cycles, totalNumberOfCycles: total } = response.res;

        // Calculate pagination
        const pagination: PaginationMeta = {
          page: params.page,
          limit: params.numberOfResults,
          total,
          totalPages: Math.ceil(total / params.numberOfResults),
        };

        set({
          cycles,
          cyclesPagination: pagination,
          isCyclesLoading: false,
          cyclesError: null,
          isProgramAssigned: true, // If we get cycles successfully, PM is assigned to a program
        });
      } else {
        throw new Error(response.message || 'Failed to fetch program cycles');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch program cycles';
      let isNotAssigned = false;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
        // Check if this is a "not assigned" error (403 with specific message)
        if (errorMessage.includes('Only Program Manager can access the Program')) {
          isNotAssigned = true;
        }
      }

      set({
        program: null,
        cycles: [],
        cyclesPagination: null,
        isCyclesLoading: false,
        cyclesError: errorMessage,
        isProgramAssigned: isNotAssigned ? false : null, // false if not assigned, null if other error
      });

      console.error('Get program cycles error:', error);
      throw error;
    }
  },

  updateCycle: async (data: UpdateCycleRequest) => {
    set({ isCyclesLoading: true, cyclesError: null });
    try {
      const response = await pmService.updateCycle(data);

      if (response.status === 200) {
        set({ isCyclesLoading: false, cyclesError: null });

        // Update the cycle in the local state
        const { cycles } = get();
        const updatedCycles = cycles.map((cycle) =>
          cycle.id === data.id ? { ...cycle, ...data, updatedAt: new Date().toISOString() } : cycle
        );

        set({ cycles: updatedCycles });
        return true;
      } else {
        throw new Error(response.message || 'Failed to update cycle');
      }
    } catch (error) {
      let errorMessage = 'Failed to update cycle';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      set({
        isCyclesLoading: false,
        cyclesError: errorMessage,
      });

      console.error('Update cycle error:', error);
      return false;
    }
  },

  deleteCycle: async (data: DeleteCycleRequest) => {
    set({ isCyclesLoading: true, cyclesError: null });
    try {
      const response = await pmService.deleteCycle(data);

      if (response.status === 200) {
        set({ isCyclesLoading: false, cyclesError: null });

        // Remove the cycle from local state
        const { cycles } = get();
        const updatedCycles = cycles.filter((cycle) => cycle.id !== data.cycleId);

        set({ cycles: updatedCycles });
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete cycle');
      }
    } catch (error) {
      let errorMessage = 'Failed to delete cycle';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      set({
        isCyclesLoading: false,
        cyclesError: errorMessage,
      });

      console.error('Delete cycle error:', error);
      return false;
    }
  },

  openCycleForApplication: async (cycleId: string) => {
    set({ isCyclesLoading: true, cyclesError: null });
    try {
      const response = await pmService.openCycleForApplication(cycleId);

      if (response.status === 200) {
        // Update the cycle status in local state
        const { cycles, currentCycle } = get();
        const updatedCycles = cycles.map((cycle) =>
          cycle.id === cycleId ? { ...cycle, status: CycleStatus.OPEN } : cycle
        );

        set({
          cycles: updatedCycles,
          currentCycle: currentCycle?.id === cycleId ? { ...currentCycle, status: CycleStatus.OPEN } : currentCycle,
          isCyclesLoading: false,
        });
        return true;
      } else {
        throw new Error(response.message || 'Failed to open cycle');
      }
    } catch (error) {
      let errorMessage = 'Failed to open cycle';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ isCyclesLoading: false, cyclesError: errorMessage });
      console.error('Open cycle error:', error);
      return false;
    }
  },

  closeCycleForApplication: async (cycleId: string) => {
    set({ isCyclesLoading: true, cyclesError: null });
    try {
      const response = await pmService.closeCycleForApplication(cycleId);

      if (response.status === 200) {
        // Update the cycle status in local state
        const { cycles, currentCycle } = get();
        const updatedCycles = cycles.map((cycle) =>
          cycle.id === cycleId ? { ...cycle, status: CycleStatus.CLOSED } : cycle
        );

        set({
          cycles: updatedCycles,
          currentCycle: currentCycle?.id === cycleId ? { ...currentCycle, status: CycleStatus.CLOSED } : currentCycle,
          isCyclesLoading: false,
        });
        return true;
      } else {
        throw new Error(response.message || 'Failed to close cycle');
      }
    } catch (error) {
      let errorMessage = 'Failed to close cycle';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ isCyclesLoading: false, cyclesError: errorMessage });
      console.error('Close cycle error:', error);
      return false;
    }
  },

  archiveCycle: async (cycleId: string) => {
    set({ isCyclesLoading: true, cyclesError: null });
    try {
      const response = await pmService.archiveCycle(cycleId);

      if (response.status === 200) {
        // Update the cycle status in local state
        const { cycles, currentCycle } = get();
        const updatedCycles = cycles.map((cycle) =>
          cycle.id === cycleId ? { ...cycle, status: CycleStatus.ARCHIVED } : cycle
        );

        set({
          cycles: updatedCycles,
          currentCycle: currentCycle?.id === cycleId ? { ...currentCycle, status: CycleStatus.ARCHIVED } : currentCycle,
          isCyclesLoading: false,
        });
        return true;
      } else {
        throw new Error(response.message || 'Failed to archive cycle');
      }
    } catch (error) {
      let errorMessage = 'Failed to archive cycle';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ isCyclesLoading: false, cyclesError: errorMessage });
      console.error('Archive cycle error:', error);
      return false;
    }
  },

  clearCycles: () => {
    set({
      cycles: [],
      cyclesPagination: null,
      cyclesError: null,
    });
  },

  setCyclesError: (error: string | null) => {
    set({ cyclesError: error });
  },

  // ============= Cycle Details & Applications =============

  getCycleDetails: async (params: GetCycleDetailsRequest) => {
    set({ isCycleDetailsLoading: true, cyclesError: null });
    try {
      const response = await pmService.getCycleDetails(params);

      if (response.status === 200) {
        // Extract applications from the cycle object
        const { cycle } = response.res;
        const applications = (cycle as any).applications || [];

        set({
          currentCycle: cycle,
          currentCycleApplications: applications,
          isCycleDetailsLoading: false,
          cyclesError: null,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch cycle details');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch cycle details';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      set({
        currentCycle: null,
        currentCycleApplications: [],
        isCycleDetailsLoading: false,
        cyclesError: errorMessage,
      });

      console.error('Get cycle details error:', error);
      throw error;
    }
  },

  // ============= Application Actions =============

  getApplicationDetails: async (params: GetPMApplicationDetailsRequest) => {
    set({ isApplicationLoading: true, cyclesError: null });
    try {
      const response = await pmService.getApplicationDetails(params);

      if (response.status === 200) {
        set({
          currentApplication: response.res.application,
          isApplicationLoading: false,
          cyclesError: null,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch application details');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch application details';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      set({
        currentApplication: null,
        isApplicationLoading: false,
        cyclesError: errorMessage,
      });

      console.error('Get application details error:', error);
      throw error;
    }
  },

  clearApplication: () => {
    set({
      currentApplication: null,
      isApplicationLoading: false,
    });
  },

  // ============= Reviewer Actions =============

  inviteReviewer: async (data: InviteReviewerRequest) => {
    set({ isCyclesLoading: true, cyclesError: null });
    try {
      const response = await pmService.inviteReviewer(data);

      if (response.status === 201 || response.status === 200) {
        set({
          isCyclesLoading: false,
          cyclesError: null,
        });
        return true;
      } else {
        throw new Error(response.message || 'Failed to invite reviewer');
      }
    } catch (error) {
      let errorMessage = 'Failed to invite reviewer';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      set({
        isCyclesLoading: false,
        cyclesError: errorMessage,
      });

      console.error('Invite reviewer error:', error);
      return false;
    }
  },

  // ============= Review Actions =============

  getApplicationReviews: async (params: GetApplicationReviewsRequest) => {
    set({ isReviewsLoading: true, reviewsError: null });
    try {
      const response = await pmService.getApplicationReviews(params);

      if (response.status === 200) {
        const { reviews, pendingInvites } = response.res;

        console.log('📝 Application Reviews Response:', {
          reviewsCount: reviews.length,
          pendingInvitesCount: pendingInvites?.length || 0,
          reviews: reviews,
          pendingInvites: pendingInvites,
        });

        // Backend doesn't return pagination, so we'll create a simple one based on request params
        const paginationMeta: PaginationMeta = {
          page: params.page,
          limit: params.numberOfResults,
          total: reviews.length,
          totalPages: Math.ceil(reviews.length / params.numberOfResults),
        };

        set({
          reviews,
          pendingInvites: pendingInvites || [],
          reviewsPagination: paginationMeta,
          isReviewsLoading: false,
          reviewsError: null,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch application reviews');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch application reviews';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      set({
        reviews: [],
        reviewsPagination: null,
        isReviewsLoading: false,
        reviewsError: errorMessage,
      });

      console.error('Get application reviews error:', error);
      throw error;
    }
  },

  getReviewDetails: async (params: GetReviewDetailsRequest) => {
    set({ isReviewLoading: true, reviewsError: null });
    try {
      const response = await pmService.getReviewDetails(params);

      if (response.status === 200) {
        set({
          currentReview: response.res.review,
          isReviewLoading: false,
          reviewsError: null,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch review details');
      }
    } catch (error) {
      let errorMessage = 'Failed to fetch review details';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      set({
        currentReview: null,
        isReviewLoading: false,
        reviewsError: errorMessage,
      });

      console.error('Get review details error:', error);
      throw error;
    }
  },

  clearReviews: () => {
    set({
      reviews: [],
      pendingInvites: [],
      reviewsPagination: null,
      reviewsError: null,
      currentReview: null,
    });
  },

  clearReview: () => {
    set({
      currentReview: null,
      isReviewLoading: false,
      reviewsError: null,
    });
  },

  // Clear all
  clearAll: () => {
    set({
      program: null,
      isProgramLoading: false,
      programError: null,
      cycles: [],
      cyclesPagination: null,
      isCyclesLoading: false,
      cyclesError: null,
      currentCycle: null,
      currentCycleApplications: [],
      isCycleDetailsLoading: false,
      currentApplication: null,
      isApplicationLoading: false,
      reviews: [],
      pendingInvites: [],
      reviewsPagination: null,
      isReviewsLoading: false,
      reviewsError: null,
      currentReview: null,
      isReviewLoading: false,
      isProgramAssigned: null,
      selectedProgramId: null,
    });
  },
}));
