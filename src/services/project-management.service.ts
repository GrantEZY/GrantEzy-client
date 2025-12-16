/**
 * Project Management service for handling project-related API calls
 */
import { API_CONFIG } from '../lib/config/api.config';
import { httpClient } from '../lib/http/http-client';
import type {
  CreateProjectDTO,
  CreateProjectResponse,
  GetCycleProjectsDTO,
  GetCycleProjectsResponse,
  GetProjectDetailsDTO,
  GetProjectDetailsResponse,
  CreateCycleCriteriaDTO,
  CreateCriteriaResponse,
  GetCycleCriteriasDTO,
  GetCycleCriteriasResponse,
  GetCycleCriteriaDetailsWithSubmissionDTO,
  GetCycleAssessmentDetailsResponse,
  SubmitAssessmentDTO,
  CreateAssessmentSubmissionResponse,
  GetCycleCriteriaDetailsWithAssessmentsDTO,
  GetCycleCriteriaAssessmentsResponse,
  InviteReviewerForAssessmentDTO,
} from '../types/project-management.types';
import type { ApiResponse } from '../types/api.types';

export class ProjectManagementService {
  // ============= PM: Project Management =============

  /**
   * Create a new project from an approved application
   * @param data - Project creation data
   */
  async createProject(data: CreateProjectDTO): Promise<ApiResponse<CreateProjectResponse>> {
    return httpClient.post<ApiResponse<CreateProjectResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_PROJECT,
      data
    );
  }

  /**
   * Get all projects in a cycle
   * @param params - Cycle slug and pagination params
   */
  async getCycleProjects(params: GetCycleProjectsDTO): Promise<ApiResponse<GetCycleProjectsResponse>> {
    return httpClient.get<ApiResponse<GetCycleProjectsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_PROJECTS,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Get detailed information about a specific project
   * @param params - Cycle slug and application slug
   */
  async getProjectDetails(params: GetProjectDetailsDTO): Promise<ApiResponse<GetProjectDetailsResponse>> {
    return httpClient.get<ApiResponse<GetProjectDetailsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_PROJECT_DETAILS,
      params as unknown as Record<string, string>
    );
  }

  // ============= PM: Cycle Criteria Management =============

  /**
   * Create assessment criteria for a cycle
   * @param data - Criteria creation data
   */
  async createCycleCriteria(data: CreateCycleCriteriaDTO): Promise<ApiResponse<CreateCriteriaResponse>> {
    return httpClient.post<ApiResponse<CreateCriteriaResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_CYCLE_CRITERIA,
      data
    );
  }

  /**
   * Get all assessment criteria for a cycle (PM view)
   * @param params - Cycle slug
   */
  async getCycleCriterias(params: GetCycleCriteriasDTO): Promise<ApiResponse<GetCycleCriteriasResponse>> {
    return httpClient.get<ApiResponse<GetCycleCriteriasResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_CRITERIAS,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Get all assessment submissions for a specific criteria
   * @param params - Cycle slug, criteria slug, and pagination
   */
  async getCycleCriteriaAssessments(
    params: GetCycleCriteriaDetailsWithAssessmentsDTO
  ): Promise<ApiResponse<GetCycleCriteriaAssessmentsResponse>> {
    return httpClient.get<ApiResponse<GetCycleCriteriaAssessmentsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_CRITERIA_ASSESSMENTS,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Invite a reviewer to review a project assessment submission
   * @param data - Assessment ID and reviewer email
   */
  async inviteReviewerForAssessment(data: InviteReviewerForAssessmentDTO): Promise<ApiResponse<null>> {
    return httpClient.post<ApiResponse<null>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.INVITE_REVIEWER_FOR_ASSESSMENT,
      data
    );
  }

  // ============= Applicant: Project Assessment =============

  /**
   * Get all assessment criteria available for the applicant's project
   * @param params - Cycle slug
   */
  async getApplicantCycleCriterias(params: GetCycleCriteriasDTO): Promise<ApiResponse<GetCycleCriteriasResponse>> {
    return httpClient.get<ApiResponse<GetCycleCriteriasResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_APPLICANT_CYCLE_CRITERIAS,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Get criteria details and user's submission if exists
   * @param params - Cycle slug and criteria slug
   */
  async getApplicantAssessmentSubmission(
    params: GetCycleCriteriaDetailsWithSubmissionDTO
  ): Promise<ApiResponse<GetCycleAssessmentDetailsResponse>> {
    return httpClient.get<ApiResponse<GetCycleAssessmentDetailsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_APPLICANT_ASSESSMENT_SUBMISSION,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Create or update assessment submission for a criteria
   * @param data - Assessment submission data
   */
  async createAssessmentSubmission(
    data: SubmitAssessmentDTO
  ): Promise<ApiResponse<CreateAssessmentSubmissionResponse>> {
    return httpClient.post<ApiResponse<CreateAssessmentSubmissionResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_ASSESSMENT_SUBMISSION,
      data
    );
  }
}

// Export singleton instance
export const projectManagementService = new ProjectManagementService();
