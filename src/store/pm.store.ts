/**
 * PM (Program Manager) store using Zustand for PM-related state management
 */
import { create } from "zustand";

import { pmService } from "../services/pm.service";
import { PaginationMeta } from "../types/admin.types";
import {
  CreateCycleRequest,
  Cycle,
  DeleteCycleRequest,
  GetProgramCyclesRequest,
  UpdateCycleRequest,
} from "../types/pm.types";

interface PMState {
  // Cycles state
  cycles: Cycle[];
  cyclesPagination: PaginationMeta | null;
  isCyclesLoading: boolean;
  cyclesError: string | null;

  // Current selected program for cycle management
  selectedProgramId: string | null;
}

interface PMActions {
  // Program selection
  setSelectedProgramId: (programId: string | null) => void;

  // Cycle actions
  createCycle: (data: CreateCycleRequest) => Promise<boolean>;
  getProgramCycles: (params: GetProgramCyclesRequest) => Promise<void>;
  updateCycle: (data: UpdateCycleRequest) => Promise<boolean>;
  deleteCycle: (data: DeleteCycleRequest) => Promise<boolean>;
  clearCycles: () => void;
  setCyclesError: (error: string | null) => void;

  // Clear all
  clearAll: () => void;
}

type PMStore = PMState & PMActions;

export const usePMStore = create<PMStore>((set, get) => ({
  // Initial state
  cycles: [],
  cyclesPagination: null,
  isCyclesLoading: false,
  cyclesError: null,
  selectedProgramId: null,

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

        // Refresh cycles for the current program if it matches
        const currentProgramId = get().selectedProgramId;
        if (currentProgramId === data.programId) {
          // Refresh cycles list
          await get().getProgramCycles({
            programId: data.programId,
            page: 1,
            numberOfResults: 10,
          });
        }

        return true;
      } else {
        throw new Error(response.message || "Failed to create cycle");
      }
    } catch (error) {
      let errorMessage = "Failed to create cycle";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      set({
        isCyclesLoading: false,
        cyclesError: errorMessage,
      });

      console.error("Create cycle error:", error);
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
        });
      } else {
        throw new Error(response.message || "Failed to fetch program cycles");
      }
    } catch (error) {
      let errorMessage = "Failed to fetch program cycles";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      set({
        cycles: [],
        cyclesPagination: null,
        isCyclesLoading: false,
        cyclesError: errorMessage,
      });

      console.error("Get program cycles error:", error);
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
          cycle.id === data.id
            ? { ...cycle, ...data, updatedAt: new Date().toISOString() }
            : cycle,
        );

        set({ cycles: updatedCycles });
        return true;
      } else {
        throw new Error(response.message || "Failed to update cycle");
      }
    } catch (error) {
      let errorMessage = "Failed to update cycle";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      set({
        isCyclesLoading: false,
        cyclesError: errorMessage,
      });

      console.error("Update cycle error:", error);
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
        const updatedCycles = cycles.filter(
          (cycle) => cycle.id !== data.cycleId,
        );

        set({ cycles: updatedCycles });
        return true;
      } else {
        throw new Error(response.message || "Failed to delete cycle");
      }
    } catch (error) {
      let errorMessage = "Failed to delete cycle";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      set({
        isCyclesLoading: false,
        cyclesError: errorMessage,
      });

      console.error("Delete cycle error:", error);
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

  // Clear all
  clearAll: () => {
    set({
      cycles: [],
      cyclesPagination: null,
      isCyclesLoading: false,
      cyclesError: null,
      selectedProgramId: null,
    });
  },
}));
