/**
 * Co-applicant related types based on backend DTOs and Swagger API documentation
 */

// Invite status enum matching backend
export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

// Request types matching backend DTOs

export interface CoApplicantApplicationRequest {
  applicationId: string; // UUID
}

export interface GetTokenDetailsRequest {
  token: string; // Verification token
  slug: string; // Verification slug
}

export interface UpdateInviteStatusRequest {
  token: string; // Verification token
  slug: string; // Verification slug
  status: InviteStatus.ACCEPTED | InviteStatus.REJECTED;
}

// Response types based on backend response DTOs and Swagger examples

export interface TeamMate {
  personId: string;
  name: string;
  role: string;
}

export interface TeamMateInvite {
  email: string;
  inviteAs: string;
}

export interface ApplicationDetails {
  id: string;
  title: string;
  applicantId: string;
  teammates: TeamMate[];
  teamMateInvites: TeamMateInvite[];
}

export interface CoApplicantApplicationResponse {
  status: number;
  message: string;
  res: {
    application: ApplicationDetails;
  };
}

export interface TokenDetailsApplication {
  name: string;
  problem: string;
}

export interface TokenDetailsResponse {
  status: number;
  message: string;
  res: {
    invitedAt: string; // ISO date string
    application: TokenDetailsApplication;
  };
}

export interface InviteStatusUpdateResponse {
  status: number;
  message: string;
  res: {
    applicationId: string;
    status: InviteStatus;
  };
}

// Error response type
export interface CoApplicantErrorResponse {
  status: number;
  message: string;
  res: null;
}

// Union type for all possible responses
export type CoApplicantApiResponse<T = any> =
  | { status: 200; message: string; res: T }
  | CoApplicantErrorResponse;

// Utility types for component props and state management
export interface LinkedApplication {
  id: string;
  cycleId: string;
  stepNumber: number;
  isSubmitted: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  basicDetails?: {
    title: string;
    summary: string;
    problem: string;
    solution: string;
    innovation: string;
  };
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

export interface GetUserLinkedProjectsResponse {
  status: number;
  message: string;
  res: {
    applications: LinkedApplication[];
  };
}

export interface CoApplicantState {
  applicationDetails: ApplicationDetails | null;
  tokenDetails: {
    invitedAt: string;
    application: TokenDetailsApplication;
  } | null;
  linkedProjects: LinkedApplication[];
  isLoading: boolean;
  error: string | null;
}

export interface CoApplicantActions {
  getApplicationDetails: (applicationId: string) => Promise<void>;
  getTokenDetails: (token: string, slug: string) => Promise<void>;
  updateInviteStatus: (
    token: string,
    slug: string,
    status: InviteStatus.ACCEPTED | InviteStatus.REJECTED,
  ) => Promise<void>;
  getUserLinkedProjects: (
    page: number,
    numberOfResults: number,
  ) => Promise<void>;
  clearError: () => void;
  clearState: () => void;
}

// Component prop types
export interface CoApplicantInviteCardProps {
  token: string;
  slug: string;
  onStatusUpdate?: (status: InviteStatus) => void;
}

export interface ApplicationDetailsViewProps {
  applicationId: string;
  onBack?: () => void;
}

export interface TeamMateListProps {
  teammates: TeamMate[];
  invites: TeamMateInvite[];
}
