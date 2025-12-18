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
  SubmitProjectAssessmentReviewRequest,
  SubmitProjectAssessmentReviewResponse,
  GetUserProjectReviewsRequest,
  GetUserProjectReviewsResponse,
  GetProjectReviewDetailsRequest,
  GetProjectReviewDetailsResponse,
  SubmitProjectAssessmentReviewInviteStatusRequest,
  SubmitProjectAssessmentReviewInviteStatusResponse,
} from '../types/reviewer.types';

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

  // ============= Project Assessment Review Management =============

  /**
   * Submit a review for a project assessment
   */
  async submitProjectAssessmentReview(
    data: SubmitProjectAssessmentReviewRequest
  ): Promise<SubmitProjectAssessmentReviewResponse> {
    return httpClient.post<SubmitProjectAssessmentReviewResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.SUBMIT_PROJECT_ASSESSMENT_REVIEW,
      data
    );
  }

  /**
   * Get all project assessment reviews submitted by the current reviewer with pagination
   */
  async getUserProjectReviews(
    params: GetUserProjectReviewsRequest
  ): Promise<GetUserProjectReviewsResponse> {
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
   * Get detailed information about a specific project assessment review
   */
  async getProjectReviewDetails(
    params: GetProjectReviewDetailsRequest
  ): Promise<GetProjectReviewDetailsResponse> {
    const queryParams: Record<string, string> = {
      assessmentSlug: params.assessmentSlug,
    };

    return httpClient.get<GetProjectReviewDetailsResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.GET_PROJECT_REVIEW_DETAILS,
      queryParams
    );
  }

  /**
   * Accept or reject project assessment review invitation
   * This is a public endpoint - no authentication required
   */
  async submitProjectAssessmentReviewInviteStatus(
    data: SubmitProjectAssessmentReviewInviteStatusRequest
  ): Promise<SubmitProjectAssessmentReviewInviteStatusResponse> {
    return httpClient.post<SubmitProjectAssessmentReviewInviteStatusResponse>(
      API_CONFIG.ENDPOINTS.REVIEWER.SUBMIT_PROJECT_ASSESSMENT_REVIEW_INVITE_STATUS,
      data
    );
  }
}

export const reviewerService = new ReviewerService();
