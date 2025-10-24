/**
 * Custom hook for PM (Program Manager) store
 * Provides easy access to PM state and actions
 */
import { usePMStore } from "../store/pm.store";

export const usePm = () => {
  // Program state
  const program = usePMStore((state) => state.program);
  const isProgramLoading = usePMStore((state) => state.isProgramLoading);
  const programError = usePMStore((state) => state.programError);
  
  // Cycles state
  const cycles = usePMStore((state) => state.cycles);
  const cyclesPagination = usePMStore((state) => state.cyclesPagination);
  const isCyclesLoading = usePMStore((state) => state.isCyclesLoading);
  const cyclesError = usePMStore((state) => state.cyclesError);
  
  // Program assignment state
  const isProgramAssigned = usePMStore((state) => state.isProgramAssigned);

  // Current selected program
  const selectedProgramId = usePMStore((state) => state.selectedProgramId);

  // Program actions
  const getAssignedProgram = usePMStore((state) => state.getAssignedProgram);
  const clearProgram = usePMStore((state) => state.clearProgram);

  // Program selection action
  const setSelectedProgramId = usePMStore(
    (state) => state.setSelectedProgramId,
  );

  // Cycle actions
  const createCycle = usePMStore((state) => state.createCycle);
  const getProgramCycles = usePMStore((state) => state.getProgramCycles);
  const updateCycle = usePMStore((state) => state.updateCycle);
  const deleteCycle = usePMStore((state) => state.deleteCycle);
  const clearCycles = usePMStore((state) => state.clearCycles);
  const setCyclesError = usePMStore((state) => state.setCyclesError);

  // Clear all
  const clearAll = usePMStore((state) => state.clearAll);

  return {
    // Program
    program,
    isProgramLoading,
    programError,
    getAssignedProgram,
    clearProgram,
    
    // Cycles
    cycles,
    cyclesPagination,
    isCyclesLoading,
    cyclesError,
    createCycle,
    getProgramCycles,
    updateCycle,
    deleteCycle,
    clearCycles,
    setCyclesError,

    // Program assignment
    isProgramAssigned,

    // Selected program
    selectedProgramId,
    setSelectedProgramId,

    // Clear all
    clearAll,
  };
};
