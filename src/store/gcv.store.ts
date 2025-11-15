/**
 * GCV (Grant Committee View) store using Zustand for GCV-related state management
 */
import { create } from "zustand";

import { gcvService } from "../services/gcv.service";
import {
  AddGCVMemberRequest,
  AddProgramManagerRequest,
  CreateProgramRequest,
  DeleteProgramRequest,
  GCVMember,
  GetAllGCVMembersRequest,
  GetAllProgramsRequest,
  GetGCVApplicationDetailsRequest,
  GetGCVCycleDetailsRequest,
  GetGCVProgramCyclesRequest,
  PaginationMeta,
  Program,
  UpdateGCVUserRoleRequest,
  UpdateProgramRequest,
} from "../types/gcv.types";
import { Cycle } from "../types/pm.types";

interface GCVState {
  // GCV Members state
  members: GCVMember[];
  membersPagination: PaginationMeta | null;
  isMembersLoading: boolean;
  membersError: string | null;

  // Programs state
  programs: Program[];
  programsPagination: PaginationMeta | null;
  isProgramsLoading: boolean;
  programsError: string | null;

  // Program Cycles state
  programCycles: Cycle[];
  programCyclesPagination: PaginationMeta | null;
  isProgramCyclesLoading: boolean;
  programCyclesError: string | null;
  selectedCycle: Cycle | null;
}

interface GCVActions {
  // GCV Member actions
  getAllGCVMembers: (params: GetAllGCVMembersRequest) => Promise<void>;
  addGCVMember: (data: AddGCVMemberRequest) => Promise<boolean>;
  updateGCVUserRole: (data: UpdateGCVUserRoleRequest) => Promise<boolean>;
  clearMembers: () => void;
  setMembersError: (error: string | null) => void;

  // Program actions
  createProgram: (data: CreateProgramRequest) => Promise<boolean>;
  getPrograms: (params: GetAllProgramsRequest) => Promise<void>;
  updateProgram: (data: UpdateProgramRequest) => Promise<boolean>;
  deleteProgram: (data: DeleteProgramRequest) => Promise<boolean>;
  addProgramManager: (data: AddProgramManagerRequest) => Promise<boolean>;
  clearPrograms: () => void;
  setProgramsError: (error: string | null) => void;

  // Program Cycles actions
  getProgramCycles: (params: GetGCVProgramCyclesRequest) => Promise<void>;
  getCycleDetails: (params: GetGCVCycleDetailsRequest) => Promise<void>;
  getApplicationDetails: (
    params: GetGCVApplicationDetailsRequest,
  ) => Promise<void>;
  clearProgramCycles: () => void;
  setProgramCyclesError: (error: string | null) => void;
  setSelectedCycle: (cycle: Cycle | null) => void;

  // Clear all
  clearAll: () => void;
}

type GCVStore = GCVState & GCVActions;

