/**
 * Project Management service for handling project-related API calls
 */
import { API_CONFIG } from '../lib/config/api.config';
import { httpClient } from '../lib/http/http-client';
import type { ApiResponse } from '../types/api.types';
import {
  CreateProjectRequest,
  CreateProjectResponse,
  GetCycleProjectsRequest,
  GetCycleProjectsResponse,
  GetProjectDetailsRequest,
  GetProjectDetailsResponse,
  CreateCycleCriteriaRequest,
  CreateCycleCriteriaResponse,
  GetCycleCriteriasRequest,
  GetCycleCriteriasResponse,
  GetApplicantCycleCriteriasRequest,
  GetApplicantCycleCriteriasResponse,
  GetApplicantAssessmentSubmissionRequest,
  GetApplicantAssessmentSubmissionResponse,
  CreateAssessmentSubmissionRequest,
  CreateAssessmentSubmissionResponse,
  GetCycleCriteriaAssessmentsRequest,
  GetCycleCriteriaAssessmentsResponse,
  InviteReviewerForAssessmentRequest,
  InviteReviewerForAssessmentResponse,
} from '../types/project.types';

export class ProjectManagementService {
  // ============= Project Management =============

  /**
   * Create a new project from an approved application
   */
  async createProject(data: CreateProjectRequest): Promise<ApiResponse<CreateProjectResponse>> {
    return httpClient.post<ApiResponse<CreateProjectResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_PROJECT,
      data
    );
  }

  /**
   * Get all projects in a cycle with pagination
   */
  async getCycleProjects(params: GetCycleProjectsRequest): Promise<ApiResponse<GetCycleProjectsResponse>> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    return httpClient.get<ApiResponse<GetCycleProjectsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_PROJECTS,
      queryParams
    );
  }

  /**
   * Get detailed information about a specific project
   */
  async getProjectDetails(params: GetProjectDetailsRequest): Promise<ApiResponse<GetProjectDetailsResponse>> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      applicationSlug: params.applicationSlug,
    };

    return httpClient.get<ApiResponse<GetProjectDetailsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_PROJECT_DETAILS,
      queryParams
    );
  }

  // ============= Cycle Criteria Management =============

  /**
   * Create assessment criteria for a cycle
   */
  async createCycleCriteria(
    data: CreateCycleCriteriaRequest
  ): Promise<ApiResponse<CreateCycleCriteriaResponse>> {
    return httpClient.post<ApiResponse<CreateCycleCriteriaResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_CYCLE_CRITERIA,
      data
    );
  }

  /**
   * Get all assessment criteria for a cycle
   */
  async getCycleCriterias(params: GetCycleCriteriasRequest): Promise<ApiResponse<GetCycleCriteriasResponse>> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
    };

    return httpClient.get<ApiResponse<GetCycleCriteriasResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_CRITERIAS,
      queryParams
    );
  }

  /**
   * Get all assessment submissions for a specific criteria (PM view)
   */
  async getCycleCriteriaAssessments(
    params: GetCycleCriteriaAssessmentsRequest
  ): Promise<ApiResponse<GetCycleCriteriaAssessmentsResponse>> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      criteriaSlug: params.criteriaSlug,
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    return httpClient.get<ApiResponse<GetCycleCriteriaAssessmentsResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_CRITERIA_ASSESSMENTS,
      queryParams
    );
  }

  /**
   * Invite a reviewer to review a project assessment submission
   */
  async inviteReviewerForAssessment(
    data: InviteReviewerForAssessmentRequest
  ): Promise<ApiResponse<InviteReviewerForAssessmentResponse>> {
    return httpClient.post<ApiResponse<InviteReviewerForAssessmentResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.INVITE_REVIEWER_FOR_ASSESSMENT,
      data
    );
  }

  // ============= Applicant: Project Assessment =============

  /**
   * Get all assessment criteria available for the applicant's project
   */
  async getApplicantCycleCriterias(
    params: GetApplicantCycleCriteriasRequest
  ): Promise<ApiResponse<GetApplicantCycleCriteriasResponse>> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
    };

    return httpClient.get<ApiResponse<GetApplicantCycleCriteriasResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_APPLICANT_CYCLE_CRITERIAS,
      queryParams
    );
  }

  /**
   * Get criteria details and user's submission if exists
   */
  async getApplicantAssessmentSubmission(
    params: GetApplicantAssessmentSubmissionRequest
  ): Promise<ApiResponse<GetApplicantAssessmentSubmissionResponse>> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      criteriaSlug: params.criteriaSlug,
    };

    return httpClient.get<ApiResponse<GetApplicantAssessmentSubmissionResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_APPLICANT_ASSESSMENT_SUBMISSION,
      queryParams
    );
  }

  /**
   * Create or update assessment submission for a criteria
   */
  async createAssessmentSubmission(
    data: CreateAssessmentSubmissionRequest
  ): Promise<ApiResponse<CreateAssessmentSubmissionResponse>> {
    return httpClient.post<ApiResponse<CreateAssessmentSubmissionResponse>>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_ASSESSMENT_SUBMISSION,
      data
    );
  }
}

// Export singleton instance
export const projectManagementService = new ProjectManagementService();
