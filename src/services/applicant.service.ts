/**
 * Applicant service for handling application submission API calls
 */
import { API_CONFIG } from '../lib/config/api.config';
import { httpClient } from '../lib/http/http-client';
import {
  AddApplicationBudgetRequest,
  AddApplicationBudgetResponse,
  AddApplicationDocumentsRequest,
  AddApplicationDocumentsResponse,
  AddApplicationRevenueStreamRequest,
  AddApplicationRevenueStreamResponse,
  AddApplicationRisksAndMilestonesRequest,
  AddApplicationRisksAndMilestonesResponse,
  AddApplicationTeammatesRequest,
  AddApplicationTeammatesResponse,
  AddApplicationTechnicalDetailsRequest,
  AddApplicationTechnicalDetailsResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
  GetUserApplicationsResponse,
  GetApplicationWithCycleDetailsResponse,
  GetUserCreatedApplicationDetailsResponse,
  DeleteApplicationResponse,
} from '../types/applicant.types';
import { GetUserProjectsResponse, GetProjectDetailsResponse } from '../types/project.types';

export class ApplicantService {
  /**
   * Step 1: Create a new application with basic info
   */
  async createApplication(data: CreateApplicationRequest): Promise<CreateApplicationResponse> {
    return httpClient.post<CreateApplicationResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.CREATE_APPLICATION,
      data
    );
  }

  /**
   * Step 2: Add budget details to application
   */
  async addApplicationBudget(
    data: AddApplicationBudgetRequest
  ): Promise<AddApplicationBudgetResponse> {
    return httpClient.patch<AddApplicationBudgetResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_BUDGET,
      data
    );
  }

  /**
   * Step 3: Add technical specifications and market info
   */
  async addApplicationTechnicalDetails(
    data: AddApplicationTechnicalDetailsRequest
  ): Promise<AddApplicationTechnicalDetailsResponse> {
    return httpClient.patch<AddApplicationTechnicalDetailsResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_TECHNICAL_DETAILS,
      data
    );
  }

  /**
   * Step 4: Add revenue model and streams
   */
  async addApplicationRevenueStream(
    data: AddApplicationRevenueStreamRequest
  ): Promise<AddApplicationRevenueStreamResponse> {
    return httpClient.patch<AddApplicationRevenueStreamResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_REVENUE_STREAM,
      data
    );
  }

  /**
   * Step 5: Add risks and milestones
   */
  async addApplicationRisksAndMilestones(
    data: AddApplicationRisksAndMilestonesRequest
  ): Promise<AddApplicationRisksAndMilestonesResponse> {
    return httpClient.patch<AddApplicationRisksAndMilestonesResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_RISKS_MILESTONES,
      data
    );
  }

  /**
   * Step 6: Add required documents
   */
  async addApplicationDocuments(
    data: AddApplicationDocumentsRequest
  ): Promise<AddApplicationDocumentsResponse> {
    return httpClient.patch<AddApplicationDocumentsResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_DOCUMENTS,
      data
    );
  }

  /**
   * Step 7: Add team members and submit
   */
  async addApplicationTeammates(
    data: AddApplicationTeammatesRequest
  ): Promise<AddApplicationTeammatesResponse> {
    return httpClient.patch<AddApplicationTeammatesResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_TEAMMATES,
      data
    );
  }

  /**
   * Get application details with cycle information
   * Used to check if user has an existing application for a cycle (draft or submitted)
   */
  async getApplicationWithCycle(
    cycleSlug: string
  ): Promise<GetApplicationWithCycleDetailsResponse> {
    return httpClient.get<GetApplicationWithCycleDetailsResponse>(
      `${API_CONFIG.ENDPOINTS.APPLICANT.GET_APPLICATION_WITH_CYCLE}?cycleSlug=${cycleSlug}`
    );
  }

  /**
   * Get all applications for the current user
   * Returns list of all applications (drafts and submitted)
   */
  async getUserApplications(): Promise<GetUserApplicationsResponse> {
    return httpClient.get<GetUserApplicationsResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.GET_USER_APPLICATIONS
    );
  }

  /**
   * Get detailed information about a specific application created by user
   * Used for viewing/editing draft applications
   */
  async getUserCreatedApplicationDetails(
    applicationId: string
  ): Promise<GetUserCreatedApplicationDetailsResponse> {
    return httpClient.get<GetUserCreatedApplicationDetailsResponse>(
      `${API_CONFIG.ENDPOINTS.APPLICANT.GET_USER_CREATED_APPLICATION}?applicationId=${applicationId}`
    );
  }

  /**
   * Delete a draft application
   * Only draft applications can be deleted, not submitted ones
   */
  async deleteApplication(applicationId: string): Promise<DeleteApplicationResponse> {
    return httpClient.delete<DeleteApplicationResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.DELETE_APPLICATION,
      { applicationId }
    );
  }

  // ============= Project Management =============

  /**
   * Get all projects created by the user
   */
  async getUserProjects(page: number, numberOfResults: number): Promise<GetUserProjectsResponse> {
    const queryParams: Record<string, string> = {
      page: page.toString(),
      numberOfResults: numberOfResults.toString(),
    };

    return httpClient.get<GetUserProjectsResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.GET_USER_CREATED_PROJECTS,
      queryParams
    );
  }

  /**
   * Get project details by application slug
   */
  async getProjectDetails(applicationSlug: string): Promise<GetProjectDetailsResponse> {
    const queryParams: Record<string, string> = {
      applicationSlug,
    };

    return httpClient.get<GetProjectDetailsResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.GET_PROJECT_DETAILS,
      queryParams
    );
  }
}

export const applicantService = new ApplicantService();
