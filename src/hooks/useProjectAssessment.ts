/**
 * Custom hook for project assessment management store
 * Provides easy access to project assessment state and actions
 */
import { useProjectManagementStore } from '../store/project-management.store';
import type {
  CreateProjectRequest,
  GetCycleProjectsRequest,
  GetProjectDetailsRequest,
  CreateCycleCriteriaRequest,
  SubmitAssessmentRequest,
  GetCycleCriteriaAssessmentsRequest,
  InviteReviewerForAssessmentRequest,
} from '../types/project-management.types';

export const useProjectAssessment = () => {
  // State selectors - PM: Projects
  const projects = useProjectManagementStore((state) => state.projects);
  const currentProject = useProjectManagementStore((state) => state.currentProject);
  const isLoadingProjects = useProjectManagementStore((state) => state.isLoadingProjects);

  // State selectors - PM: Criteria Management
  const cycleCriterias = useProjectManagementStore((state) => state.cycleCriterias);
  const currentCriteria = useProjectManagementStore((state) => state.currentCriteria);
  const isLoadingCriterias = useProjectManagementStore((state) => state.isLoadingCriterias);

  // State selectors - PM: Assessment Submissions
  const criteriaSubmissions = useProjectManagementStore((state) => state.criteriaSubmissions);
  const isLoadingSubmissions = useProjectManagementStore((state) => state.isLoadingSubmissions);

  // State selectors - Applicant: Assessment Criteria & Submission
  const applicantCriterias = useProjectManagementStore((state) => state.applicantCriterias);
  const applicantCurrentCriteria = useProjectManagementStore(
    (state) => state.applicantCurrentCriteria
  );
  const applicantCurrentSubmission = useProjectManagementStore(
    (state) => state.applicantCurrentSubmission
  );
  const isLoadingApplicantCriterias = useProjectManagementStore(
    (state) => state.isLoadingApplicantCriterias
  );

  // Global state selectors
  const isLoading = useProjectManagementStore((state) => state.isLoading);
  const error = useProjectManagementStore((state) => state.error);
  const successMessage = useProjectManagementStore((state) => state.successMessage);

  // Action selectors - PM: Project Management
  const createProject = useProjectManagementStore((state) => state.createProject);
  const getCycleProjects = useProjectManagementStore((state) => state.getCycleProjects);
  const getProjectDetails = useProjectManagementStore((state) => state.getProjectDetails);

  // Action selectors - PM: Criteria Management
  const createCycleCriteria = useProjectManagementStore((state) => state.createCycleCriteria);
  const getCycleCriterias = useProjectManagementStore((state) => state.getCycleCriterias);
  const getCycleCriteriaAssessments = useProjectManagementStore(
    (state) => state.getCycleCriteriaAssessments
  );
  const inviteReviewerForAssessment = useProjectManagementStore(
    (state) => state.inviteReviewerForAssessment
  );

  // Action selectors - Applicant: Assessment Submission
  const getApplicantCycleCriterias = useProjectManagementStore(
    (state) => state.getApplicantCycleCriterias
  );
  const getApplicantAssessmentSubmission = useProjectManagementStore(
    (state) => state.getApplicantAssessmentSubmission
  );
  const createApplicantAssessmentSubmission = useProjectManagementStore(
    (state) => state.createApplicantAssessmentSubmission
  );

  // State management actions
  const clearError = useProjectManagementStore((state) => state.clearError);
  const clearSuccessMessage = useProjectManagementStore((state) => state.clearSuccessMessage);
  const resetState = useProjectManagementStore((state) => state.resetState);

  // Computed values
  const hasProjects = projects.length > 0;
  const hasCriterias = cycleCriterias.length > 0;
  const hasApplicantCriterias = applicantCriterias.length > 0;
  const hasSubmissions = criteriaSubmissions.length > 0;
  const hasCurrentSubmission = applicantCurrentSubmission !== null;

  // Helper functions for assessment submission summary
  const getSubmissionSummary = () => {
    const totalCriteria = applicantCriterias.length;
    const submittedCount = applicantCriterias.filter((c) => c.hasSubmitted).length;
    const pendingCount = totalCriteria - submittedCount;

    return {
      totalCriteria,
      submittedCount,
      pendingCount,
      completionPercentage: totalCriteria > 0 ? Math.round((submittedCount / totalCriteria) * 100) : 0,
    };
  };

  // Wrapper functions for type safety and convenience
  const handleCreateProject = async (data: CreateProjectRequest) => {
    return await createProject(data);
  };

  const handleGetCycleProjects = async (data: GetCycleProjectsRequest) => {
    await getCycleProjects(data);
  };

  const handleGetProjectDetails = async (data: GetProjectDetailsRequest) => {
    return await getProjectDetails(data);
  };

  const handleCreateCycleCriteria = async (data: CreateCycleCriteriaRequest) => {
    return await createCycleCriteria(data);
  };

  const handleGetCycleCriterias = async (cycleSlug: string) => {
    await getCycleCriterias(cycleSlug);
  };

  const handleGetCycleCriteriaAssessments = async (data: GetCycleCriteriaAssessmentsRequest) => {
    await getCycleCriteriaAssessments(data);
  };

  const handleInviteReviewer = async (data: InviteReviewerForAssessmentRequest) => {
    return await inviteReviewerForAssessment(data);
  };

  const handleGetApplicantCriterias = async (cycleSlug: string) => {
    await getApplicantCycleCriterias(cycleSlug);
  };

  const handleGetApplicantSubmission = async (cycleSlug: string, criteriaSlug: string) => {
    await getApplicantAssessmentSubmission(cycleSlug, criteriaSlug);
  };

  const handleSubmitAssessment = async (data: SubmitAssessmentRequest) => {
    return await createApplicantAssessmentSubmission(data);
  };

  return {
    // State - PM: Projects
    projects,
    currentProject,
    isLoadingProjects,

    // State - PM: Criteria Management
    cycleCriterias,
    currentCriteria,
    isLoadingCriterias,

    // State - PM: Assessment Submissions
    criteriaSubmissions,
    isLoadingSubmissions,

    // State - Applicant: Assessment Criteria & Submission
    applicantCriterias,
    applicantCurrentCriteria,
    applicantCurrentSubmission,
    isLoadingApplicantCriterias,

    // Global state
    isLoading,
    error,
    successMessage,

    // Actions - PM: Project Management
    createProject: handleCreateProject,
    getCycleProjects: handleGetCycleProjects,
    getProjectDetails: handleGetProjectDetails,

    // Actions - PM: Criteria Management
    createCycleCriteria: handleCreateCycleCriteria,
    getCycleCriterias: handleGetCycleCriterias,
    getCycleCriteriaAssessments: handleGetCycleCriteriaAssessments,
    inviteReviewerForAssessment: handleInviteReviewer,

    // Actions - Applicant: Assessment Submission
    getApplicantCycleCriterias: handleGetApplicantCriterias,
    getApplicantAssessmentSubmission: handleGetApplicantSubmission,
    createApplicantAssessmentSubmission: handleSubmitAssessment,

    // State management
    clearError,
    clearSuccessMessage,
    resetState,

    // Computed values
    hasProjects,
    hasCriterias,
    hasApplicantCriterias,
    hasSubmissions,
    hasCurrentSubmission,

    // Helper functions
    getSubmissionSummary,
  };
};
