/**
 * Project Management service for handling project assessment API calls
 */
import { API_CONFIG } from '../lib/config/api.config';
import { httpClient } from '../lib/http/http-client';
import type { ApiResponse } from '../types/api.types';
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  GetCycleProjectsRequest,
  GetCycleProjectsResponse,
  GetProjectDetailsRequest,
  GetProjectDetailsResponse,
  CreateCycleCriteriaRequest,
  CreateCriteriaResponse,
  GetCycleCriteriasRequest,
  GetCycleCriteriasResponse,
  GetCycleCriteriaDetailsRequest,
  GetCycleCriteriaDetailsResponse,
  SubmitAssessmentRequest,
  CreateAssessmentSubmissionResponse,
  GetCycleCriteriaAssessmentsRequest,
  GetCycleCriteriaAssessmentsResponse,
  InviteReviewerForAssessmentRequest,
  InviteReviewerResponse,
} from '../types/project-management.types';

export class ProjectManagementService {
  // ============================================================================
  // PM: Project Management Endpoints
  // ============================================================================

  /**
   * Convert an approved application to a project
   */
  async createProject(data: CreateProjectRequest): Promise<ApiResponse<CreateProjectResponse>> {
    return httpClient.post<ApiResponse<CreateProjectResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_PROJECT,
      data
    );
  }

  /**
   * Get all projects in a cycle (paginated)
   */
  async getCycleProjects(
    params: GetCycleProjectsRequest
  ): Promise<ApiResponse<GetCycleProjectsResponse>> {
    return httpClient.get<ApiResponse<GetCycleProjectsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_PROJECTS,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Get detailed information about a specific project
   */
  async getProjectDetails(
    params: GetProjectDetailsRequest
  ): Promise<ApiResponse<GetProjectDetailsResponse>> {
    return httpClient.get<ApiResponse<GetProjectDetailsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_PROJECT_DETAILS,
      params as unknown as Record<string, string>
    );
  }

  // ============================================================================
  // PM: Assessment Criteria Management Endpoints
  // ============================================================================

  /**
   * Create a new assessment criteria for a cycle
   */
  async createCycleCriteria(
    data: CreateCycleCriteriaRequest
  ): Promise<ApiResponse<CreateCriteriaResponse>> {
    return httpClient.post<ApiResponse<CreateCriteriaResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_CYCLE_CRITERIA,
      data
    );
  }

  /**
   * Get all assessment criteria for a cycle
   */
  async getCycleCriterias(
    params: GetCycleCriteriasRequest
  ): Promise<ApiResponse<GetCycleCriteriasResponse>> {
    return httpClient.get<ApiResponse<GetCycleCriteriasResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_CRITERIAS,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Get all submissions for a specific criteria (paginated)
   */
  async getCycleCriteriaAssessments(
    params: GetCycleCriteriaAssessmentsRequest
  ): Promise<ApiResponse<GetCycleCriteriaAssessmentsResponse>> {
    return httpClient.get<ApiResponse<GetCycleCriteriaAssessmentsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_CRITERIA_ASSESSMENTS,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Invite a reviewer for a project assessment
   */
  async inviteReviewerForAssessment(
    data: InviteReviewerForAssessmentRequest
  ): Promise<ApiResponse<InviteReviewerResponse>> {
    return httpClient.post<ApiResponse<InviteReviewerResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.INVITE_REVIEWER_FOR_ASSESSMENT,
      data
    );
  }

  // ============================================================================
  // Applicant: Assessment Submission Endpoints
  // ============================================================================

  /**
   * Get all assessment criteria for applicant's project
   */
  async getApplicantCycleCriterias(
    params: GetCycleCriteriasRequest
  ): Promise<ApiResponse<GetCycleCriteriasResponse>> {
    return httpClient.get<ApiResponse<GetCycleCriteriasResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_APPLICANT_CYCLE_CRITERIAS,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Get details of a specific assessment criteria with submission status
   */
  async getApplicantAssessmentSubmission(
    params: GetCycleCriteriaDetailsRequest
  ): Promise<ApiResponse<GetCycleCriteriaDetailsResponse>> {
    return httpClient.get<ApiResponse<GetCycleCriteriaDetailsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_APPLICANT_ASSESSMENT_SUBMISSION,
      params as unknown as Record<string, string>
    );
  }

  /**
   * Submit or update assessment for a criteria
   */
  async createApplicantAssessmentSubmission(
    data: SubmitAssessmentRequest
  ): Promise<ApiResponse<CreateAssessmentSubmissionResponse>> {
    return httpClient.post<ApiResponse<CreateAssessmentSubmissionResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_APPLICANT_ASSESSMENT_SUBMISSION,
      data
    );
  }
}

export const projectManagementService = new ProjectManagementService();
