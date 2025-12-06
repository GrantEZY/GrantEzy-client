/**
 * Custom hook for PM (Program Manager) store
 * Provides easy access to PM state and actions
 */
import { usePMStore } from '../store/pm.store';

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

  // Current cycle details
  const currentCycle = usePMStore((state) => state.currentCycle);
  const currentCycleApplications = usePMStore((state) => state.currentCycleApplications);
  const isCycleDetailsLoading = usePMStore((state) => state.isCycleDetailsLoading);

  // Current application
  const currentApplication = usePMStore((state) => state.currentApplication);
  const isApplicationLoading = usePMStore((state) => state.isApplicationLoading);

  // Reviews state
  const reviews = usePMStore((state) => state.reviews);
  const pendingInvites = usePMStore((state) => state.pendingInvites);
  const reviewsPagination = usePMStore((state) => state.reviewsPagination);
  const isReviewsLoading = usePMStore((state) => state.isReviewsLoading);
  const reviewsError = usePMStore((state) => state.reviewsError);

  // Current review
  const currentReview = usePMStore((state) => state.currentReview);
  const isReviewLoading = usePMStore((state) => state.isReviewLoading);

  // Program assignment state
  const isProgramAssigned = usePMStore((state) => state.isProgramAssigned);

  // Current selected program
  const selectedProgramId = usePMStore((state) => state.selectedProgramId);

  // Program actions
  const getAssignedProgram = usePMStore((state) => state.getAssignedProgram);
  const clearProgram = usePMStore((state) => state.clearProgram);

  // Program selection action
  const setSelectedProgramId = usePMStore((state) => state.setSelectedProgramId);

  // Cycle actions
  const createCycle = usePMStore((state) => state.createCycle);
  const getProgramCycles = usePMStore((state) => state.getProgramCycles);
  const getCycleDetails = usePMStore((state) => state.getCycleDetails);
  const updateCycle = usePMStore((state) => state.updateCycle);
  const deleteCycle = usePMStore((state) => state.deleteCycle);
  const clearCycles = usePMStore((state) => state.clearCycles);
  const setCyclesError = usePMStore((state) => state.setCyclesError);

  // Application actions
  const getApplicationDetails = usePMStore((state) => state.getApplicationDetails);
  const clearApplication = usePMStore((state) => state.clearApplication);

  // Reviewer actions
  const inviteReviewer = usePMStore((state) => state.inviteReviewer);

  // Review actions
  const getApplicationReviews = usePMStore((state) => state.getApplicationReviews);
  const getReviewDetails = usePMStore((state) => state.getReviewDetails);
  const clearReviews = usePMStore((state) => state.clearReviews);
  const clearReview = usePMStore((state) => state.clearReview);

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
    getCycleDetails,
    updateCycle,
    deleteCycle,
    clearCycles,
    setCyclesError,

    // Cycle details
    currentCycle,
    currentCycleApplications,
    isCycleDetailsLoading,

    // Application
    currentApplication,
    isApplicationLoading,
    getApplicationDetails,
    clearApplication,

    // Reviewer
    inviteReviewer,

    // Reviews
    reviews,
    pendingInvites,
    reviewsPagination,
    isReviewsLoading,
    reviewsError,
    currentReview,
    isReviewLoading,
    reviewError: reviewsError,
    getApplicationReviews,
    getReviewDetails,
    clearReviews,
    clearReview,

    // Program assignment
    isProgramAssigned,

    // Selected program
    selectedProgramId,
    setSelectedProgramId,

    // Clear all
    clearAll,
  };
};
