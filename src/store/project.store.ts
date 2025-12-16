/**
 * Project Management Store - State management for project-related operations
 */
import { create } from 'zustand';

import { projectManagementService } from '../services/project.service';
import {
  CreateCycleCriteriaRequest,
  CreateProjectRequest,
  GetCycleCriteriasRequest,
  GetCycleProjectsRequest,
  GetProjectDetailsRequest,
  ProjectState,
  GetApplicantCycleCriteriasRequest,
  GetApplicantAssessmentSubmissionRequest,
  CreateAssessmentSubmissionRequest,
  GetCycleCriteriaAssessmentsRequest,
  InviteReviewerForAssessmentRequest,
} from '../types/project.types';

interface ProjectActions {
  // Project actions
  createProject: (data: CreateProjectRequest) => Promise<boolean>;
  getCycleProjects: (params: GetCycleProjectsRequest) => Promise<void>;
  getProjectDetails: (params: GetProjectDetailsRequest) => Promise<void>;
  clearProjects: () => void;
  clearProject: () => void;

  // Criteria actions
  createCycleCriteria: (data: CreateCycleCriteriaRequest) => Promise<boolean>;
  getCycleCriterias: (params: GetCycleCriteriasRequest) => Promise<void>;
  clearCriterias: () => void;

  // Assessment actions (PM)
  getCycleCriteriaAssessments: (params: GetCycleCriteriaAssessmentsRequest) => Promise<void>;
  inviteReviewerForAssessment: (data: InviteReviewerForAssessmentRequest) => Promise<boolean>;

  // Assessment actions (Applicant)
  getApplicantCycleCriterias: (params: GetApplicantCycleCriteriasRequest) => Promise<void>;
  getApplicantAssessmentSubmission: (params: GetApplicantAssessmentSubmissionRequest) => Promise<void>;
  createAssessmentSubmission: (data: CreateAssessmentSubmissionRequest) => Promise<boolean>;
  clearAssessments: () => void;

  // Clear all
  clearAll: () => void;
}

type ProjectStore = ProjectState & ProjectActions;

