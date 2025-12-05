/**
 * GCV (Grant Committee View) related types
 */
import { OrganisationType } from "./admin.types";
import { UserRoles } from "./auth.types";

// ============= Enums =============

export enum UpdateRole {
  ADD_ROLE = "ADD_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
}

export enum ProgramStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

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

// ============= GCV Member Types =============

export interface GCVMember {
  personId: string;
  person: {
    firstName: string;
    lastName: string;
  };
  contact: {
    email: string;
  };
  role: UserRoles[];
  createdAt: string;
  updatedAt: string;
  // For backward compatibility
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface UserFilterDto {
  role?: UserRoles;
  otherFilters?: Record<string, string | number | boolean>;
}

export interface GetAllGCVMembersRequest {
  page: number;
  numberOfResults: number;
  filter?: UserFilterDto;
}

export interface GetAllGCVMembersResponse {
  status: number;
  message: string;
  res: {
    users: GCVMember[];
    totalNumberOfUsers: number;
  };
}

export interface AddGCVMemberRequest {
  email: string;
}

export interface AddGCVMemberResponse {
  status: number;
  message: string;
  res: {
    id: string;
    email: string;
  };
}

export interface UpdateGCVUserRoleRequest {
  email: string;
  type: UpdateRole;
}

export interface UpdateGCVUserRoleResponse {
  status: number;
  message: string;
  res: {
    id: string;
    role: UserRoles;
  };
}

// ============= Program Types =============

export interface ProgramDetails {
  name: string;
  description: string;
  category: string;
}

export interface Duration {
  startDate: Date | string;
  endDate?: Date | string | null;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface OrganizationDetails {
  name: string;
  type?: OrganisationType;
  isNew: boolean;
}

export interface Program {
  id: string;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
    type: OrganisationType;
  };
  details: ProgramDetails;
  duration: Duration;
  budget: Money;
  minTRL: TRL;
  maxTRL: TRL;
  status: ProgramStatus;
  managerId?: string | null;
  manager?: {
    personId: string;
    person: {
      firstName: string;
      lastName: string;
    };
    contact: {
      email: string;
    };
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramRequest {
  organization: OrganizationDetails;
  details: ProgramDetails;
  duration: Duration;
  budget: Money;
  minTRL: TRL;
  maxTRL: TRL;
}

export interface CreateProgramResponse {
  status: number;
  message: string;
  res: {
    organizationId: string;
    name: string;
    id: string;
  };
}

export interface ProgramFilterDto {
  otherFilters?: Record<string, string | number | boolean>;
}

export interface GetAllProgramsRequest {
  page: number;
  numberOfResults: number;
  filter?: ProgramFilterDto;
}

export interface GetAllProgramsResponse {
  status: number;
  message: string;
  res: {
    programs: Program[];
    numberOfPrograms: number;
  };
}

export interface UpdateProgramDetailsDTO {
  name?: string;
  description?: string;
  category?: string;
}

export interface UpdateDurationDTO {
  startDate?: Date | string;
  endDate?: Date | string | null;
}

export interface UpdateMoneyDTO {
  amount?: number;
  currency?: string;
}

export interface UpdateProgramRequest {
  id: string;
  details?: UpdateProgramDetailsDTO;
  duration?: UpdateDurationDTO;
  budget?: UpdateMoneyDTO;
  minTRL?: TRL;
  maxTRL?: TRL;
}

export interface UpdateProgramResponse {
  status: number;
  message: string;
  res: {
    id: string;
    status: ProgramStatus;
  };
}

export interface DeleteProgramRequest {
  id: string;
}

export interface DeleteProgramResponse {
  status: number;
  message: string;
  res: {
    success: boolean;
  };
}

export interface AddProgramManagerRequest {
  id: string; // Program ID
  email: string; // Manager email
}

export interface AddProgramManagerResponse {
  status: number;
  message: string;
  res: {
    managerId: string;
    programId: string;
  };
}

// ============= Pagination =============

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============= GCV Program Cycles Types =============

export interface GetGCVProgramCyclesRequest {
  programId: string;
  page: number;
  numberOfResults: number;
}

export interface GetGCVProgramCyclesResponse {
  status: number;
  message: string;
  res: {
    cycles: import("./pm.types").Cycle[];
    totalNumberOfCycles: number;
  };
}

export interface GetGCVCycleDetailsRequest {
  cycleSlug: string;
}

export interface GetGCVCycleDetailsResponse {
  status: number;
  message: string;
  res: {
    cycle: import("./pm.types").Cycle;
  };
}

export interface GetGCVApplicationDetailsRequest {
  cycleSlug: string;
  applicationSlug: string;
}

// ============= Application Types =============

export interface GrantApplication {
  id: string;
  cycleId: string;
  applicantId: string;
  applicationData: Record<string, unknown>;
  status: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetGCVApplicationDetailsResponse {
  status: number;
  message: string;
  res: {
    application: GrantApplication;
  };
}
