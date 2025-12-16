/**
 * Project Management Types
 * Matches backend DTOs and response structures
 */

// ============= Enums =============

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

// ============= Basic Types =============

export interface Money {
  amount: number;
  currency: string;
}

export interface BudgetItem {
  BudgetReason: string;
  Budget: Money;
}

export interface QuotedBudget {
  ManPower: BudgetItem[];
  Equipment: BudgetItem[];
  OtherCosts: BudgetItem[];
  Consumables: BudgetItem;
  Travel: BudgetItem;
  Contigency: BudgetItem;
  Overhead: BudgetItem;
}

export interface ProjectDuration {
  startDate: Date | string;
  endDate: Date | string;
}

export interface DocumentObject {
  title: string;
  description?: string | null;
  fileName: string;
  fileSize: string;
  mimeType: string;
  storageUrl: string;
  metaData?: Record<string, string> | null;
}

export interface Application {
  id: string;
  slug: string;
  title?: string;
  status: string;
  projectId?: string | null;
  project?: Project | null;
  basicInfo?: any;
  budget?: any;
  technicalDetails?: any;
  risks?: any;
  milestones?: any;
  documents?: any;
  teammates?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: string;
  slug: string;
  status: string;
  budget: Money;
  createdAt: string;
  updatedAt: string;
}

// ============= Project Types =============

export interface Project {
  id: string;
  slug: string;
  applicationId: string;
  cycleId: string;
  status: ProjectStatus | string;
  allotedBudget: QuotedBudget;
  duration: ProjectDuration;
  createdAt: string;
  updatedAt: string;
  application?: Application;
  cycle?: Cycle;
}

export interface ProjectCriteria {
  id: string;
  cycleId: string;
  name: string;
  reviewBrief: string;
  templateFile?: DocumentObject | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  hasSubmitted?: boolean;
  submittedAt?: string | null;
}

export interface CycleAssessment {
  id: string;
  criteriaId: string;
  criteria: ProjectCriteria;
  projectId: string;
  project: Project;
  reviewBrief: string | null;
  reviewDocument: DocumentObject;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectReviewRecommendation {
  PERFECT = 'PERFECT',
  GOOD = 'GOOD',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  POOR = 'POOR',
}

export interface ProjectReview {
  id: string;
  status: string;
  recommendation: ProjectReviewRecommendation | null;
  reviewAnalysis: string;
  reviewerId: string;
  reviewer: any;
  submissionId: string;
  reviewSubmission: CycleAssessment;
  slug: string;
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

// Create Project
export interface CreateProjectRequest {
  applicationId: string;
  allocatedBudget: QuotedBudget;
  plannedDuration: ProjectDuration;
}

export interface CreateProjectResponse {
  status: number;
  message: string;
  res: {
    projectId: string;
    applicationId: string;
  } | null;
}

// Get Cycle Projects
export interface GetCycleProjectsRequest {
  cycleSlug: string;
  page: number;
  numberOfResults: number;
}

export interface GetCycleProjectsResponse {
  status: number;
  message: string;
  res: {
    applications: Application[];
  } | null;
}

// Get Project Details
export interface GetProjectDetailsRequest {
  cycleSlug: string;
  applicationSlug: string;
}

export interface GetProjectDetailsResponse {
  status: number;
  message: string;
  res: {
    project: Project;
  } | null;
}

// Create Cycle Criteria
export interface CreateCycleCriteriaRequest {
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: DocumentObject;
}

export interface CreateCycleCriteriaResponse {
  status: number;
  message: string;
  res: {
    criteriaName: string;
  } | null;
}

// Get Cycle Criterias
export interface GetCycleCriteriasRequest {
  cycleSlug: string;
}

export interface GetCycleCriteriasResponse {
  status: number;
  message: string;
  res: {
    criterias: ProjectCriteria[];
  } | null;
}

// Applicant - Get User Projects
export interface GetUserProjectsRequest {
  page: number;
  numberOfResults: number;
}

export interface GetUserProjectsResponse {
  status: number;
  message: string;
  res: {
    applications: Application[];
  } | null;
}

// Applicant/Co-Applicant - Get Project Details by Slug
export interface GetProjectDetailsBySlugRequest {
  applicationSlug: string;
}

export interface GetProjectDetailsBySlugResponse {
  status: number;
  message: string;
  res: {
    project: Project;
  } | null;
}

// ============= State Types =============

import type {
  Project as PMProject,
  CycleAssessmentCriteria,
  CycleAssessment as PMCycleAssessment,
  ProjectReview as PMProjectReview,
} from './project-management.types';
import type { GrantApplication } from './applicant.types';

export interface ProjectState {
  // Projects list (returns applications with project relation)
  projects: GrantApplication[];
  projectsPagination: PaginationMeta | null;
  isProjectsLoading: boolean;
  projectsError: string | null;

