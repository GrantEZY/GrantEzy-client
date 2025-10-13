/**
 * Applicant service for handling application submission API calls
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
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
} from "../types/applicant.types";

export class ApplicantService {
  /**
   * Step 1: Create a new application with basic info
   */
  async createApplication(
    data: CreateApplicationRequest,
  ): Promise<CreateApplicationResponse> {
    return httpClient.post<CreateApplicationResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.CREATE_APPLICATION,
      data,
    );
  }

  /**
   * Step 2: Add budget details to application
   */
  async addApplicationBudget(
    data: AddApplicationBudgetRequest,
  ): Promise<AddApplicationBudgetResponse> {
    return httpClient.patch<AddApplicationBudgetResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_BUDGET,
      data,
    );
  }

  /**
   * Step 3: Add technical specifications and market info
   */
  async addApplicationTechnicalDetails(
    data: AddApplicationTechnicalDetailsRequest,
  ): Promise<AddApplicationTechnicalDetailsResponse> {
    return httpClient.patch<AddApplicationTechnicalDetailsResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_TECHNICAL_DETAILS,
      data,
    );
  }

  /**
   * Step 4: Add revenue model and streams
   */
  async addApplicationRevenueStream(
    data: AddApplicationRevenueStreamRequest,
  ): Promise<AddApplicationRevenueStreamResponse> {
    return httpClient.patch<AddApplicationRevenueStreamResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_REVENUE_STREAM,
      data,
    );
  }

  /**
   * Step 5: Add risks and milestones
   */
  async addApplicationRisksAndMilestones(
    data: AddApplicationRisksAndMilestonesRequest,
  ): Promise<AddApplicationRisksAndMilestonesResponse> {
    return httpClient.patch<AddApplicationRisksAndMilestonesResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_RISKS_MILESTONES,
      data,
    );
  }

  /**
   * Step 6: Add required documents
   */
  async addApplicationDocuments(
    data: AddApplicationDocumentsRequest,
  ): Promise<AddApplicationDocumentsResponse> {
    return httpClient.patch<AddApplicationDocumentsResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_DOCUMENTS,
      data,
    );
  }

  /**
   * Step 7: Add team members and submit
   */
  async addApplicationTeammates(
    data: AddApplicationTeammatesRequest,
  ): Promise<AddApplicationTeammatesResponse> {
    return httpClient.patch<AddApplicationTeammatesResponse>(
      API_CONFIG.ENDPOINTS.APPLICANT.ADD_TEAMMATES,
      data,
    );
  }

  /**
   * Get application details with cycle information
   * Used to check if user has an existing application for a cycle (draft or submitted)
   */
  async getApplicationWithCycle(
    cycleSlug: string,
  ): Promise<any> {
    return httpClient.get<any>(
      `${API_CONFIG.ENDPOINTS.APPLICANT.GET_APPLICATION_WITH_CYCLE}?cycleSlug=${cycleSlug}`,
    );
  }
}

export const applicantService = new ApplicantService();
