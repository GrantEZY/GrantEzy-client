/**
 * Reviewer Module Types
 * Matches backend DTOs and response structures
 */

// ============= Enums =============

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum ReviewStatus {
  UNASSIGNED = 'UNASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum Recommendation {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REVISE = 'REVISE',
}

export enum ProjectReviewRecommendation {
  PERFECT = 'PERFECT',
  CAN_SPEED_UP = 'CAN_SPEED_UP',
  NO_IMPROVEMENT = 'NO_IMPROVEMENT',
  NEED_SERIOUS_ACTION = 'NEED_SERIOUS_ACTION',
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

// Import types from applicant for full application structure
export interface BasicInfo {
  title: string;
  summary: string;
  problem: string;
  solution: string;
  innovation: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface BudgetItem {
  BudgetReason: string;
  Budget: Money;
}

export interface Budget {
  ManPower: BudgetItem[];
  Equipment: BudgetItem[];
  OtherCosts: BudgetItem[];
  Consumables: BudgetItem;
  Travel: BudgetItem;
  Contigency: BudgetItem;
  Overhead: BudgetItem;
}

export interface TechnicalSpec {
  description: string;
  techStack: string[];
  prototype: string;
}

export interface MarketInfo {
  totalAddressableMarket: string;
  serviceableMarket: string;
  obtainableMarket: string;
  competitorAnalysis: string;
}

export enum RevenueStreamType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  LICENSE = 'LICENSE',
  USAGE_BASED = 'USAGE_BASED',
  DIRECT_SALES = 'DIRECT_SALES',
  FREEMIUM = 'FREEMIUM',
  MARKETPLACE = 'MARKETPLACE',
  ADVERTISING = 'ADVERTISING',
  CONSULTING = 'CONSULTING',
}

export interface RevenueStream {
  type: RevenueStreamType;
  description: string;
  percentage: number;
}

export interface RevenueModel {
  primaryStream: RevenueStream;
  secondaryStreams: RevenueStream[];
  pricing: string;
  unitEconomics: string;
}

export enum RiskImpact {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Risk {
  description: string;
  impact: RiskImpact;
  mitigation: string;
}

export interface Milestone {
  title: string;
  description: string;
  deliverables: string[];
  dueDate: string;
}

export interface Document {
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  storageUrl: string;
  metaData?: Record<string, any>;
}

export interface ApplicationDocuments {
  endorsementLetter?: Document;
  plagiarismUndertaking?: Document;
  ageProof?: Document;
  aadhar?: Document;
  piCertificate?: Document;
  coPiCertificate?: Document;
  otherDocuments?: Document[];
}

export interface TeamMateInvite {
  id: string;
  email: string;
  status: string;
  invitedAt: string;
}

export interface Application {
  id: string;
  slug?: string;
  applicantId: string;
  cycleId: string;
  status: string;
  stepNumber?: number;
  basicDetails?: BasicInfo;
  budget?: Budget;
  technicalSpec?: TechnicalSpec;
  marketInfo?: MarketInfo;
  revenueModel?: RevenueModel;
  risks?: Risk[];
  milestones?: Milestone[];
  documents?: ApplicationDocuments;
  teamMateInvites?: TeamMateInvite[];
  isSubmitted?: boolean;
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

// ============= Project Assessment Review Types =============

// Project Assessment Review
export interface ProjectAssessmentReview {
  id: string;
  assessmentId: string;
  reviewerId: string;
  recommendation: ProjectReviewRecommendation | null;
  reviewAnalysis: string | null;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  assessment?: any; // CycleAssessment from project-management.types
  reviewer?: User;
}

// Submit Project Assessment Review
export interface SubmitProjectAssessmentReviewRequest {
  assessmentId: string;
  recommendation: ProjectReviewRecommendation;
  reviewAnalysis: string;
}

export interface SubmitProjectAssessmentReviewResponse {
  status: number;
  message: string;
  res: {
    reviewId: string;
    assessmentId: string;
    status: ReviewStatus;
  } | null;
}

// Get User Project Reviews
export interface GetUserProjectReviewsRequest {
  page: number;
  numberOfResults: number;
}

export interface GetUserProjectReviewsResponse {
  status: number;
  message: string;
  res: {
    reviews: ProjectAssessmentReview[];
  } | null;
}

// Get Project Review Details
export interface GetProjectReviewDetailsRequest {
  assessmentSlug: string;
}

export interface GetProjectReviewDetailsResponse {
  status: number;
  message: string;
  res: {
    review: ProjectAssessmentReview;
    assessment: any; // CycleAssessment with full relations
  } | null;
}

// Submit Project Assessment Review Invite Status
export interface SubmitProjectAssessmentReviewInviteStatusRequest {
  token: string;
  slug: string;
  assessmentId: string; // Encrypted assessment ID
  status: InviteStatus.ACCEPTED | InviteStatus.REJECTED;
}

export interface SubmitProjectAssessmentReviewInviteStatusResponse {
  status: number;
  message: string;
  res: {
    assessmentId: string;
    status: InviteStatus;
    reviewId: string | null;
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
  // Application Reviews
  reviews: Review[];
  currentReview: Review | null;
  currentApplication: Application | null;
  reviewsPagination: PaginationMeta | null;
  isLoadingReviews: boolean;
  reviewsError: string | null;

  // Project Assessment Reviews
  projectReviews: ProjectAssessmentReview[];
  currentProjectReview: ProjectAssessmentReview | null;
  currentAssessment: any | null; // CycleAssessment from project-management.types
  projectReviewsPagination: PaginationMeta | null;
  isLoadingProjectReviews: boolean;
  projectReviewsError: string | null;

  // Application Review Actions
  getUserReviews: (params: GetUserReviewsRequest) => Promise<void>;
  getReviewDetails: (params: GetReviewDetailsRequest) => Promise<void>;
  submitReview: (params: SubmitReviewRequest) => Promise<boolean>;
  updateInviteStatus: (params: UpdateInviteStatusRequest) => Promise<boolean>;

  // Project Assessment Review Actions
  getUserProjectReviews: (params: GetUserProjectReviewsRequest) => Promise<void>;
  getProjectReviewDetails: (params: GetProjectReviewDetailsRequest) => Promise<void>;
  submitProjectAssessmentReview: (params: SubmitProjectAssessmentReviewRequest) => Promise<boolean>;
  submitProjectAssessmentReviewInviteStatus: (
    params: SubmitProjectAssessmentReviewInviteStatusRequest
  ) => Promise<boolean>;

  // Utility Actions
  clearReviews: () => void;
  clearCurrentReview: () => void;
  clearProjectReviews: () => void;
  clearCurrentProjectReview: () => void;
  clearError: () => void;
}