export const useGCVStore = create<GCVStore>((set) => ({
  // Initial state
  members: [],
  membersPagination: null,
  isMembersLoading: false,
  membersError: null,

  programs: [],
  programsPagination: null,
  isProgramsLoading: false,
  programsError: null,

  programCycles: [],
  programCyclesPagination: null,
  isProgramCyclesLoading: false,
  programCyclesError: null,
  selectedCycle: null,

  // ============= GCV Member Actions =============

  getAllGCVMembers: async (params: GetAllGCVMembersRequest) => {
    set({ isMembersLoading: true, membersError: null, members: [] });
    try {
      const response = await gcvService.getAllGCVMembers(params);

      if (response.status === 200) {
        // Create pagination metadata from the response
        const totalMembers = response.res.totalNumberOfUsers || 0;
        const pageSize = params.numberOfResults || 10;

        const pagination: PaginationMeta = {
          page: params.page || 1,
          limit: pageSize,
          total: totalMembers,
          totalPages: Math.ceil(totalMembers / pageSize),
        };

        set({
          members: response.res.users.map((member) => ({
            ...member,
            // Ensure email is always available at the top level for compatibility
            email: member.contact?.email || member.email || "N/A",
            // Ensure names are available at the top level for compatibility
            firstName: member.person?.firstName || member.firstName || "N/A",
            lastName: member.person?.lastName || member.lastName || "",
          })),
          membersPagination: pagination,
          isMembersLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch GCV members";
      set({
        membersError: errorMessage,
        isMembersLoading: false,
      });
      throw error;
    }
  },

  addGCVMember: async (data: AddGCVMemberRequest) => {
    set({ isMembersLoading: true, membersError: null });
    try {
      const response = await gcvService.addGCVMember(data);

      // Backend returns 201 for new users, 200 for existing users with role added
      if (response.status === 200 || response.status === 201) {
        set({ isMembersLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add GCV member";
      set({
        membersError: errorMessage,
        isMembersLoading: false,
      });
      // Throw error with message so caller can display it
      throw new Error(errorMessage);
    }
  },

  updateGCVUserRole: async (data: UpdateGCVUserRoleRequest) => {
    set({ isMembersLoading: true, membersError: null });
    try {
      const response = await gcvService.updateGCVUserRole(data);

      // Backend returns 204 for successful update
      if (response.status === 200 || response.status === 204) {
        set({ isMembersLoading: false });
        return true;
      }
      return false;
    } catch (error: unknown) {
      let errorMessage = "Failed to update GCV user role";

      // Extract detailed error message from API response
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Update GCV user role error:", error);

      set({
        membersError: errorMessage,
        isMembersLoading: false,
      });
      // Throw error with message so caller can display it
      throw new Error(errorMessage);
    }
  },

  clearMembers: () => {
    set({
      members: [],
      membersPagination: null,
      membersError: null,
    });
  },

  setMembersError: (error: string | null) => {
    set({ membersError: error });
  },

  // ============= Program Actions =============

  createProgram: async (data: CreateProgramRequest) => {
    set({ isProgramsLoading: true, programsError: null });
    try {
      const response = await gcvService.createProgram(data);

      // Backend returns 201 for successful creation
      if (response.status === 201) {
        set({ isProgramsLoading: false });
        return true;
      }
      return false;
    } catch (error: unknown) {
      let errorMessage = "Failed to create program";

      // Extract detailed error message from API response
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Create program error:", error);

      set({
        programsError: errorMessage,
        isProgramsLoading: false,
      });
      // Throw error with message so caller can display it
      throw new Error(errorMessage);
    }
  },

  getPrograms: async (params: GetAllProgramsRequest) => {
    set({ isProgramsLoading: true, programsError: null, programs: [] });
    try {
      const response = await gcvService.getPrograms(params);

      if (response.status === 200) {
        // Create pagination metadata from the response
        const totalPrograms = response.res.numberOfPrograms || 0;
        const pageSize = params.numberOfResults || 10;

        const pagination: PaginationMeta = {
          page: params.page || 1,
          limit: pageSize,
          total: totalPrograms,
          totalPages: Math.ceil(totalPrograms / pageSize),
        };

        set({
          programs: response.res.programs,
          programsPagination: pagination,
          isProgramsLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch programs";
      console.error("[GCV Store] Fetch programs error:", error);
      set({
        programsError: errorMessage,
        isProgramsLoading: false,
      });
      throw error;
    }
  },

  updateProgram: async (data: UpdateProgramRequest) => {
    set({ isProgramsLoading: true, programsError: null });
    try {
      const response = await gcvService.updateProgram(data);

      // Backend returns 200 for successful update
      if (response.status === 200) {
        set({ isProgramsLoading: false });
        return true;
      }
      return false;
    } catch (error: unknown) {
      let errorMessage = "Failed to update program";

      // Extract detailed error message from API response
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Update program error:", error);

      set({
        programsError: errorMessage,
        isProgramsLoading: false,
      });
      // Throw error with message so caller can display it
      throw new Error(errorMessage);
    }
  },

  deleteProgram: async (data: DeleteProgramRequest) => {
    set({ isProgramsLoading: true, programsError: null });
    try {
      const response = await gcvService.deleteProgram(data);

      // Backend returns 200 for successful deletion
      if (response.status === 200 && response.res.success) {
        set({ isProgramsLoading: false });
        return true;
      }
      return false;
    } catch (error: unknown) {
      let errorMessage = "Failed to delete program";

      // Extract detailed error message from API response
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Delete program error:", error);

      set({
        programsError: errorMessage,
        isProgramsLoading: false,
      });
      // Throw error with message so caller can display it
      throw new Error(errorMessage);
    }
  },

  addProgramManager: async (data: AddProgramManagerRequest) => {
    set({ isProgramsLoading: true, programsError: null });
    try {
      const response = await gcvService.addProgramManager(data);

      // Backend returns 200 for successful addition
      if (response.status === 200) {
        set({ isProgramsLoading: false });
        return true;
      }
      return false;
    } catch (error: unknown) {
      let errorMessage = "Failed to add program manager";

      // Extract detailed error message from API response
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Add program manager error:", error);

      set({
        programsError: errorMessage,
        isProgramsLoading: false,
      });
      // Throw error with message so caller can display it
      throw new Error(errorMessage);
    }
  },

  clearPrograms: () => {
    set({
      programs: [],
      programsPagination: null,
      programsError: null,
    });
  },

  setProgramsError: (error: string | null) => {
    set({ programsError: error });
  },

  // ============= Program Cycles Actions =============

  getProgramCycles: async (params: GetGCVProgramCyclesRequest) => {
    set({
      isProgramCyclesLoading: true,
      programCyclesError: null,
      programCycles: [],
    });
    try {
      const response = await gcvService.getProgramCycles(params);

      if (response.status === 200) {
        // Create pagination metadata from the response
        const totalCycles = response.res.totalNumberOfCycles || 0;
        const pageSize = params.numberOfResults || 10;

        const pagination: PaginationMeta = {
          page: params.page || 1,
          limit: pageSize,
          total: totalCycles,
          totalPages: Math.ceil(totalCycles / pageSize),
        };

        set({
          programCycles: response.res.cycles,
          programCyclesPagination: pagination,
          isProgramCyclesLoading: false,
        });
      } else {
        throw new Error(response.message || "Failed to fetch program cycles");
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch program cycles";

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Get program cycles error:", error);

      set({
        programCyclesError: errorMessage,
        isProgramCyclesLoading: false,
        programCycles: [],
      });
    }
  },

  getCycleDetails: async (params: GetGCVCycleDetailsRequest) => {
    set({ isProgramCyclesLoading: true, programCyclesError: null });
    try {
      const response = await gcvService.getCycleDetails(params);

      if (response.status === 200) {
        set({
          selectedCycle: response.res.cycle,
          isProgramCyclesLoading: false,
        });
      } else {
        throw new Error(response.message || "Failed to fetch cycle details");
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch cycle details";

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Get cycle details error:", error);

      set({
        programCyclesError: errorMessage,
        isProgramCyclesLoading: false,
      });
    }
  },

  getApplicationDetails: async (params: GetGCVApplicationDetailsRequest) => {
    set({ isProgramCyclesLoading: true, programCyclesError: null });
    try {
      const response = await gcvService.getApplicationDetails(params);

      if (response.status === 200) {
        set({
          isProgramCyclesLoading: false,
        });
        // We can store the application details in a new state property if needed
      } else {
        throw new Error(
          response.message || "Failed to fetch application details",
        );
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch application details";

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      console.error("Get application details error:", error);

      set({
        programCyclesError: errorMessage,
        isProgramCyclesLoading: false,
      });
    }
  },

  clearProgramCycles: () => {
    set({
      programCycles: [],
      programCyclesPagination: null,
      programCyclesError: null,
      selectedCycle: null,
    });
  },

  setProgramCyclesError: (error: string | null) => {
    set({ programCyclesError: error });
  },

  setSelectedCycle: (cycle: Cycle | null) => {
    set({ selectedCycle: cycle });
  },

  // ============= Clear All =============

  clearAll: () => {
    set({
      members: [],
      membersPagination: null,
      isMembersLoading: false,
      membersError: null,
      programs: [],
      programsPagination: null,
      isProgramsLoading: false,
      programsError: null,
      programCycles: [],
      programCyclesPagination: null,
      isProgramCyclesLoading: false,
      programCyclesError: null,
      selectedCycle: null,
    });
  },
}));
