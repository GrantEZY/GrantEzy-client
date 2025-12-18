/**
 * Project Management store using Zustand for project assessment state management
 */
import { create } from 'zustand';
import type { ApiResponse } from '../types/api.types';
import { projectManagementService } from '../services/project-management.service';
import type {
  Project,
  CycleAssessmentCriteria,
  CycleAssessment,
  CreateProjectRequest,
  CreateProjectResponse,
  GetCycleProjectsRequest,
  GetProjectDetailsRequest,
  CreateCycleCriteriaRequest,
  SubmitAssessmentRequest,
  GetCycleCriteriaAssessmentsRequest,
  InviteReviewerForAssessmentRequest,
  CriteriaWithSubmissionStatus,
} from '../types/project-management.types';

interface ProjectManagementState {
  // PM: Projects
  projects: any[]; // GrantApplication[]
  currentProject: Project | null;
  isLoadingProjects: boolean;

  // PM: Criteria Management
  cycleCriterias: CycleAssessmentCriteria[];
  currentCriteria: CycleAssessmentCriteria | null;
  isLoadingCriterias: boolean;

  // PM: Assessment Submissions
  criteriaSubmissions: CycleAssessment[];
  isLoadingSubmissions: boolean;

  // Applicant: Assessment Criteria & Submission
  applicantCriterias: CriteriaWithSubmissionStatus[];
  applicantCurrentCriteria: CycleAssessmentCriteria | null;
  applicantCurrentSubmission: CycleAssessment | null;
  isLoadingApplicantCriterias: boolean;

  // Global loading and error states
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

interface ProjectManagementActions {
  // PM: Project Management
  createProject: (data: CreateProjectRequest) => Promise<CreateProjectResponse | null>;
  getCycleProjects: (data: GetCycleProjectsRequest) => Promise<void>;
  getProjectDetails: (data: GetProjectDetailsRequest) => Promise<Project | null>;

  // PM: Criteria Management
  createCycleCriteria: (data: CreateCycleCriteriaRequest) => Promise<boolean>;
  getCycleCriterias: (cycleSlug: string) => Promise<void>;
  getCycleCriteriaAssessments: (data: GetCycleCriteriaAssessmentsRequest) => Promise<void>;
  inviteReviewerForAssessment: (data: InviteReviewerForAssessmentRequest) => Promise<boolean>;

  // Applicant: Assessment Submission
  getApplicantCycleCriterias: (cycleSlug: string) => Promise<void>;
  getApplicantAssessmentSubmission: (cycleSlug: string, criteriaSlug: string) => Promise<void>;
  createApplicantAssessmentSubmission: (data: SubmitAssessmentRequest) => Promise<boolean>;

