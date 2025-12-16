/**
 * Reviewer service for handling reviewer-related API calls
 */
import { API_CONFIG } from '../lib/config/api.config';
import { httpClient } from '../lib/http/http-client';
import {
  GetTokenDetailsRequest,
  GetTokenDetailsResponse,
  UpdateInviteStatusRequest,
  UpdateInviteStatusResponse,
  SubmitReviewRequest,
  SubmitReviewResponse,
  GetUserReviewsRequest,
  GetUserReviewsResponse,
  GetReviewDetailsRequest,
  GetReviewDetailsResponse,
} from '../types/reviewer.types';
import {
  GetUserProjectReviewsRequest,
  GetUserProjectReviewsResponse,
  GetProjectReviewDetailsRequest,
  GetProjectReviewDetailsResponse,
  SubmitProjectReviewRequest,
  SubmitProjectReviewResponse,
  SubmitProjectReviewInviteStatusRequest,
  SubmitProjectReviewInviteStatusResponse,
} from '../types/project.types';

export class ReviewerService {
  // ============= Invite Management =============

  /**
   * Get token details for reviewing an invitation
   * Used to verify invitation token before accepting/rejecting
   * This is a public endpoint - no authentication required
   */
  async getTokenDetails(params: GetTokenDetailsRequest): Promise<GetTokenDetailsResponse> {
    const queryParams: Record<string, string> = {
      token: params.token,
      slug: params.slug,
    };

    return httpClient.publicGet<GetTokenDetailsResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.GET_TOKEN_DETAILS,
      queryParams
    );
  }

  /**
   * Update reviewer invite status (accept or reject)
   * This is a public endpoint - no authentication required
   */
  async updateInviteStatus(data: UpdateInviteStatusRequest): Promise<UpdateInviteStatusResponse> {
    return httpClient.publicPatch<UpdateInviteStatusResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.UPDATE_INVITE_STATUS,
      data
    );
  }

  // ============= Review Management =============

  /**
   * Submit a review for an application
   */
  async submitReview(data: SubmitReviewRequest): Promise<SubmitReviewResponse> {
    return httpClient.post<SubmitReviewResponse>(API_CONFIG.ENDPOINTS.REVIEWER.SUBMIT_REVIEW, data);
  }

  /**
   * Get all reviews submitted by the current reviewer with pagination
   */
  async getUserReviews(params: GetUserReviewsRequest): Promise<GetUserReviewsResponse> {
    const queryParams: Record<string, string> = {
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    return httpClient.get<GetUserReviewsResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.GET_USER_REVIEWS,
      queryParams
    );
  }

  /**
   * Get detailed information about a specific review
   */
  async getReviewDetails(params: GetReviewDetailsRequest): Promise<GetReviewDetailsResponse> {
    const queryParams: Record<string, string> = {
      reviewSlug: params.reviewSlug,
    };

    return httpClient.get<GetReviewDetailsResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.GET_REVIEW_DETAILS,
      queryParams
    );
  }

  // ============= Project Review Management =============

  /**
   * Get all project reviews assigned to the current reviewer with pagination
   */
  async getUserProjectReviews(params: GetUserProjectReviewsRequest): Promise<GetUserProjectReviewsResponse> {
    const queryParams: Record<string, string> = {
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    return httpClient.get<GetUserProjectReviewsResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.GET_USER_PROJECT_REVIEWS,
      queryParams
    );
  }

  /**
   * Get detailed information about a specific project review
   */
  async getProjectReviewDetails(params: GetProjectReviewDetailsRequest): Promise<GetProjectReviewDetailsResponse> {
    const queryParams: Record<string, string> = {
      assessmentSlug: params.assessmentSlug,
    };

    return httpClient.get<GetProjectReviewDetailsResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.GET_PROJECT_REVIEW_DETAILS,
      queryParams
    );
  }

  /**
   * Submit a review for a project assessment
   */
  async submitProjectReview(data: SubmitProjectReviewRequest): Promise<SubmitProjectReviewResponse> {
    return httpClient.post<SubmitProjectReviewResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.SUBMIT_PROJECT_REVIEW,
      data
    );
  }

  /**
   * Update project assessment review invite status (accept or reject)
   * This is a public endpoint - no authentication required
   */
  async updateProjectReviewInviteStatus(
    data: SubmitProjectReviewInviteStatusRequest
  ): Promise<SubmitProjectReviewInviteStatusResponse> {
    return httpClient.publicPost<SubmitProjectReviewInviteStatusResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.UPDATE_PROJECT_REVIEW_INVITE_STATUS,
      data
    );
  }
}

export const reviewerService = new ReviewerService();