export const useProjectStore = create<ProjectStore>((set, _get) => ({
  // Initial state
  projects: [],
  projectsPagination: null,
  isProjectsLoading: false,
  projectsError: null,

  currentProject: null,
  isProjectLoading: false,
  projectError: null,

  criterias: [],
  isCriteriasLoading: false,
  criteriasError: null,

  assessments: [],
  currentAssessment: null,
  isAssessmentsLoading: false,
  assessmentsError: null,

  projectReviews: [],
  currentProjectReview: null,
  currentProjectReviewAssessment: null,
  currentProjectReviewProject: null,
  currentProjectReviewCriteria: null,
  isProjectReviewsLoading: false,
  projectReviewsError: null,

  // ============= Project Actions =============

  /**
   * Create a new project from an approved application
   */
  createProject: async (data: CreateProjectRequest): Promise<boolean> => {
    set({ isProjectLoading: true, projectError: null });
    try {
      const response = await projectManagementService.createProject(data);

      if (response.status === 200 || response.status === 201) {
        set({ isProjectLoading: false });
        return true;
      } else {
        set({
          projectError: response.message || 'Failed to create project',
          isProjectLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while creating project';
      set({
        projectError: errorMessage,
        isProjectLoading: false,
      });
      console.error('Create project error:', error);
      return false;
    }
  },

  /**
   * Get all projects in a cycle
   */
  getCycleProjects: async (params: GetCycleProjectsRequest) => {
    set({ isProjectsLoading: true, projectsError: null });
    try {
      const response = await projectManagementService.getCycleProjects(params);

      if (response.status === 200 && response.res) {
        set({
          projects: response.res.applications || [],
          projectsPagination: null,
          isProjectsLoading: false,
        });
      } else {
        set({
          projectsError: response.message || 'Failed to fetch projects',
          isProjectsLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while fetching projects';
      set({
        projectsError: errorMessage,
        isProjectsLoading: false,
      });
      console.error('Get cycle projects error:', error);
    }
  },

  /**
   * Get detailed information about a specific project
   */
  getProjectDetails: async (params: GetProjectDetailsRequest) => {
    set({ isProjectLoading: true, projectError: null });
    try {
      const response = await projectManagementService.getProjectDetails(params);

      if (response.status === 200 && response.res) {
        set({
          currentProject: response.res.project,
          isProjectLoading: false,
        });
      } else {
        set({
          projectError: response.message || 'Failed to fetch project details',
          isProjectLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while fetching project details';
      set({
        projectError: errorMessage,
        isProjectLoading: false,
      });
      console.error('Get project details error:', error);
    }
  },

  clearProjects: () => {
    set({
      projects: [],
      projectsPagination: null,
      projectsError: null,
    });
  },

  clearProject: () => {
    set({
      currentProject: null,
      isProjectLoading: false,
      projectError: null,
    });
  },

  // ============= Criteria Actions =============

  /**
   * Create assessment criteria for a cycle
   */
  createCycleCriteria: async (data: CreateCycleCriteriaRequest): Promise<boolean> => {
    set({ isCriteriasLoading: true, criteriasError: null });
    try {
      const response = await projectManagementService.createCycleCriteria(data);

      if (response.status === 200 || response.status === 201) {
        set({ isCriteriasLoading: false });
        return true;
      } else {
        set({
          criteriasError: response.message || 'Failed to create criteria',
          isCriteriasLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while creating criteria';
      set({
        criteriasError: errorMessage,
        isCriteriasLoading: false,
      });
      console.error('Create criteria error:', error);
      return false;
    }
  },

  /**
   * Get all assessment criteria for a cycle
   */
  getCycleCriterias: async (params: GetCycleCriteriasRequest) => {
    set({ isCriteriasLoading: true, criteriasError: null });
    try {
      const response = await projectManagementService.getCycleCriterias(params);

      if (response.status === 200 && response.res) {
        set({
          criterias: response.res.criterias || [],
          isCriteriasLoading: false,
        });
      } else {
        set({
          criteriasError: response.message || 'Failed to fetch criterias',
          isCriteriasLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while fetching criterias';
      set({
        criteriasError: errorMessage,
        isCriteriasLoading: false,
      });
      console.error('Get criterias error:', error);
    }
  },

  clearCriterias: () => {
    set({
      criterias: [],
      criteriasError: null,
    });
  },

  // ============= Assessment Actions (PM) =============

  /**
   * Get all assessment submissions for a specific criteria (PM view)
   */
  getCycleCriteriaAssessments: async (params: GetCycleCriteriaAssessmentsRequest) => {
    set({ isAssessmentsLoading: true, assessmentsError: null });
    try {
      const response = await projectManagementService.getCycleCriteriaAssessments(params);

      if (response.status === 200 && response.res) {
        set({
          assessments: response.res.submissions || [],
          criterias: [response.res.criteria],
          isAssessmentsLoading: false,
        });
      } else {
        set({
          assessmentsError: response.message || 'Failed to fetch assessments',
          isAssessmentsLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while fetching assessments';
      set({
        assessmentsError: errorMessage,
        isAssessmentsLoading: false,
      });
      console.error('Get assessments error:', error);
    }
  },

  /**
   * Invite a reviewer to review a project assessment submission
   */
  inviteReviewerForAssessment: async (data: InviteReviewerForAssessmentRequest): Promise<boolean> => {
    set({ isAssessmentsLoading: true, assessmentsError: null });
    try {
      const response = await projectManagementService.inviteReviewerForAssessment(data);

      if (response.status === 200 || response.status === 201) {
        set({ isAssessmentsLoading: false });
        return true;
      } else {
        set({
          assessmentsError: response.message || 'Failed to invite reviewer',
          isAssessmentsLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while inviting reviewer';
      set({
        assessmentsError: errorMessage,
        isAssessmentsLoading: false,
      });
      console.error('Invite reviewer error:', error);
      return false;
    }
  },

  // ============= Assessment Actions (Applicant) =============

  /**
   * Get all assessment criteria available for the applicant's project
   */
  getApplicantCycleCriterias: async (params: GetApplicantCycleCriteriasRequest) => {
    set({ isCriteriasLoading: true, criteriasError: null });
    try {
      const response = await projectManagementService.getApplicantCycleCriterias(params);

      if (response.status === 200 && response.res) {
        set({
          criterias: response.res.criterias || [],
          isCriteriasLoading: false,
        });
      } else {
        set({
          criteriasError: response.message || 'Failed to fetch criterias',
          isCriteriasLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while fetching criterias';
      set({
        criteriasError: errorMessage,
        isCriteriasLoading: false,
      });
      console.error('Get applicant criterias error:', error);
    }
  },

  /**
   * Get criteria details and user's submission if exists
   */
  getApplicantAssessmentSubmission: async (params: GetApplicantAssessmentSubmissionRequest) => {
    set({ isAssessmentsLoading: true, assessmentsError: null });
    try {
      const response = await projectManagementService.getApplicantAssessmentSubmission(params);

      if (response.status === 200 && response.res) {
        set({
          criterias: [response.res.criteria],
          currentAssessment: response.res.cycleSubmission,
          isAssessmentsLoading: false,
        });
      } else {
        set({
          assessmentsError: response.message || 'Failed to fetch submission',
          isAssessmentsLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while fetching submission';
      set({
        assessmentsError: errorMessage,
        isAssessmentsLoading: false,
      });
      console.error('Get applicant submission error:', error);
    }
  },

  /**
   * Create or update assessment submission for a criteria
   */
  createAssessmentSubmission: async (data: CreateAssessmentSubmissionRequest): Promise<boolean> => {
    set({ isAssessmentsLoading: true, assessmentsError: null });
    try {
      const response = await projectManagementService.createAssessmentSubmission(data);

      if ((response.status === 200 || response.status === 201) && response.res) {
        set({
          currentAssessment: response.res.submission,
          isAssessmentsLoading: false,
        });
        return true;
      } else {
        set({
          assessmentsError: response.message || 'Failed to submit assessment',
          isAssessmentsLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while submitting assessment';
      set({
        assessmentsError: errorMessage,
        isAssessmentsLoading: false,
      });
      console.error('Submit assessment error:', error);
      return false;
    }
  },

  clearAssessments: () => {
    set({
      assessments: [],
      currentAssessment: null,
      assessmentsError: null,
    });
  },

  // Clear all
  clearAll: () => {
    set({
      projects: [],
      projectsPagination: null,
      isProjectsLoading: false,
      projectsError: null,
      currentProject: null,
      isProjectLoading: false,
      projectError: null,
      criterias: [],
      isCriteriasLoading: false,
      criteriasError: null,
      assessments: [],
      currentAssessment: null,
      isAssessmentsLoading: false,
      assessmentsError: null,
      projectReviews: [],
      currentProjectReview: null,
      currentProjectReviewAssessment: null,
      currentProjectReviewProject: null,
      currentProjectReviewCriteria: null,
      isProjectReviewsLoading: false,
      projectReviewsError: null,
    });
  },
}));