  // Current project
  currentProject: PMProject | null;
  isProjectLoading: boolean;
  projectError: string | null;

  // Criterias
  criterias: CycleAssessmentCriteria[];
  currentCriteria: CycleAssessmentCriteria | null;
  isCriteriasLoading: boolean;
  criteriasError: string | null;

  // Assessments
  assessments: PMCycleAssessment[];
  currentAssessment: PMCycleAssessment | null;
  isAssessmentsLoading: boolean;
  assessmentsError: string | null;

  // Project Reviews
  projectReviews: PMProjectReview[];
  currentProjectReview: PMProjectReview | null;
  currentProjectReviewAssessment: PMCycleAssessment | null;
  currentProjectReviewProject: PMProject | null;
  currentProjectReviewCriteria: CycleAssessmentCriteria | null;
  isProjectReviewsLoading: boolean;
  projectReviewsError: string | null;
}

// ============= Assessment Request/Response Types =============

// Get Applicant Cycle Criterias (same as GetCycleCriteriasRequest)
export type GetApplicantCycleCriteriasRequest = GetCycleCriteriasRequest;
export type GetApplicantCycleCriteriasResponse = GetCycleCriteriasResponse;

// Get Applicant Assessment Submission
export interface GetApplicantAssessmentSubmissionRequest {
  cycleSlug: string;
  criteriaSlug: string;
}

export interface GetApplicantAssessmentSubmissionResponse {
  status: number;
  message: string;
  res: {
    criteria: ProjectCriteria;
    cycleSubmission: CycleAssessment | null;
  } | null;
}

// Create/Submit Assessment
export interface CreateAssessmentSubmissionRequest {
  criteriaId: string;
  cycleSlug: string;
  reviewStatement: string;
  reviewSubmissionFile: DocumentObject;
}

export interface CreateAssessmentSubmissionResponse {
  status: number;
  message: string;
  res: {
    submission: CycleAssessment;
  } | null;
}

// Get Cycle Criteria Assessments (PM view)
export interface GetCycleCriteriaAssessmentsRequest {
  cycleSlug: string;
  criteriaSlug: string;
  page: number;
  numberOfResults: number;
}

export interface GetCycleCriteriaAssessmentsResponse {
  status: number;
  message: string;
  res: {
    submissions: CycleAssessment[];
    criteria: ProjectCriteria;
  } | null;
}

// Invite Reviewer for Assessment
export interface InviteReviewerForAssessmentRequest {
  assessmentId: string;
  email: string;
}

export interface InviteReviewerForAssessmentResponse {
  status: number;
  message: string;
  res: null;
}

// ============= Project Review Request/Response Types =============

// Get User Project Reviews
export interface GetUserProjectReviewsRequest {
  page: number;
  numberOfResults: number;
}

export interface GetUserProjectReviewsResponse {
  status: number;
  message: string;
  res: {
    reviews: ProjectReview[];
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
    review: ProjectReview;
    assessment: CycleAssessment;
    project: Project;
    criteria: ProjectCriteria;
  } | null;
}

// Submit Project Assessment Review
export interface SubmitProjectReviewRequest {
  assessmentId: string;
  recommendation: ProjectReviewRecommendation;
  reviewAnalysis: string;
}

export interface SubmitProjectReviewResponse {
  status: number;
  message: string;
  res: {
    submissionId: string;
    reviewId: string;
    status: string;
  } | null;
}

// Submit Project Review Invite Status
export interface SubmitProjectReviewInviteStatusRequest {
  token: string;
  slug: string;
  assessmentId: string;
  status: 'ACCEPTED' | 'REJECTED';
}

export interface SubmitProjectReviewInviteStatusResponse {
  status: number;
  message: string;
  res: {
    applicationId: string;
    status: string;
    reviewId: string | null;
  } | null;
}
