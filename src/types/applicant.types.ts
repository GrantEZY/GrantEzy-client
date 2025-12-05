/**
 * Applicant related types for application submission and management
 */

// ============= Enums =============

export enum RiskImpact {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum RevenueStreamType {
  SUBSCRIPTION = "SUBSCRIPTION",
  LICENSE = "LICENSE",
  USAGE_BASED = "USAGE_BASED",
  DIRECT_SALES = "DIRECT_SALES",
  FREEMIUM = "FREEMIUM",
  MARKETPLACE = "MARKETPLACE",
  ADVERTISING = "ADVERTISING",
  CONSULTING = "CONSULTING",
}

// ============= Common Types =============

export interface Money {
  amount: number;
  currency: string;
}

export interface BudgetItem {
  BudgetReason: string;
  Budget: Money;
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

// ============= Application Data Structures =============

export interface BasicInfo {
  title: string;
  summary: string;
  problem: string;
  solution: string;
  innovation: string;
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

export interface ApplicationDocuments {
  endorsementLetter: Document;
  plagiarismUndertaking: Document;
  ageProof: Document;
  aadhar: Document;
  piCertificate: Document;
  coPiCertificate: Document;
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
  userId: string;
  cycleId: string;
  stepNumber: number;
  basicInfo?: BasicInfo;
  budget?: Budget;
  technicalSpec?: TechnicalSpec;
  marketInfo?: MarketInfo;
  revenueModel?: RevenueModel;
  risks?: Risk[];
  milestones?: Milestone[];
  documents?: ApplicationDocuments;
  teamMateInvites?: TeamMateInvite[];
  isSubmitted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============= API Request Types =============

export interface CreateApplicationRequest {
  cycleSlug: string;
  basicInfo: BasicInfo;
}

export interface CreateApplicationResponse {
  status: number;
  message: string;
  res: {
    application: {
      id: string;
      userId: string;
      cycleId: string;
    };
  };
}

export interface AddApplicationBudgetRequest {
  applicationId: string;
  budget: Budget;
}

export interface AddApplicationBudgetResponse {
  status: number;
  message: string;
  res: {
    application: {
      id: string;
      stepNumber: number;
    };
  };
}

export interface AddApplicationTechnicalDetailsRequest {
  applicationId: string;
  technicalSpec: TechnicalSpec;
  marketInfo: MarketInfo;
}

export interface AddApplicationTechnicalDetailsResponse {
  status: number;
  message: string;
  res: {
    application: {
      id: string;
      stepNumber: number;
    };
  };
}

export interface AddApplicationRevenueStreamRequest {
  applicationId: string;
  revenueModel: RevenueModel;
}

export interface AddApplicationRevenueStreamResponse {
  status: number;
  message: string;
  res: {
    application: {
      id: string;
      stepNumber: number;
    };
  };
}

export interface AddApplicationRisksAndMilestonesRequest {
  applicationId: string;
  risks: Risk[];
  milestones: Milestone[];
}

export interface AddApplicationRisksAndMilestonesResponse {
  status: number;
  message: string;
  res: {
    application: {
      id: string;
      stepNumber: number;
    };
  };
}

export interface AddApplicationDocumentsRequest {
  applicationId: string;
  endorsementLetter: Document;
  plagiarismUndertaking: Document;
  ageProof: Document;
  aadhar: Document;
  piCertificate: Document;
  coPiCertificate: Document;
  otherDocuments?: Document[];
}

export interface AddApplicationDocumentsResponse {
  status: number;
  message: string;
  res: {
    application: {
      id: string;
      stepNumber: number;
    };
  };
}

export interface AddApplicationTeammatesRequest {
  applicationId: string;
  emails: string[];
  isSubmitted: boolean;
}

export interface AddApplicationTeammatesResponse {
  status: number;
  message: string;
  res: {
    application: {
      id: string;
      teamMateInvites: TeamMateInvite[];
    };
  };
}

// ============= Application Steps =============

export enum ApplicationStep {
  BASIC_INFO = 1,
  BUDGET = 2,
  TECHNICAL_DETAILS = 3,
  REVENUE_MODEL = 4,
  RISKS_MILESTONES = 5,
  DOCUMENTS = 6,
  TEAM_MEMBERS = 7,
}

export interface ApplicationStepInfo {
  step: ApplicationStep;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

// ============= User Applications List =============

export interface UserApplication {
  id: string;
  userId: string;
  cycleId: string;
  stepNumber: number;
  isSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
  basicDetails?: BasicInfo;  // Changed from basicInfo to match backend
  cycle?: {
    id: string;
    slug: string;
    round: {
      year: number;
      type: string;
    };
    status: string;
    program?: {
      id: string;
      slug: string;
      status: string;
      details?: {
        name: string;
        description: string;
        about: string;
      };
    };
  };
}

export interface GetUserApplicationsResponse {
  status: number;
  message: string;
  res: {
    myApplications: UserApplication[];
    linkedApplications: UserApplication[];
  };
}

export interface GetApplicationWithCycleDetailsResponse {
  status: number;
  message: string;
  res: {
    cycle: {
      id: string;
      name: string;
      slug: string;
      description?: string;
      budget?: {
        amount: number;
        currency: string;
      };
      startDate?: string;
      endDate?: string;
      status?: string;
    };
    applicationDetails: Application | null;
  };
}

export interface GetUserCreatedApplicationDetailsResponse {
  status: number;
  message: string;
  res: {
    application: Application;
  };
}

export interface DeleteApplicationResponse {
  status: number;
  message: string;
  res: {
    success: boolean;
    applicationId: string;
  };
}
