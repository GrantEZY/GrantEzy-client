/**
 * Custom hook for PM (Program Manager) store
 * Provides easy access to PM state and actions
 */
import { usePMStore } from "../store/pm.store";

export const usePm = () => {
  // Cycles state
  const cycles = usePMStore((state) => state.cycles);
  const cyclesPagination = usePMStore((state) => state.cyclesPagination);
  const isCyclesLoading = usePMStore((state) => state.isCyclesLoading);
  const cyclesError = usePMStore((state) => state.cyclesError);

  // Current selected program
  const selectedProgramId = usePMStore((state) => state.selectedProgramId);

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

    // Selected program
    selectedProgramId,
    setSelectedProgramId,

    // Clear all
    clearAll,
  };
};
