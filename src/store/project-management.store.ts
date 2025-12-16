/**
 * Project Management store using Zustand for project-related state management
 */
import { create } from 'zustand';
import { projectManagementService } from '../services/project-management.service';
import type {
  ProjectManagementState,
  CreateProjectDTO,
  GetCycleProjectsDTO,
  GetProjectDetailsDTO,
  CreateCycleCriteriaDTO,
  GetCycleCriteriasDTO,
  GetCycleCriteriaDetailsWithSubmissionDTO,
  SubmitAssessmentDTO,
  GetCycleCriteriaDetailsWithAssessmentsDTO,
  InviteReviewerForAssessmentDTO,
} from '../types/project-management.types';

interface ProjectManagementActions {
  // PM: Project Management
  createProject: (data: CreateProjectDTO) => Promise<{ applicationId: string; projectId: string } | null>;
  getCycleProjects: (params: GetCycleProjectsDTO) => Promise<void>;
  getProjectDetails: (params: GetProjectDetailsDTO) => Promise<void>;

  // PM: Cycle Criteria Management
  createCycleCriteria: (data: CreateCycleCriteriaDTO) => Promise<string | null>;
  getCycleCriterias: (params: GetCycleCriteriasDTO) => Promise<void>;
  getCycleCriteriaAssessments: (params: GetCycleCriteriaDetailsWithAssessmentsDTO) => Promise<void>;
  inviteReviewerForAssessment: (data: InviteReviewerForAssessmentDTO) => Promise<boolean>;

  // Applicant: Project Assessment
  getApplicantCycleCriterias: (params: GetCycleCriteriasDTO) => Promise<void>;
  getApplicantAssessmentSubmission: (params: GetCycleCriteriaDetailsWithSubmissionDTO) => Promise<void>;
  createAssessmentSubmission: (data: SubmitAssessmentDTO) => Promise<boolean>;

  // State reset
  clearCurrentProject: () => void;
  clearCurrentCriteria: () => void;
  clearCurrentAssessment: () => void;
  clearProjectReviewDetails: () => void;
  clearAllErrors: () => void;
}

type ProjectManagementStore = ProjectManagementState & ProjectManagementActions;

