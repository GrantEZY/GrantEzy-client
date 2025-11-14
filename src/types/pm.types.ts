/**
 * Program Manager (PM) related types
 */
import { Program } from "./gcv.types";

// ============= Enums =============

export enum TRL {
  TRL_1 = "TRL1",
  TRL_2 = "TRL2",
  TRL_3 = "TRL3",
  TRL_4 = "TRL4",
  TRL_5 = "TRL5",
  TRL_6 = "TRL6",
  TRL_7 = "TRL7",
  TRL_8 = "TRL8",
  TRL_9 = "TRL9",
}

export enum CycleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
}

// ============= Basic Types =============

export interface ProgramRound {
  year: number;
  type: string;
}

export interface Duration {
  startDate: Date | string;
  endDate?: Date | string | null;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface TRLCriteria {
  requirements: string[];
  evidence: string[];
  metrics: string[];
}

export interface ScoringCriteria {
  minScore: number;
  maxScore: number;
  weightage: number;
}

export interface ScoringScheme {
  technical: ScoringCriteria;
  market: ScoringCriteria;
  financial: ScoringCriteria;
  team: ScoringCriteria;
  innovation: ScoringCriteria;
}

// ============= Cycle Types =============

export interface Cycle {
  id: string;
  programId: string;
  program?: Program;
  round: ProgramRound;
  budget: Money;
  duration: Duration;
  trlCriteria: Record<TRL, TRLCriteria>;
  scoringScheme: ScoringScheme;
  status?: CycleStatus;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= API Request/Response Types =============

// Create Cycle
export interface CreateCycleRequest {
  programId: string; // Required - backend expects programId as UUID
  round: ProgramRound;
  budget: Money;
  duration: Duration;
  trlCriteria: Record<TRL, TRLCriteria>;
  scoringScheme: ScoringScheme;
}

export interface CreateCycleResponse {
  status: number;
  message: string;
  res: {
    programId: string;
    cycleId: string;
  };
}

// Get Program Cycles
export interface GetProgramCyclesRequest {
  page: number;
  numberOfResults: number;
  // Note: programId is not needed - backend determines program from logged-in PM user
}

export interface GetProgramCyclesResponse {
  status: number;
  message: string;
  res: {
    cycles: Cycle[];
    totalNumberOfCycles: number;
  };
}

// Get Assigned Program
export interface GetAssignedProgramResponse {
  status: number;
  message: string;
  res: {
    program: Program;
  };
}

// Update Cycle
export interface UpdateCycleRequest {
  id: string;
  round?: ProgramRound;
  duration?: Duration;
  trlCriteria?: Record<TRL, TRLCriteria>;
}

export interface UpdateCycleResponse {
  status: number;
  message: string;
  res: {
    id: string;
    status: boolean;
  };
}

// Delete Cycle
export interface DeleteCycleRequest {
  cycleId: string;
}

export interface DeleteCycleResponse {
  status: number;
  message: string;
  res: {
    status: boolean;
  };
}

// ============= Filter Types =============

export interface CycleFilterDto {
  status?: CycleStatus;
  year?: number;
  otherFilters?: Record<string, string | number | boolean>;
}

export interface ProgramFilterDto {
  status?: string;
  otherFilters?: Record<string, string | number | boolean>;
}

// ============= Form Types for Multi-step Wizard =============

export interface CycleBasicInfoForm {
  round: ProgramRound;
  budget: Money;
  duration: Duration;
}

export interface CycleTRLCriteriaForm {
  trlCriteria: Record<TRL, TRLCriteria>;
}

export interface CycleScoringSchemeForm {
  scoringScheme: ScoringScheme;
}

export interface CreateCycleFormData {
  basicInfo: CycleBasicInfoForm;
  trlCriteria: CycleTRLCriteriaForm;
  scoringScheme: CycleScoringSchemeForm;
}

// ============= Dashboard Types =============

export interface PMDashboardStats {
  totalPrograms: number;
  activeCycles: number;
  totalBudgetAllocated: number;
  upcomingDeadlines: number;
}

export interface RecentActivity {
  id: string;
  type:
    | "cycle_created"
    | "cycle_updated"
    | "cycle_deleted"
    | "program_assigned";
  message: string;
  timestamp: string;
  programName?: string;
  cycleName?: string;
}

// ============= Get Cycle Details =============

export interface GetCycleDetailsRequest {
  cycleSlug: string;
}

export interface CycleApplication {
  id: string;
  slug: string;
  applicantId: string;
  cycleId: string;
  status: string;
  stepNumber: number;
  createdAt: string;
  updatedAt: string;
  basicInfo?: {
    title: string;
    summary: string;
    problem: string;
    solution: string;
    innovation: string;
  };
  applicant?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface GetCycleDetailsResponse {
  status: number;
  message: string;
  res: {
    cycle: Cycle; // Note: Backend returns applications nested inside cycle.applications
  };
}

// ============= Get Application Details =============

export interface GetPMApplicationDetailsRequest {
  cycleSlug: string;
  applicationSlug: string;
}

export interface GetPMApplicationDetailsResponse {
  status: number;
  message: string;
  res: {
    application: CycleApplication;
  };
}

// ============= Invite Reviewer =============

export interface InviteReviewerRequest {
  applicationId: string; // UUID of the application
  email: string; // Email of the reviewer to invite
}

export interface InviteReviewerResponse {
  status: number;
  message: string;
  res: {
    email: string;
    applicationId: string;
  };
}

// ============= Get Application Reviews =============

export interface GetApplicationReviewsRequest {
  cycleSlug: string;
  applicationSlug: string;
  page: number;
  numberOfResults: number;
}

export interface Review {
  id: string;
  slug: string;
  reviewerId: string;
  applicationId: string;
  status: string;
  score?: number;
  comments?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  recommendation?: string;
  suggestedBudget?: {
    amount: number;
    currency: string;
  };
  scores?: {
    technical: number;
    market: number;
    financial: number;
    team: number;
    innovation: number;
  };
  reviewer?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  application?: {
    id: string;
    slug: string;
    title?: string;
    status: string;
  };
}

export interface GetApplicationReviewsResponse {
  status: number;
  message: string;
  res: {
    application: CycleApplication;
    reviews: Review[];
    // Note: Backend does not return pagination metadata
  };
}

// ============= Get Review Details =============

export interface GetReviewDetailsRequest {
  cycleSlug: string;
  applicationSlug: string;
  reviewSlug: string;
}

export interface ReviewDetails extends Review {
  detailedFeedback?: {
    technicalFeasibility?: string;
    innovation?: string;
    marketPotential?: string;
    teamCapability?: string;
    budgetJustification?: string;
  };
}

export interface GetReviewDetailsResponse {
  status: number;
  message: string;
  res: {
    review: ReviewDetails;
  };
}
