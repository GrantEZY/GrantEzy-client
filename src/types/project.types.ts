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
  name: string;
  size: number;
  publicId: string;
  url: string;
}

export interface Application {
  id: string;
  slug: string;
  title?: string;
  status: string;
  basicInfo?: any;
  budget?: any;
  technicalDetails?: any;
  risks?: any;
  milestones?: any;
  documents?: any;
  teammates?: any;
  createdAt: string;
  updatedAt: string;
  cycle?: Cycle;
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
  status: ProjectStatus | string;
  allotedBudget: QuotedBudget;
  duration: ProjectDuration;
  progress?: any;
  metrics?: any;
  mentorId?: string | null;
  createdAt: string;
  updatedAt: string;
  application?: Application;
  mentor?: any;
}

export interface ProjectCriteria {
  id: string;
  cycleId: string;
  name: string;
  briefReview: string;
  templateFile?: DocumentObject;
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
    projects: Project[];
    pagination: PaginationMeta;
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
    criteriaId: string;
    cycleId: string;
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
    applications: Project[];
    pagination?: PaginationMeta;
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

export interface ProjectState {
  // Projects list
  projects: Project[];
  projectsPagination: PaginationMeta | null;
  isProjectsLoading: boolean;
  projectsError: string | null;

  // Current project
  currentProject: Project | null;
  isProjectLoading: boolean;
  projectError: string | null;

  // Criterias
  criterias: ProjectCriteria[];
  isCriteriasLoading: boolean;
  criteriasError: string | null;
}