export const useProjectManagementStore = create<ProjectManagementStore>((set, get) => ({
  // ============= Initial State =============
  
  // Projects
  projects: [],
  currentProject: null,
  isLoadingProjects: false,
  projectsError: null,

  // Criteria
  cycleCriterias: [],
  currentCriteria: null,
  isLoadingCriteria: false,
  criteriaError: null,

  // Assessments
  assessments: [],
  currentAssessment: null,
  isLoadingAssessments: false,
  assessmentsError: null,

  // Project Reviews
  projectReviews: [],
  currentProjectReview: null,
  currentProjectReviewAssessment: null,
  currentProjectReviewProject: null,
  currentProjectReviewCriteria: null,
  isLoadingProjectReviews: false,
  projectReviewsError: null,

  // ============= State Setters =============

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setCycleCriterias: (criterias) => set({ cycleCriterias: criterias }),
  setCurrentCriteria: (criteria) => set({ currentCriteria: criteria }),
  setAssessments: (assessments) => set({ assessments }),
  setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
  setProjectReviews: (reviews) => set({ projectReviews: reviews }),
  setCurrentProjectReviewDetails: (data) =>
    set({
      currentProjectReview: data.review,
      currentProjectReviewAssessment: data.assessment,
      currentProjectReviewProject: data.project,
      currentProjectReviewCriteria: data.criteria,
    }),
  setProjectsLoading: (loading) => set({ isLoadingProjects: loading }),
  setCriteriaLoading: (loading) => set({ isLoadingCriteria: loading }),
  setAssessmentsLoading: (loading) => set({ isLoadingAssessments: loading }),
  setProjectReviewsLoading: (loading) => set({ isLoadingProjectReviews: loading }),
  setProjectsError: (error) => set({ projectsError: error }),
  setCriteriaError: (error) => set({ criteriaError: error }),
  setAssessmentsError: (error) => set({ assessmentsError: error }),
  setProjectReviewsError: (error) => set({ projectReviewsError: error }),

  // ============= PM: Project Management Actions =============

  createProject: async (data) => {
    set({ isLoadingProjects: true, projectsError: null });
    try {
      const response = await projectManagementService.createProject(data);
      
      if (response.status === 201 && response.data) {
        set({ isLoadingProjects: false });
        return response.data;
      }
      
      set({ 
        isLoadingProjects: false, 
        projectsError: response.message || 'Failed to create project' 
      });
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      set({ isLoadingProjects: false, projectsError: errorMessage });
      return null;
    }
  },

  getCycleProjects: async (params) => {
    set({ isLoadingProjects: true, projectsError: null });
    try {
      const response = await projectManagementService.getCycleProjects(params);
      
      if (response.status === 200 && response.data) {
        set({ 
          projects: response.data.applications,
          isLoadingProjects: false 
        });
      } else {
        set({ 
          isLoadingProjects: false, 
          projectsError: response.message || 'Failed to fetch projects' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
      set({ isLoadingProjects: false, projectsError: errorMessage });
    }
  },

  getProjectDetails: async (params) => {
    set({ isLoadingProjects: true, projectsError: null });
    try {
      const response = await projectManagementService.getProjectDetails(params);
      
      if (response.status === 200 && response.data) {
        set({ 
          currentProject: response.data.project,
          isLoadingProjects: false 
        });
      } else {
        set({ 
          isLoadingProjects: false, 
          projectsError: response.message || 'Failed to fetch project details' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project details';
      set({ isLoadingProjects: false, projectsError: errorMessage });
    }
  },

  // ============= PM: Cycle Criteria Management Actions =============

  createCycleCriteria: async (data) => {
    set({ isLoadingCriteria: true, criteriaError: null });
    try {
      const response = await projectManagementService.createCycleCriteria(data);
      
      if (response.status === 201 && response.data) {
        set({ isLoadingCriteria: false });
        return response.data.criteriaName;
      }
      
      set({ 
        isLoadingCriteria: false, 
        criteriaError: response.message || 'Failed to create criteria' 
      });
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create criteria';
      set({ isLoadingCriteria: false, criteriaError: errorMessage });
      return null;
    }
  },

  getCycleCriterias: async (params) => {
    set({ isLoadingCriteria: true, criteriaError: null });
    try {
      const response = await projectManagementService.getCycleCriterias(params);
      
      if (response.status === 200 && response.data) {
        set({ 
          cycleCriterias: response.data.criterias,
          isLoadingCriteria: false 
        });
      } else {
        set({ 
          isLoadingCriteria: false, 
          criteriaError: response.message || 'Failed to fetch criteria' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch criteria';
      set({ isLoadingCriteria: false, criteriaError: errorMessage });
    }
  },

  getCycleCriteriaAssessments: async (params) => {
    set({ isLoadingAssessments: true, assessmentsError: null });
    try {
      const response = await projectManagementService.getCycleCriteriaAssessments(params);
      
      if (response.status === 200 && response.data) {
        set({ 
          assessments: response.data.submissions,
          currentCriteria: response.data.criteria,
          isLoadingAssessments: false 
        });
      } else {
        set({ 
          isLoadingAssessments: false, 
          assessmentsError: response.message || 'Failed to fetch assessments' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch assessments';
      set({ isLoadingAssessments: false, assessmentsError: errorMessage });
    }
  },

  inviteReviewerForAssessment: async (data) => {
    set({ isLoadingAssessments: true, assessmentsError: null });
    try {
      const response = await projectManagementService.inviteReviewerForAssessment(data);
      
      if (response.status === 200 || response.status === 201) {
        set({ isLoadingAssessments: false });
        return true;
      }
      
      set({ 
        isLoadingAssessments: false, 
        assessmentsError: response.message || 'Failed to invite reviewer' 
      });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite reviewer';
      set({ isLoadingAssessments: false, assessmentsError: errorMessage });
      return false;
    }
  },

  // ============= Applicant: Project Assessment Actions =============

  getApplicantCycleCriterias: async (params) => {
    set({ isLoadingCriteria: true, criteriaError: null });
    try {
      const response = await projectManagementService.getApplicantCycleCriterias(params);
      
      if (response.status === 200 && response.data) {
        set({ 
          cycleCriterias: response.data.criterias,
          isLoadingCriteria: false 
        });
      } else {
        set({ 
          isLoadingCriteria: false, 
          criteriaError: response.message || 'Failed to fetch criteria' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch criteria';
      set({ isLoadingCriteria: false, criteriaError: errorMessage });
    }
  },

  getApplicantAssessmentSubmission: async (params) => {
    set({ isLoadingAssessments: true, assessmentsError: null });
    try {
      const response = await projectManagementService.getApplicantAssessmentSubmission(params);
      
      if (response.status === 200 && response.data) {
        set({ 
          currentCriteria: response.data.criteria,
          currentAssessment: response.data.cycleSubmission,
          isLoadingAssessments: false 
        });
      } else {
        set({ 
          isLoadingAssessments: false, 
          assessmentsError: response.message || 'Failed to fetch submission' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch submission';
      set({ isLoadingAssessments: false, assessmentsError: errorMessage });
    }
  },

  createAssessmentSubmission: async (data) => {
    set({ isLoadingAssessments: true, assessmentsError: null });
    try {
      const response = await projectManagementService.createAssessmentSubmission(data);
      
      if ((response.status === 200 || response.status === 201) && response.data) {
        set({ 
          currentAssessment: response.data.submission,
          isLoadingAssessments: false 
        });
        return true;
      }
      
      set({ 
        isLoadingAssessments: false, 
        assessmentsError: response.message || 'Failed to submit assessment' 
      });
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit assessment';
      set({ isLoadingAssessments: false, assessmentsError: errorMessage });
      return false;
    }
  },

  // ============= State Reset Actions =============

  clearCurrentProject: () => set({ currentProject: null, projectsError: null }),
  clearCurrentCriteria: () => set({ currentCriteria: null, criteriaError: null }),
  clearCurrentAssessment: () => set({ currentAssessment: null, assessmentsError: null }),
  clearProjectReviewDetails: () =>
    set({
      currentProjectReview: null,
      currentProjectReviewAssessment: null,
      currentProjectReviewProject: null,
      currentProjectReviewCriteria: null,
      projectReviewsError: null,
    }),
  clearAllErrors: () =>
    set({
      projectsError: null,
      criteriaError: null,
      assessmentsError: null,
      projectReviewsError: null,
    }),
}));
