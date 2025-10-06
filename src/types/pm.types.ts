/**
 * Program Manager (PM) related types
 */
import { Program } from "./gcv.types";

// ============= Enums =============

export enum TRL {
  TRL1 = "TRL1",
  TRL2 = "TRL2",
  TRL3 = "TRL3",
  TRL4 = "TRL4",
  TRL5 = "TRL5",
  TRL6 = "TRL6",
  TRL7 = "TRL7",
  TRL8 = "TRL8",
  TRL9 = "TRL9",
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
  createdAt: string;
  updatedAt: string;
}

// ============= API Request/Response Types =============

// Create Cycle
export interface CreateCycleRequest {
  programId: string;
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
  programId: string;
  page: number;
  numberOfResults: number;
}

export interface GetProgramCyclesResponse {
  status: number;
  message: string;
  res: {
    cycles: Cycle[];
    totalNumberOfCycles: number;
  };
}

// Update Cycle
export interface UpdateCycleRequest {
  cycleId: string;
  round?: ProgramRound;
  budget?: Money;
  duration?: Duration;
  trlCriteria?: Record<TRL, TRLCriteria>;
  scoringScheme?: ScoringScheme;
  status?: CycleStatus;
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

// Get Assigned Programs (for PM to see their programs)
export interface GetAssignedProgramsRequest {
  page: number;
  numberOfResults: number;
  filter?: {
    status?: string;
    otherFilters?: Record<string, string | number | boolean>;
  };
}

export interface GetAssignedProgramsResponse {
  status: number;
  message: string;
  res: {
    programs: Program[];
    numberOfPrograms: number;
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
