/**
 * Custom hook for Project Management store
 * Provides easy access to project state and actions
 */
import { useProjectStore } from '../store/project.store';

export const useProjectManagement = () => {
  // Projects state
  const projects = useProjectStore((state) => state.projects);
  const projectsPagination = useProjectStore((state) => state.projectsPagination);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const projectsError = useProjectStore((state) => state.projectsError);

  // Current project
  const currentProject = useProjectStore((state) => state.currentProject);
  const isProjectLoading = useProjectStore((state) => state.isProjectLoading);
  const projectError = useProjectStore((state) => state.projectError);

  // Criterias
  const criterias = useProjectStore((state) => state.criterias);
  const currentCriteria = useProjectStore((state) => state.currentCriteria);
  const isCriteriasLoading = useProjectStore((state) => state.isCriteriasLoading);
  const criteriasError = useProjectStore((state) => state.criteriasError);

  // Assessments
  const assessments = useProjectStore((state) => state.assessments);
  const currentAssessment = useProjectStore((state) => state.currentAssessment);
  const isAssessmentsLoading = useProjectStore((state) => state.isAssessmentsLoading);
  const assessmentsError = useProjectStore((state) => state.assessmentsError);

  // Project Reviews
  const projectReviews = useProjectStore((state) => state.projectReviews);
  const currentProjectReview = useProjectStore((state) => state.currentProjectReview);
  const currentProjectReviewAssessment = useProjectStore((state) => state.currentProjectReviewAssessment);
  const currentProjectReviewProject = useProjectStore((state) => state.currentProjectReviewProject);
  const currentProjectReviewCriteria = useProjectStore((state) => state.currentProjectReviewCriteria);
  const isProjectReviewsLoading = useProjectStore((state) => state.isProjectReviewsLoading);
  const projectReviewsError = useProjectStore((state) => state.projectReviewsError);

  // Project Actions
  const createProject = useProjectStore((state) => state.createProject);
  const getCycleProjects = useProjectStore((state) => state.getCycleProjects);
  const getProjectDetails = useProjectStore((state) => state.getProjectDetails);
  const clearProjects = useProjectStore((state) => state.clearProjects);
  const clearProject = useProjectStore((state) => state.clearProject);

  // Criteria Actions
  const createCycleCriteria = useProjectStore((state) => state.createCycleCriteria);
  const getCycleCriterias = useProjectStore((state) => state.getCycleCriterias);
  const clearCriterias = useProjectStore((state) => state.clearCriterias);
  const clearCurrentCriteria = useProjectStore((state) => state.clearCurrentCriteria);

  // Assessment Actions (PM)
  const getCycleCriteriaAssessments = useProjectStore((state) => state.getCycleCriteriaAssessments);
  const inviteReviewerForAssessment = useProjectStore((state) => state.inviteReviewerForAssessment);

  // Assessment Actions (Applicant)
  const getApplicantCycleCriterias = useProjectStore((state) => state.getApplicantCycleCriterias);
  const getApplicantAssessmentSubmission = useProjectStore((state) => state.getApplicantAssessmentSubmission);
  const createAssessmentSubmission = useProjectStore((state) => state.createAssessmentSubmission);
  const clearAssessments = useProjectStore((state) => state.clearAssessments);

  // Clear all
  const clearAll = useProjectStore((state) => state.clearAll);

  return {
    // Projects
    projects,
    projectsPagination,
    isProjectsLoading,
    projectsError,
    getCycleProjects,
    clearProjects,

    // Current project
    currentProject,
    isProjectLoading,
    projectError,
    createProject,
    getProjectDetails,
    clearProject,

    // Criterias
    criterias,
    currentCriteria,
    isCriteriasLoading,
    criteriasError,
    createCycleCriteria,
    getCycleCriterias,
    clearCriterias,
    clearCurrentCriteria,

    // Assessments
    assessments,
    currentAssessment,
    isAssessmentsLoading,
    assessmentsError,
    getCycleCriteriaAssessments,
    inviteReviewerForAssessment,
    getApplicantCycleCriterias,
    getApplicantAssessmentSubmission,
    createAssessmentSubmission,
    clearAssessments,

    // Project Reviews
    projectReviews,
    currentProjectReview,
    currentProjectReviewAssessment,
    currentProjectReviewProject,
    currentProjectReviewCriteria,
    isProjectReviewsLoading,
    projectReviewsError,

    // Clear all
    clearAll,
  };
};
