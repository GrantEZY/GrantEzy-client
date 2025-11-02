/**
 * Reviewer Module Types
 * Matches backend DTOs and response structures
 */

// ============= Enums =============

export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum ReviewStatus {
  UNASSIGNED = "UNASSIGNED",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
}

export enum Recommendation {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  REVISE = "REVISE",
}

// ============= Basic Types =============

export interface Money {
  amount: number;
  currency: string;
}

export interface Scores {
  technical: number;
  market: number;
  financial: number;
  team: number;
  innovation: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface Application {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ============= Review Types =============

export interface Review {
  id: string;
  slug: string;
  status: ReviewStatus;
  recommendation: Recommendation | null;
  suggestedBudget: Money | null;
  scores: Scores | null;
  applicationId: string;
  application?: Application;
  reviewerId: string;
  reviewer?: User;
  createdAt: string;
  updatedAt: string;
}

// ============= Pagination =============

export interface PaginationMeta {
  page: number;
  numberOfResults: number;
  totalResults: number;
  totalPages: number;
}

// ============= API Request/Response Types =============

// Get Token Details (for accepting/rejecting invites)
export interface GetTokenDetailsRequest {
  token: string;
  slug: string;
}

export interface GetTokenDetailsResponse {
  status: number;
  message: string;
  res: {
    applicationId: string;
    status: InviteStatus;
    // Additional fields might be returned
  } | null;
}

// Update Invite Status
export interface UpdateInviteStatusRequest {
  token: string;
  slug: string;
  status: InviteStatus.ACCEPTED | InviteStatus.REJECTED;
}

export interface UpdateInviteStatusResponse {
  status: number;
  message: string;
  res: {
    applicationId: string;
    status: InviteStatus;
    reviewId: string | null;
  } | null;
}

// Submit Review
export interface SubmitReviewRequest {
  applicationId: string;
  recommendation: Recommendation;
  budget: Money;
  scores: Scores;
}

export interface SubmitReviewResponse {
  status: number;
  message: string;
  res: {
    applicationId: string;
    reviewId: string;
    status: ReviewStatus;
  } | null;
}

// Get User Reviews (list of reviews submitted by the reviewer)
export interface GetUserReviewsRequest {
  page: number;
  numberOfResults: number;
}

export interface GetUserReviewsResponse {
  status: number;
  message: string;
  res: {
    reviews: Review[];
  } | null;
}

// Get Review Details
export interface GetReviewDetailsRequest {
  reviewSlug: string;
}

export interface GetReviewDetailsResponse {
  status: number;
  message: string;
  res: {
    review: Review;
    application: Application;
  } | null;
}

// ============= Extended Types for UI =============

// For displaying review invitations with additional context
export interface ReviewInvite {
  id: string;
  token: string;
  applicationId: string;
  application?: Application;
  status: InviteStatus;
  invitedAt: string;
  respondedAt?: string;
  cycleInfo?: {
    id: string;
    name: string;
    programName: string;
  };
}

// For displaying assigned applications
export interface AssignedApplication {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  status: string;
  reviewStatus: ReviewStatus;
  reviewId?: string;
  assignedAt: string;
  deadline?: string;
  cycleInfo?: {
    id: string;
    name: string;
    programName: string;
  };
}

// For the review submission form
export interface ReviewFormData {
  recommendation: Recommendation;
  budget: Money;
  scores: Scores;
  comments?: string;
}

// ============= Store State Types =============

export interface ReviewerState {
  // Reviews
  reviews: Review[];
  currentReview: Review | null;
  reviewsPagination: PaginationMeta | null;
  isLoadingReviews: boolean;
  reviewsError: string | null;

  // Actions
  getUserReviews: (params: GetUserReviewsRequest) => Promise<void>;
  getReviewDetails: (params: GetReviewDetailsRequest) => Promise<void>;
  submitReview: (params: SubmitReviewRequest) => Promise<boolean>;
  updateInviteStatus: (params: UpdateInviteStatusRequest) => Promise<boolean>;
  clearReviews: () => void;
  clearCurrentReview: () => void;
  clearError: () => void;
}
