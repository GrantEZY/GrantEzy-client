/**
 * Applicant store using Zustand for application submission state management
 */
import { create } from "zustand";

import { applicantService } from "../services/applicant.service";
import {
  AddApplicationBudgetRequest,
  AddApplicationDocumentsRequest,
  AddApplicationRevenueStreamRequest,
  AddApplicationRisksAndMilestonesRequest,
  AddApplicationTeammatesRequest,
  AddApplicationTechnicalDetailsRequest,
  Application,
  ApplicationStep,
  ApplicationStepInfo,
  CreateApplicationRequest,
} from "../types/applicant.types";

interface ApplicantState {
  // Current application state
  currentApplication: Application | null;
  currentStep: ApplicationStep;
  applicationSteps: ApplicationStepInfo[];
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Success messages
  successMessage: string | null;
}

interface ApplicantActions {
  // Step 1: Create application with basic info
  createApplication: (data: CreateApplicationRequest) => Promise<boolean>;
  
  // Step 2: Add budget details
  addApplicationBudget: (data: AddApplicationBudgetRequest) => Promise<boolean>;
  
  // Step 3: Add technical details
  addApplicationTechnicalDetails: (
    data: AddApplicationTechnicalDetailsRequest,
  ) => Promise<boolean>;
  
  // Step 4: Add revenue model
  addApplicationRevenueStream: (
    data: AddApplicationRevenueStreamRequest,
  ) => Promise<boolean>;
  
  // Step 5: Add risks and milestones
  addApplicationRisksAndMilestones: (
    data: AddApplicationRisksAndMilestonesRequest,
  ) => Promise<boolean>;
  
  // Step 6: Add documents
  addApplicationDocuments: (
    data: AddApplicationDocumentsRequest,
  ) => Promise<boolean>;
  
  // Step 7: Add teammates and submit
  addApplicationTeammates: (
    data: AddApplicationTeammatesRequest,
  ) => Promise<boolean>;
  
  // Load saved application (draft restoration)
  loadSavedApplication: (cycleSlug: string) => Promise<Application | null>;
  
