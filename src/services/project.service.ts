/**
 * Project Management service for handling project-related API calls
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
import {
  CreateCycleCriteriaRequest,
  CreateCycleCriteriaResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  GetCycleCriteriasRequest,
  GetCycleCriteriasResponse,
  GetCycleProjectsRequest,
  GetCycleProjectsResponse,
  GetProjectDetailsRequest,
  GetProjectDetailsResponse,
} from "../types/project.types";

export class ProjectManagementService {
  // ============= Project Management =============

  /**
   * Create a new project from an approved application
   */
  async createProject(
    data: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    return httpClient.post<CreateProjectResponse>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_PROJECT,
      data,
    );
  }

  /**
   * Get all projects in a cycle with pagination
   */
  async getCycleProjects(
    params: GetCycleProjectsRequest,
  ): Promise<GetCycleProjectsResponse> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    return httpClient.get<GetCycleProjectsResponse>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_PROJECTS,
      queryParams,
    );
  }

  /**
   * Get detailed information about a specific project
   */
  async getProjectDetails(
    params: GetProjectDetailsRequest,
  ): Promise<GetProjectDetailsResponse> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      applicationSlug: params.applicationSlug,
    };

    return httpClient.get<GetProjectDetailsResponse>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_PROJECT_DETAILS,
      queryParams,
    );
  }

  // ============= Cycle Criteria Management =============

  /**
   * Create assessment criteria for a cycle
   */
  async createCycleCriteria(
    data: CreateCycleCriteriaRequest,
  ): Promise<CreateCycleCriteriaResponse> {
    return httpClient.post<CreateCycleCriteriaResponse>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.CREATE_CYCLE_CRITERIA,
      data,
    );
  }

  /**
   * Get all assessment criteria for a cycle
   */
  async getCycleCriterias(
    params: GetCycleCriteriasRequest,
  ): Promise<GetCycleCriteriasResponse> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
    };

    return httpClient.get<GetCycleCriteriasResponse>(
      API_CONFIG.ENDPOINTS.PROJECT_MANAGEMENT.GET_CYCLE_CRITERIAS,
      queryParams,
    );
  }
}

// Export singleton instance
export const projectManagementService = new ProjectManagementService();
