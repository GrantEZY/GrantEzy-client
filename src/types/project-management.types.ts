import type { DocumentObject } from "./project.types";

// ============================================================================
// Request Types - Matching Backend DTOs
// ============================================================================

export interface CreateProjectRequest {
  applicationId: string;
  allocatedBudget: number;
  plannedDuration: {
    startDate: Date;
    endDate: Date;
  };
}

export interface GetCycleProjectsRequest {
  cycleSlug: string;
  page: number;
  numberOfResults: number;
}

export interface GetProjectDetailsRequest {
  cycleSlug: string;
  applicationSlug: string;
}

export interface CreateCycleCriteriaRequest {
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: DocumentObject;
}

export interface GetCycleCriteriasRequest {
  cycleSlug: string;
}

export interface GetCycleCriteriaDetailsRequest {
  cycleSlug: string;
  criteriaSlug: string;
}

export interface SubmitAssessmentRequest {
  criteriaId: string;
  cycleSlug: string;
  reviewStatement: string;
  reviewSubmissionFile?: DocumentObject;
}

export interface GetCycleCriteriaAssessmentsRequest {
  cycleSlug: string;
  criteriaSlug: string;
  page: number;
  numberOfResults: number;
}

export interface InviteReviewerForAssessmentRequest {
  assessmentId: string;
  email: string;
}

// ============================================================================
// Aggregate Types - From Backend
// ============================================================================

export interface ProjectMetrics {
  startDate: Date;
  endDate: Date;
}

export interface Project {
  id: string;
  applicationId: string;
  allocatedBudget: number;
  plannedDuration: ProjectMetrics;
  createdAt: Date;
  updatedAt: Date;
  application?: any; // Reference to GrantApplication
}

export interface CycleAssessmentCriteria {
  id: string;
  slug: string;
  cycleId: string;
  name: string;
  reviewBrief: string;
  templateFile?: DocumentObject;
  createdAt: Date;
  updatedAt: Date;
  cycle?: any; // Reference to Cycle
}

export interface CycleAssessment {
  id: string;
  projectId: string;
  criteriaId: string;
  reviewBrief: string;
  reviewFile?: DocumentObject;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  project?: Project;
  criteria?: CycleAssessmentCriteria;
}

// ============================================================================
// Response Types - Matching Backend Response DTOs
// ============================================================================

export interface CreateProjectResponse {
  applicationId: string;
  projectId: string;
}

export interface GetCycleProjectsResponse {
  applications: any[]; // GrantApplication[] - uses applicant.types
}

export interface GetProjectDetailsResponse {
  project: Project;
}

export interface CreateCriteriaResponse {
  criteriaName: string;
}

export interface GetCycleCriteriasResponse {
  criterias: CycleAssessmentCriteria[];
}

export interface GetCycleCriteriaDetailsResponse {
  criteria: CycleAssessmentCriteria;
  cycleSubmission: CycleAssessment | null;
}

export interface CreateAssessmentSubmissionResponse {
  submission: CycleAssessment;
}

export interface GetCycleCriteriaAssessmentsResponse {
  submissions: CycleAssessment[];
  criteria: CycleAssessmentCriteria;
}

export interface InviteReviewerResponse {
  email: string;
  application: string;
}

// ============================================================================
// UI Helper Types
// ============================================================================

export interface CriteriaWithSubmissionStatus extends CycleAssessmentCriteria {
  hasSubmitted?: boolean;
  submittedAt?: Date;
}

export interface AssessmentSubmissionSummary {
  totalCriteria: number;
  submittedCount: number;
  pendingCount: number;
}