  // Navigation helpers
  setCurrentStep: (step: ApplicationStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canNavigateToStep: (step: ApplicationStep) => boolean;
  
  // State management
  setCurrentApplication: (application: Application | null) => void;
  updateApplicationSteps: () => void;
  clearError: () => void;
  clearSuccessMessage: () => void;
  resetApplicationState: () => void;
}

type ApplicantStore = ApplicantState & ApplicantActions;

const initialSteps: ApplicationStepInfo[] = [
  {
    step: ApplicationStep.BASIC_INFO,
    title: "Basic Information",
    description: "Project title, summary, problem, solution, and innovation",
    isCompleted: false,
    isActive: true,
  },
  {
    step: ApplicationStep.BUDGET,
    title: "Budget Details",
    description: "Project budget breakdown and resource allocation",
    isCompleted: false,
    isActive: false,
  },
  {
    step: ApplicationStep.TECHNICAL_DETAILS,
    title: "Technical & Market Info",
    description: "Technical specifications and market analysis",
    isCompleted: false,
    isActive: false,
  },
  {
    step: ApplicationStep.REVENUE_MODEL,
    title: "Revenue Model",
    description: "Revenue streams, pricing, and unit economics",
    isCompleted: false,
    isActive: false,
  },
  {
    step: ApplicationStep.RISKS_MILESTONES,
    title: "Risks & Milestones",
    description: "Project risks, mitigation, and delivery milestones",
    isCompleted: false,
    isActive: false,
  },
  {
    step: ApplicationStep.DOCUMENTS,
    title: "Documents",
    description: "Upload required certificates and documents",
    isCompleted: false,
    isActive: false,
  },
  {
    step: ApplicationStep.TEAM_MEMBERS,
    title: "Team Members",
    description: "Invite team members and submit application",
    isCompleted: false,
    isActive: false,
  },
];

export const useApplicantStore = create<ApplicantStore>((set, get) => ({
  // Initial state
  currentApplication: null,
  currentStep: ApplicationStep.BASIC_INFO,
  applicationSteps: initialSteps,
  isLoading: false,
  error: null,
  successMessage: null,

  // Step 1: Create application
  createApplication: async (data: CreateApplicationRequest) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await applicantService.createApplication(data);
      
      if (response.status === 201) {
        const newApplication: Application = {
          id: response.res.application.id,
          userId: response.res.application.userId,
          cycleId: response.res.application.cycleId,
          stepNumber: 1,
          basicInfo: data.basicInfo,
          isSubmitted: false,
        };
        
        set({
          currentApplication: newApplication,
          currentStep: ApplicationStep.BUDGET,
          successMessage: response.message,
          isLoading: false,
        });
        
        get().updateApplicationSteps();
        return true;
      }
      
      set({ error: "Failed to create application", isLoading: false });
      return false;
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create application";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Step 2: Add budget
  addApplicationBudget: async (data: AddApplicationBudgetRequest) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await applicantService.addApplicationBudget(data);
      
      if (response.status === 200) {
        const currentApp = get().currentApplication;
        if (currentApp) {
          set({
            currentApplication: {
              ...currentApp,
              budget: data.budget,
              stepNumber: response.res.application.stepNumber,
            },
            currentStep: ApplicationStep.TECHNICAL_DETAILS,
            successMessage: response.message,
            isLoading: false,
          });
          
          get().updateApplicationSteps();
          return true;
        }
      }
      
      set({ error: "Failed to add budget details", isLoading: false });
      return false;
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to add budget details";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Step 3: Add technical details
  addApplicationTechnicalDetails: async (
    data: AddApplicationTechnicalDetailsRequest,
  ) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response =
        await applicantService.addApplicationTechnicalDetails(data);
      
      if (response.status === 200) {
        const currentApp = get().currentApplication;
        if (currentApp) {
          set({
            currentApplication: {
              ...currentApp,
              technicalSpec: data.technicalSpec,
              marketInfo: data.marketInfo,
              stepNumber: response.res.application.stepNumber,
            },
            currentStep: ApplicationStep.REVENUE_MODEL,
            successMessage: response.message,
            isLoading: false,
          });
          
          get().updateApplicationSteps();
          return true;
        }
      }
      
      set({ error: "Failed to add technical details", isLoading: false });
      return false;
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to add technical details";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Step 4: Add revenue model
  addApplicationRevenueStream: async (
    data: AddApplicationRevenueStreamRequest,
  ) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await applicantService.addApplicationRevenueStream(data);
      
      if (response.status === 200) {
        const currentApp = get().currentApplication;
        if (currentApp) {
          set({
            currentApplication: {
              ...currentApp,
              revenueModel: data.revenueModel,
              stepNumber: response.res.application.stepNumber,
            },
            currentStep: ApplicationStep.RISKS_MILESTONES,
            successMessage: response.message,
            isLoading: false,
          });
          
          get().updateApplicationSteps();
          return true;
        }
      }
      
      set({ error: "Failed to add revenue model", isLoading: false });
      return false;
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to add revenue model";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Step 5: Add risks and milestones
  addApplicationRisksAndMilestones: async (
    data: AddApplicationRisksAndMilestonesRequest,
  ) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response =
        await applicantService.addApplicationRisksAndMilestones(data);
      
      if (response.status === 200) {
        const currentApp = get().currentApplication;
        if (currentApp) {
          set({
            currentApplication: {
              ...currentApp,
              risks: data.risks,
              milestones: data.milestones,
              stepNumber: response.res.application.stepNumber,
            },
            currentStep: ApplicationStep.DOCUMENTS,
            successMessage: response.message,
            isLoading: false,
          });
          
          get().updateApplicationSteps();
          return true;
        }
      }
      
      set({ error: "Failed to add risks and milestones", isLoading: false });
      return false;
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to add risks and milestones";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Step 6: Add documents
  addApplicationDocuments: async (data: AddApplicationDocumentsRequest) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await applicantService.addApplicationDocuments(data);
      
      if (response.status === 200) {
        const currentApp = get().currentApplication;
        if (currentApp) {
          set({
            currentApplication: {
              ...currentApp,
              documents: {
                endorsementLetter: data.endorsementLetter,
                plagiarismUndertaking: data.plagiarismUndertaking,
                ageProof: data.ageProof,
                aadhar: data.aadhar,
                piCertificate: data.piCertificate,
                coPiCertificate: data.coPiCertificate,
                otherDocuments: data.otherDocuments,
              },
              stepNumber: response.res.application.stepNumber,
            },
            currentStep: ApplicationStep.TEAM_MEMBERS,
            successMessage: response.message,
            isLoading: false,
          });
          
          get().updateApplicationSteps();
          return true;
        }
      }
      
      set({ error: "Failed to add documents", isLoading: false });
      return false;
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to add documents";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Step 7: Add teammates and submit
  addApplicationTeammates: async (data: AddApplicationTeammatesRequest) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await applicantService.addApplicationTeammates(data);
      
      if (response.status === 200) {
        const currentApp = get().currentApplication;
        if (currentApp) {
          set({
            currentApplication: {
              ...currentApp,
              teamMateInvites: response.res.application.teamMateInvites,
              isSubmitted: data.isSubmitted,
            },
            successMessage: data.isSubmitted
              ? "Application submitted successfully!"
              : response.message,
            isLoading: false,
          });
          
          get().updateApplicationSteps();
          return true;
        }
      }
      
      set({ error: "Failed to add team members", isLoading: false });
      return false;
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to add team members";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Navigation helpers
  setCurrentStep: (step: ApplicationStep) => {
    if (get().canNavigateToStep(step)) {
      set({ currentStep: step });
      get().updateApplicationSteps();
    }
  },

  goToNextStep: () => {
    const currentStep = get().currentStep;
    if (currentStep < ApplicationStep.TEAM_MEMBERS) {
      set({ currentStep: (currentStep + 1) as ApplicationStep });
      get().updateApplicationSteps();
    }
  },

  goToPreviousStep: () => {
    const currentStep = get().currentStep;
    if (currentStep > ApplicationStep.BASIC_INFO) {
      set({ currentStep: (currentStep - 1) as ApplicationStep });
      get().updateApplicationSteps();
    }
  },

  canNavigateToStep: (step: ApplicationStep) => {
    const currentApp = get().currentApplication;
    if (!currentApp) {
      return step === ApplicationStep.BASIC_INFO;
    }
    
    // Can navigate to any step up to the current progress
    return step <= (currentApp.stepNumber || 1);
  },

  // State management
  setCurrentApplication: (application: Application | null) => {
    set({ currentApplication: application });
    if (application) {
      set({ currentStep: (application.stepNumber || 1) as ApplicationStep });
      get().updateApplicationSteps();
    }
  },

  updateApplicationSteps: () => {
    const { currentApplication, currentStep } = get();
    const stepNumber = currentApplication?.stepNumber || 0;
    
    const updatedSteps = initialSteps.map((step) => ({
      ...step,
      isCompleted: step.step < stepNumber,
      isActive: step.step === currentStep,
    }));
    
    set({ applicationSteps: updatedSteps });
  },

  clearError: () => set({ error: null }),
  
  clearSuccessMessage: () => set({ successMessage: null }),

  resetApplicationState: () => {
    set({
      currentApplication: null,
      currentStep: ApplicationStep.BASIC_INFO,
      applicationSteps: initialSteps,
      isLoading: false,
      error: null,
      successMessage: null,
    });
  },

  // Load saved application for draft restoration
  loadSavedApplication: async (cycleSlug: string): Promise<Application | null> => {
    set({ isLoading: true, error: null });
    try {
      const response = await applicantService.getApplicationWithCycle(cycleSlug);
      
      if (response.status === 200 && response.res.applicationDetails) {
        const savedApp = response.res.applicationDetails;
        
        // Map backend application to frontend Application type
        const application: Application = {
          id: savedApp.id,
          userId: savedApp.applicantId,
          cycleId: savedApp.cycleId,
          stepNumber: savedApp.stepNumber || 1,
          basicInfo: savedApp.basicInfo ? {
            title: savedApp.basicInfo.Title,
            summary: savedApp.basicInfo.Summary,
            problem: savedApp.basicInfo.Problem,
            solution: savedApp.basicInfo.Solution,
            innovation: savedApp.basicInfo.Innovation,
          } : undefined,
          budget: savedApp.budget,
          technicalSpec: savedApp.technicalSpecs,
          marketInfo: savedApp.marketInfo,
          revenueModel: savedApp.revenueModel,
          risks: savedApp.risks,
          milestones: savedApp.milestones,
          documents: savedApp.documents,
          teamMateInvites: savedApp.teamMateInvites,
          isSubmitted: savedApp.status === "SUBMITTED",
        };
        
        // Set the application and navigate to the correct step
        const targetStep = (savedApp.stepNumber || 1) as ApplicationStep;
        set({
          currentApplication: application,
          currentStep: targetStep,
          isLoading: false,
        });
        
        get().updateApplicationSteps();
        return application;
      }
      
      // No saved application found
      set({ isLoading: false });
      return null;
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to load saved application";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },
}));
