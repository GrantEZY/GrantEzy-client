/**
 * Project Management related types for managing approved grant applications as projects
 */

import type { GrantApplication } from './applicant.types';
import type { Document, Money, BudgetItem } from './applicant.types';
import type { User } from './auth.types';
import type { ReviewStatus } from './reviewer.types';

// ============= Enums =============

export enum ProjectReviewRecommendation {
  PERFECT = 'PERFECT',
  GOOD = 'GOOD',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  POOR = 'POOR',
}

// ============= Budget Types =============

export interface QuotedBudget {
  ManPower: BudgetItem[];
  Equipment: BudgetItem[];
  OtherCosts: BudgetItem[];
  Consumables: BudgetItem;
  Travel: BudgetItem;
  Contigency: BudgetItem;
  Overhead: BudgetItem;
}

// ============= Project Types =============

export interface ProjectMetricsDuration {
  startDate: Date;
  endDate: Date;
}

export interface Project {
  id: string;
  applicationId: string;
  application: GrantApplication;
  allocatedBudget: QuotedBudget;
  plannedDuration: ProjectMetricsDuration;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Cycle Assessment Criteria Types =============

export interface CycleAssessmentCriteria {
  id: string;
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: Document;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Cycle Assessment Types =============

export interface CycleAssessment {
  id: string;
  criteriaId: string;
  criteria: CycleAssessmentCriteria;
  applicationId: string;
  application: GrantApplication;
  reviewStatement: string;
  reviewSubmissionFile: Document;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Project Review Types =============

export interface ProjectReview {
  id: string;
  status: ReviewStatus;
  recommendation: ProjectReviewRecommendation | null;
  reviewAnalysis: string;
  reviewerId: string;
  reviewer: User;
  submissionId: string;
  reviewSubmission: CycleAssessment;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= DTOs - Request Types =============

export interface CreateProjectDTO {
  applicationId: string;
  allocatedBudget: QuotedBudget;
  plannedDuration: ProjectMetricsDuration;
}

export interface GetCycleProjectsDTO {
  cycleSlug: string;
  page: number;
  numberOfResults: number;
}

export interface GetProjectDetailsDTO {
  cycleSlug: string;
  applicationSlug: string;
}

export interface CreateCycleCriteriaDTO {
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: Document;
}

export interface GetCycleCriteriasDTO {
  cycleSlug: string;
}

export interface GetCycleCriteriaDetailsWithSubmissionDTO {
  cycleSlug: string;
  criteriaSlug: string;
}

export interface SubmitAssessmentDTO {
  criteriaId: string;
  cycleSlug: string;
  reviewStatement: string;
  reviewSubmissionFile: Document;
}

export interface GetCycleCriteriaDetailsWithAssessmentsDTO {
  cycleSlug: string;
  criteriaSlug: string;
  page: number;
  numberOfResults: number;
}

export interface InviteReviewerForAssessmentDTO {
  assessmentId: string;
  email: string;
}

export interface ProjectReviewSubmissionDTO {
  assessmentId: string;
  recommendation: ProjectReviewRecommendation;
  reviewAnalysis: string;
}

export interface SubmitProjectAssessmentReviewInviteStatusDTO {
  token: string;
  slug: string;
  assessmentId: string;
  status: 'ACCEPTED' | 'REJECTED';
}

export interface GetProjectReviewDetailsDTO {
  assessmentSlug: string;
}

// ============= Response Types =============

export interface CreateProjectResponse {
  applicationId: string;
  projectId: string;
}

export interface GetCycleProjectsResponse {
  applications: GrantApplication[];
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

export interface GetCycleAssessmentDetailsResponse {
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

export interface GetProjectReviewDetailsResponse {
  review: ProjectReview;
  assessment: CycleAssessment;
  project: Project;
  criteria: CycleAssessmentCriteria;
}

export interface SubmitProjectReviewResponse {
  submissionId: string;
  reviewId: string;
  status: ReviewStatus;
}

export interface GetUserProjectReviewsResponse {
  reviews: ProjectReview[];
}

// ============= State Types =============

export interface ProjectManagementState {
  // Projects
  projects: GrantApplication[];
  currentProject: Project | null;
  isLoadingProjects: boolean;
  projectsError: string | null;

  // Criteria
  cycleCriterias: CycleAssessmentCriteria[];
  currentCriteria: CycleAssessmentCriteria | null;
  isLoadingCriteria: boolean;
  criteriaError: string | null;

  // Assessments
  assessments: CycleAssessment[];
  currentAssessment: CycleAssessment | null;
  isLoadingAssessments: boolean;
  assessmentsError: string | null;

  // Project Reviews
  projectReviews: ProjectReview[];
  currentProjectReview: ProjectReview | null;
  currentProjectReviewAssessment: CycleAssessment | null;
  currentProjectReviewProject: Project | null;
  currentProjectReviewCriteria: CycleAssessmentCriteria | null;
  isLoadingProjectReviews: boolean;
  projectReviewsError: string | null;

  // Actions
  setProjects: (projects: GrantApplication[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setCycleCriterias: (criterias: CycleAssessmentCriteria[]) => void;
  setCurrentCriteria: (criteria: CycleAssessmentCriteria | null) => void;
  setAssessments: (assessments: CycleAssessment[]) => void;
  setCurrentAssessment: (assessment: CycleAssessment | null) => void;
  setProjectReviews: (reviews: ProjectReview[]) => void;
  setCurrentProjectReviewDetails: (data: {
    review: ProjectReview;
    assessment: CycleAssessment;
    project: Project;
    criteria: CycleAssessmentCriteria;
  }) => void;
  clearProjectReviewDetails: () => void;
  setProjectsLoading: (loading: boolean) => void;
  setCriteriaLoading: (loading: boolean) => void;
  setAssessmentsLoading: (loading: boolean) => void;
  setProjectReviewsLoading: (loading: boolean) => void;
  setProjectsError: (error: string | null) => void;
  setCriteriaError: (error: string | null) => void;
  setAssessmentsError: (error: string | null) => void;
  setProjectReviewsError: (error: string | null) => void;
}
