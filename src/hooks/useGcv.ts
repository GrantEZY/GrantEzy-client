/**
 * Custom hook for GCV (Grant Committee View) store
 * Provides easy access to GCV state and actions
 */
import { useGCVStore } from "../store/gcv.store";

export const useGcv = () => {
  // GCV Members state
  const members = useGCVStore((state) => state.members);
  const membersPagination = useGCVStore((state) => state.membersPagination);
  const isMembersLoading = useGCVStore((state) => state.isMembersLoading);
  const membersError = useGCVStore((state) => state.membersError);

  // Programs state
  const programs = useGCVStore((state) => state.programs);
  const programsPagination = useGCVStore((state) => state.programsPagination);
  const isProgramsLoading = useGCVStore((state) => state.isProgramsLoading);
  const programsError = useGCVStore((state) => state.programsError);

  // Program Cycles state
  const programCycles = useGCVStore((state) => state.programCycles);
  const programCyclesPagination = useGCVStore(
    (state) => state.programCyclesPagination,
  );
  const isProgramCyclesLoading = useGCVStore(
    (state) => state.isProgramCyclesLoading,
  );
  const programCyclesError = useGCVStore((state) => state.programCyclesError);
  const selectedCycle = useGCVStore((state) => state.selectedCycle);

  // GCV Member actions
  const getAllGCVMembers = useGCVStore((state) => state.getAllGCVMembers);
  const addGCVMember = useGCVStore((state) => state.addGCVMember);
  const updateGCVUserRole = useGCVStore((state) => state.updateGCVUserRole);
  const clearMembers = useGCVStore((state) => state.clearMembers);
  const setMembersError = useGCVStore((state) => state.setMembersError);

  // Program actions
  const createProgram = useGCVStore((state) => state.createProgram);
  const getPrograms = useGCVStore((state) => state.getPrograms);
  const updateProgram = useGCVStore((state) => state.updateProgram);
  const deleteProgram = useGCVStore((state) => state.deleteProgram);
  const addProgramManager = useGCVStore((state) => state.addProgramManager);
  const clearPrograms = useGCVStore((state) => state.clearPrograms);
  const setProgramsError = useGCVStore((state) => state.setProgramsError);

  // Program Cycles actions
  const getProgramCycles = useGCVStore((state) => state.getProgramCycles);
  const getCycleDetails = useGCVStore((state) => state.getCycleDetails);
  const getApplicationDetails = useGCVStore(
    (state) => state.getApplicationDetails,
  );
  const clearProgramCycles = useGCVStore((state) => state.clearProgramCycles);
  const setProgramCyclesError = useGCVStore(
    (state) => state.setProgramCyclesError,
  );
  const setSelectedCycle = useGCVStore((state) => state.setSelectedCycle);

  // Clear all
  const clearAll = useGCVStore((state) => state.clearAll);

  return {
    // GCV Members
    members,
    membersPagination,
    isMembersLoading,
    membersError,
    getAllGCVMembers,
    addGCVMember,
    updateGCVUserRole,
    clearMembers,
    setMembersError,

    // Programs
    programs,
    programsPagination,
    isProgramsLoading,
    programsError,
    createProgram,
    getPrograms,
    updateProgram,
    deleteProgram,
    addProgramManager,
    clearPrograms,
    setProgramsError,

    // Program Cycles
    programCycles,
    programCyclesPagination,
    isProgramCyclesLoading,
    programCyclesError,
    selectedCycle,
    getProgramCycles,
    getCycleDetails,
    getApplicationDetails,
    clearProgramCycles,
    setProgramCyclesError,
    setSelectedCycle,

    // Utility
    clearAll,
  };
};
