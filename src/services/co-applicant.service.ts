/**
 * Co-applicant service for handling co-applicant related API calls
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
import {
  CoApplicantApplicationRequest,
  CoApplicantApplicationResponse,
  GetTokenDetailsRequest,
  TokenDetailsResponse,
  UpdateInviteStatusRequest,
  InviteStatusUpdateResponse,
  InviteStatus,
} from "../types/co-applicant.types";

export class CoApplicantService {
  /**
   * Get application details for a co-applicant
   * @param applicationId - UUID of the application
   * @returns Promise<CoApplicantApplicationResponse>
   */
  async getApplicationDetails(
    applicationId: string
  ): Promise<CoApplicantApplicationResponse> {
    const params = { applicationId };
    
    return httpClient.get<CoApplicantApplicationResponse>(
      API_CONFIG.ENDPOINTS.CO_APPLICANT.GET_APPLICATION_DETAILS,
      params
    );
  }

  /**
   * Get token details for invite verification
   * @param token - Verification token
   * @param slug - Verification slug
   * @returns Promise<TokenDetailsResponse>
   */
  async getTokenDetails(
    token: string,
    slug: string
  ): Promise<TokenDetailsResponse> {
    const params = { token, slug };
    
    // Use public get method since this endpoint is used before authentication
    return httpClient.publicGet<TokenDetailsResponse>(
      API_CONFIG.ENDPOINTS.CO_APPLICANT.GET_TOKEN_DETAILS,
      params
    );
  }

  /**
   * Update user invite status (accept/reject)
   * @param token - Verification token
   * @param slug - Verification slug
   * @param status - Invite status (ACCEPTED or REJECTED)
   * @returns Promise<InviteStatusUpdateResponse>
   */
  async updateInviteStatus(
    token: string,
    slug: string,
    status: InviteStatus.ACCEPTED | InviteStatus.REJECTED
  ): Promise<InviteStatusUpdateResponse> {
    const data: UpdateInviteStatusRequest = { token, slug, status };
    
    // Use public patch method since this endpoint doesn't require authentication
    return httpClient.publicPatch<InviteStatusUpdateResponse>(
      API_CONFIG.ENDPOINTS.CO_APPLICANT.UPDATE_INVITE_STATUS,
      data
    );
  }

  /**
   * Accept an invite
   * @param token - Verification token
   * @param slug - Verification slug
   * @returns Promise<InviteStatusUpdateResponse>
   */
  async acceptInvite(
    token: string,
    slug: string
  ): Promise<InviteStatusUpdateResponse> {
    return this.updateInviteStatus(token, slug, InviteStatus.ACCEPTED);
  }

  /**
   * Reject an invite
   * @param token - Verification token
   * @param slug - Verification slug
   * @returns Promise<InviteStatusUpdateResponse>
   */
  async rejectInvite(
    token: string,
    slug: string
  ): Promise<InviteStatusUpdateResponse> {
    return this.updateInviteStatus(token, slug, InviteStatus.REJECTED);
  }

  // ============= Project Management =============

  /**
   * Get all projects linked to the user (as co-applicant)
   */
  async getUserLinkedProjects(page: number, numberOfResults: number) {
    const queryParams: Record<string, string> = {
      page: page.toString(),
      numberOfResults: numberOfResults.toString(),
    };

    return httpClient.get(
      API_CONFIG.ENDPOINTS.CO_APPLICANT.GET_USER_LINKED_PROJECTS,
      queryParams,
    );
  }

  /**
   * Get project details by application slug (for co-applicants)
   */
  async getProjectDetails(applicationSlug: string) {
    const queryParams: Record<string, string> = {
      applicationSlug,
    };

    return httpClient.get(
      API_CONFIG.ENDPOINTS.CO_APPLICANT.GET_PROJECT_DETAILS,
      queryParams,
    );
  }
}

// Export singleton instance
export const coApplicantService = new CoApplicantService();