  // State management
  clearError: () => void;
  clearSuccessMessage: () => void;
  resetState: () => void;
}

type ProjectManagementStore = ProjectManagementState & ProjectManagementActions;

const initialState: ProjectManagementState = {
  // PM: Projects
  projects: [],
  currentProject: null,
  isLoadingProjects: false,

  // PM: Criteria Management
  cycleCriterias: [],
  currentCriteria: null,
  isLoadingCriterias: false,

  // PM: Assessment Submissions
  criteriaSubmissions: [],
  isLoadingSubmissions: false,

  // Applicant: Assessment Criteria & Submission
  applicantCriterias: [],
  applicantCurrentCriteria: null,
  applicantCurrentSubmission: null,
  isLoadingApplicantCriterias: false,

  // Global states
  isLoading: false,
  error: null,
  successMessage: null,
};

export const useProjectManagementStore = create<ProjectManagementStore>((set, get) => ({
  ...initialState,

  // ============================================================================
  // PM: Project Management Actions
  // ============================================================================

  createProject: async (data: CreateProjectRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectManagementService.createProject(data);
      
      if (response.data) {
        set({
          successMessage: response.message || 'Project created successfully',
          isLoading: false,
        });
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create project');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to create project';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  getCycleProjects: async (data: GetCycleProjectsRequest) => {
    set({ isLoadingProjects: true, error: null });
    try {
      const response = await projectManagementService.getCycleProjects(data);
      
      if (response.data?.applications) {
        set({
          projects: response.data.applications,
          isLoadingProjects: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch projects';
      set({ error: errorMessage, isLoadingProjects: false, projects: [] });
    }
  },

  getProjectDetails: async (data: GetProjectDetailsRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectManagementService.getProjectDetails(data);
      
      if (response.data?.project) {
        set({
          currentProject: response.data.project,
          isLoading: false,
        });
        return response.data.project;
      }
      
      throw new Error(response.message || 'Failed to fetch project details');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch project details';
      set({ error: errorMessage, isLoading: false, currentProject: null });
      return null;
    }
  },

  // ============================================================================
  // PM: Criteria Management Actions
  // ============================================================================

  createCycleCriteria: async (data: CreateCycleCriteriaRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectManagementService.createCycleCriteria(data);
      
      if (response.data) {
        set({
          successMessage: response.message || 'Assessment criteria created successfully',
          isLoading: false,
        });
        return true;
      }
      
      throw new Error(response.message || 'Failed to create criteria');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to create criteria';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  getCycleCriterias: async (cycleSlug: string) => {
    set({ isLoadingCriterias: true, error: null });
    try {
      const response = await projectManagementService.getCycleCriterias({ cycleSlug });
      
      if (response.data?.criterias) {
        set({
          cycleCriterias: response.data.criterias,
          isLoadingCriterias: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch criterias');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch criterias';
      set({ error: errorMessage, isLoadingCriterias: false, cycleCriterias: [] });
    }
  },

  getCycleCriteriaAssessments: async (data: GetCycleCriteriaAssessmentsRequest) => {
    set({ isLoadingSubmissions: true, error: null });
    try {
      const response = await projectManagementService.getCycleCriteriaAssessments(data);
      
      if (response.data) {
        set({
          criteriaSubmissions: response.data.submissions || [],
          currentCriteria: response.data.criteria || null,
          isLoadingSubmissions: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch submissions');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch submissions';
      set({ error: errorMessage, isLoadingSubmissions: false, criteriaSubmissions: [] });
    }
  },

  inviteReviewerForAssessment: async (data: InviteReviewerForAssessmentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectManagementService.inviteReviewerForAssessment(data);
      
      if (response.data) {
        set({
          successMessage: response.message || 'Reviewer invited successfully',
          isLoading: false,
        });
        return true;
      }
      
      throw new Error(response.message || 'Failed to invite reviewer');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to invite reviewer';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // ============================================================================
  // Applicant: Assessment Submission Actions
  // ============================================================================

  getApplicantCycleCriterias: async (cycleSlug: string) => {
    set({ isLoadingApplicantCriterias: true, error: null });
    try {
      const response = await projectManagementService.getApplicantCycleCriterias({ cycleSlug });
      
      if (response.data?.criterias) {
        set({
          applicantCriterias: response.data.criterias,
          isLoadingApplicantCriterias: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch criterias');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch criterias';
      set({ error: errorMessage, isLoadingApplicantCriterias: false, applicantCriterias: [] });
    }
  },

  getApplicantAssessmentSubmission: async (cycleSlug: string, criteriaSlug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectManagementService.getApplicantAssessmentSubmission({
        cycleSlug,
        criteriaSlug,
      });
      
      if (response.data) {
        set({
          applicantCurrentCriteria: response.data.criteria || null,
          applicantCurrentSubmission: response.data.cycleSubmission || null,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch assessment details');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to fetch assessment details';
      set({
        error: errorMessage,
        isLoading: false,
        applicantCurrentCriteria: null,
        applicantCurrentSubmission: null,
      });
    }
  },

  createApplicantAssessmentSubmission: async (data: SubmitAssessmentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectManagementService.createApplicantAssessmentSubmission(data);
      
      if (response.data) {
        set({
          applicantCurrentSubmission: response.data.submission,
          successMessage: response.message || 'Assessment submitted successfully',
          isLoading: false,
        });
        return true;
      }
      
      throw new Error(response.message || 'Failed to submit assessment');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to submit assessment';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // ============================================================================
  // State Management Actions
  // ============================================================================

  clearError: () => set({ error: null }),

  clearSuccessMessage: () => set({ successMessage: null }),

  resetState: () => set(initialState),
}));
