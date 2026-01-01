/**
 * Custom hook for applicant store
 * Provides easy access to applicant state and actions
 */
import { useApplicantStore } from '../store/applicant.store';
import {
  AddApplicationBudgetRequest,
  AddApplicationDocumentsRequest,
  AddApplicationRevenueStreamRequest,
  AddApplicationRisksAndMilestonesRequest,
  AddApplicationTechnicalDetailsRequest,
  ApplicationStep,
  CreateApplicationRequest,
} from '../types/applicant.types';

export const useApplicant = () => {
  // State selectors
  const currentApplication = useApplicantStore((state) => state.currentApplication);
  const currentStep = useApplicantStore((state) => state.currentStep);
  const applicationSteps = useApplicantStore((state) => state.applicationSteps);
  const myApplications = useApplicantStore((state) => state.myApplications);
  const linkedApplications = useApplicantStore((state) => state.linkedApplications);
  const isLoadingApplications = useApplicantStore((state) => state.isLoadingApplications);
  const isLoading = useApplicantStore((state) => state.isLoading);
  const error = useApplicantStore((state) => state.error);
  const successMessage = useApplicantStore((state) => state.successMessage);

  // Action selectors
  const createApplication = useApplicantStore((state) => state.createApplication);
  const updateBasicInfo = useApplicantStore((state) => state.updateBasicInfo);
  const addApplicationBudget = useApplicantStore((state) => state.addApplicationBudget);
  const addApplicationTechnicalDetails = useApplicantStore(
    (state) => state.addApplicationTechnicalDetails
  );
  const addApplicationRevenueStream = useApplicantStore(
    (state) => state.addApplicationRevenueStream
  );
  const addApplicationRisksAndMilestones = useApplicantStore(
    (state) => state.addApplicationRisksAndMilestones
  );
  const addApplicationDocuments = useApplicantStore((state) => state.addApplicationDocuments);
  const addApplicationTeammates = useApplicantStore((state) => state.addApplicationTeammates);
  const fetchUserApplications = useApplicantStore((state) => state.fetchUserApplications);
  const fetchApplicationWithCycleDetails = useApplicantStore(
    (state) => state.fetchApplicationWithCycleDetails
  );
  const fetchUserCreatedApplicationDetails = useApplicantStore(
    (state) => state.fetchUserCreatedApplicationDetails
  );
  const deleteUserApplication = useApplicantStore((state) => state.deleteUserApplication);
  const setCurrentStep = useApplicantStore((state) => state.setCurrentStep);
  const goToNextStep = useApplicantStore((state) => state.goToNextStep);
  const goToPreviousStep = useApplicantStore((state) => state.goToPreviousStep);
  const canNavigateToStep = useApplicantStore((state) => state.canNavigateToStep);
  const setCurrentApplication = useApplicantStore((state) => state.setCurrentApplication);
  const updateApplicationSteps = useApplicantStore((state) => state.updateApplicationSteps);
  const clearError = useApplicantStore((state) => state.clearError);
  const clearSuccessMessage = useApplicantStore((state) => state.clearSuccessMessage);
  const resetApplicationState = useApplicantStore((state) => state.resetApplicationState);
  const loadSavedApplication = useApplicantStore((state) => state.loadSavedApplication);

  // Computed values
  const isFirstStep = currentStep === ApplicationStep.BASIC_INFO;
  const isLastStep = currentStep === ApplicationStep.TEAM_MEMBERS;
  const hasApplication = currentApplication !== null;
  const applicationId = currentApplication?.id || null;
  const isApplicationSubmitted = currentApplication?.isSubmitted || false;

  // Helper functions
  const getCurrentStepInfo = () => {
    return applicationSteps.find((step) => step.step === currentStep);
  };

  const getCompletedStepsCount = () => {
    return applicationSteps.filter((step) => step.isCompleted).length;
  };

  const getProgressPercentage = () => {
    const totalSteps = applicationSteps.length;
    const completedSteps = getCompletedStepsCount();
    return Math.round((completedSteps / totalSteps) * 100);
  };

  // Wrapper functions for type safety and convenience
  const handleCreateApplication = async (data: CreateApplicationRequest) => {
    return await createApplication(data);
  };

  const handleAddBudget = async (budget: AddApplicationBudgetRequest['budget']) => {
    if (!applicationId) {
      throw new Error('No active application');
    }
    return await addApplicationBudget({
      applicationId,
      budget,
    });
  };

  const handleAddTechnicalDetails = async (
    technicalSpec: AddApplicationTechnicalDetailsRequest['technicalSpec'],
    marketInfo: AddApplicationTechnicalDetailsRequest['marketInfo']
  ) => {
    if (!applicationId) {
      throw new Error('No active application');
    }
    return await addApplicationTechnicalDetails({
      applicationId,
      technicalSpec,
      marketInfo,
    });
  };

  const handleAddRevenueStream = async (
    revenueModel: AddApplicationRevenueStreamRequest['revenueModel']
  ) => {
    if (!applicationId) {
      throw new Error('No active application');
    }
    return await addApplicationRevenueStream({
      applicationId,
      revenueModel,
    });
  };

  const handleAddRisksAndMilestones = async (
    risks: AddApplicationRisksAndMilestonesRequest['risks'],
    milestones: AddApplicationRisksAndMilestonesRequest['milestones']
  ) => {
    if (!applicationId) {
      throw new Error('No active application');
    }
    return await addApplicationRisksAndMilestones({
      applicationId,
      risks,
      milestones,
    });
  };

  const handleAddDocuments = async (
    documents: Omit<AddApplicationDocumentsRequest, 'applicationId'>
  ) => {
    if (!applicationId) {
      throw new Error('No active application');
    }
    return await addApplicationDocuments({
      applicationId,
      ...documents,
    });
  };

  const handleAddTeammates = async (emails: string[], isSubmitted: boolean = false) => {
    if (!applicationId) {
      throw new Error('No active application');
    }
    return await addApplicationTeammates({
      applicationId,
      emails,
      isSubmitted,
    });
  };

  return {
    // State
    currentApplication,
    currentStep,
    applicationSteps,
    myApplications,
    linkedApplications,
    isLoadingApplications,
    isLoading,
    error,
    successMessage,

    // Computed values
    isFirstStep,
    isLastStep,
    hasApplication,
    applicationId,
    isApplicationSubmitted,

    // Actions
    createApplication: handleCreateApplication,
    updateBasicInfo,
    addBudget: handleAddBudget,
    addTechnicalDetails: handleAddTechnicalDetails,
    addRevenueStream: handleAddRevenueStream,
    addRisksAndMilestones: handleAddRisksAndMilestones,
    addDocuments: handleAddDocuments,
    addTeammates: handleAddTeammates,

    // User applications management
    fetchUserApplications,
    fetchApplicationWithCycleDetails,
    fetchUserCreatedApplicationDetails,
    deleteUserApplication,

    // Navigation
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    canNavigateToStep,

    // State management
    setCurrentApplication,
    updateApplicationSteps,
    clearError,
    clearSuccessMessage,
    resetApplicationState,
    loadSavedApplication,

    // Helper functions
    getCurrentStepInfo,
    getCompletedStepsCount,
    getProgressPercentage,
  };
};
