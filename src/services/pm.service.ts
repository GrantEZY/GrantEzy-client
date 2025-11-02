/**
 * PM (Program Manager) service for handling PM-related API calls
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
import {
  CreateCycleRequest,
  CreateCycleResponse,
  DeleteCycleRequest,
  DeleteCycleResponse,
  GetAssignedProgramResponse,
  GetCycleDetailsRequest,
  GetCycleDetailsResponse,
  GetPMApplicationDetailsRequest,
  GetPMApplicationDetailsResponse,
  GetProgramCyclesRequest,
  GetProgramCyclesResponse,
  InviteReviewerRequest,
  InviteReviewerResponse,
  GetApplicationReviewsRequest,
  GetApplicationReviewsResponse,
  GetReviewDetailsRequest,
  GetReviewDetailsResponse,
  UpdateCycleRequest,
  UpdateCycleResponse,
} from "../types/pm.types";

export class PMService {
  // ============= Program Management =============

  /**
   * Get the program assigned to the current PM
   */
  async getAssignedProgram(): Promise<GetAssignedProgramResponse> {
    return httpClient.get<GetAssignedProgramResponse>(
      API_CONFIG.ENDPOINTS.PM.GET_ASSIGNED_PROGRAM,
    );
  }

  // ============= Cycle Management =============

  /**
   * Create a new cycle for a program
   */
  async createCycle(data: CreateCycleRequest): Promise<CreateCycleResponse> {
    return httpClient.post<CreateCycleResponse>(
      API_CONFIG.ENDPOINTS.PM.CREATE_CYCLE,
      data,
    );
  }

  /**
   * Get all cycles for the PM's assigned program with pagination
   * Note: Backend automatically determines the program based on logged-in PM user
   */
  async getProgramCycles(
    params: GetProgramCyclesRequest,
  ): Promise<GetProgramCyclesResponse> {
    const queryParams: Record<string, string> = {
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    return httpClient.get<GetProgramCyclesResponse>(
      API_CONFIG.ENDPOINTS.PM.GET_PROGRAM_CYCLES,
      queryParams,
    );
  }

  /**
   * Update cycle details
   */
  async updateCycle(data: UpdateCycleRequest): Promise<UpdateCycleResponse> {
    return httpClient.patch<UpdateCycleResponse>(
      API_CONFIG.ENDPOINTS.PM.UPDATE_CYCLE_DETAILS,
      data,
    );
  }

  /**
   * Delete a program cycle
   */
  async deleteCycle(data: DeleteCycleRequest): Promise<DeleteCycleResponse> {
    return httpClient.delete<DeleteCycleResponse>(
      API_CONFIG.ENDPOINTS.PM.DELETE_CYCLE,
      data,
    );
  }

  // ============= Cycle Details & Applications =============

  /**
   * Get detailed information about a specific cycle including its applications
   */
  async getCycleDetails(
    params: GetCycleDetailsRequest,
  ): Promise<GetCycleDetailsResponse> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
    };

    return httpClient.get<GetCycleDetailsResponse>(
      API_CONFIG.ENDPOINTS.PM.GET_CYCLE_DETAILS,
      queryParams,
    );
  }

  /**
   * Get detailed information about a specific application
   * Used by PM to review application before assigning reviewers
   */
  async getApplicationDetails(
    params: GetPMApplicationDetailsRequest,
  ): Promise<GetPMApplicationDetailsResponse> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      applicationSlug: params.applicationSlug,
    };

    return httpClient.get<GetPMApplicationDetailsResponse>(
      API_CONFIG.ENDPOINTS.PM.GET_APPLICATION_DETAILS,
      queryParams,
    );
  }

  // ============= Reviewer Management =============

  /**
   * Invite a reviewer to review a specific application
   */
  async inviteReviewer(
    data: InviteReviewerRequest,
  ): Promise<InviteReviewerResponse> {
    return httpClient.post<InviteReviewerResponse>(
      API_CONFIG.ENDPOINTS.PM.INVITE_REVIEWER,
      data,
    );
  }

  // ============= Review Management =============

  /**
   * Get all reviews for a specific application with pagination
   */
  async getApplicationReviews(
    params: GetApplicationReviewsRequest,
  ): Promise<GetApplicationReviewsResponse> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      applicationSlug: params.applicationSlug,
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    return httpClient.get<GetApplicationReviewsResponse>(
      API_CONFIG.ENDPOINTS.PM.GET_APPLICATION_REVIEWS,
      queryParams,
    );
  }

  /**
   * Get detailed information about a specific review
   */
  async getReviewDetails(
    params: GetReviewDetailsRequest,
  ): Promise<GetReviewDetailsResponse> {
    const queryParams: Record<string, string> = {
      cycleSlug: params.cycleSlug,
      applicationSlug: params.applicationSlug,
      reviewSlug: params.reviewSlug,
    };

    return httpClient.get<GetReviewDetailsResponse>(
      API_CONFIG.ENDPOINTS.PM.GET_REVIEW_DETAILS,
      queryParams,
    );
  }
}

// Export singleton instance
export const pmService = new PMService();
