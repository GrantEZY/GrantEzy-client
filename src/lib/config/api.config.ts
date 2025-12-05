/**
 * API configuration and constants
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  API_VERSION: "/api/v1",
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/auth/local/register",
      LOGIN: "/auth/local/login",
      LOGOUT: "/auth/local/logout",
      REFRESH: "/auth/local/refresh",
    },
    ADMIN: {
      GET_USERS: "/admin/get-users",
      ADD_USER: "/admin/add-user",
      UPDATE_ROLE: "/admin/update-role",
      DELETE_USER: "/admin/delete-user",
      GET_USER_PROFILE: "/admin/get-user-profile",
      ADD_ORGANIZATION: "/admin/add-organization",
      GET_ORGANIZATIONS: "/admin/get-organizations",
      DELETE_ORGANIZATION: "/admin/delete-organization",
      UPDATE_ORGANIZATION: "/admin/update-organization",
    },
    GCV: {
      // GCV Member Management
      GET_MEMBERS: "/gcv/get-gcv-members",
      ADD_MEMBER: "/gcv/add-gcv-member",
      UPDATE_MEMBER_ROLE: "/gcv/update-gcv-role",
      // GCV Program Management
      CREATE_PROGRAM: "/gcv/create-program",
      GET_PROGRAMS: "/gcv/get-programs",
      UPDATE_PROGRAM: "/gcv/update-program",
      DELETE_PROGRAM: "/gcv/delete-program",
      ADD_PROGRAM_MANAGER: "/gcv/add-program-manager",
      UPDATE_PROGRAM_MANAGER: "/gcv/update-program-manager",
      // GCV Program Cycles
      GET_PROGRAM_CYCLES: "/gcv/get-program-cycles",
      GET_CYCLE_DETAILS: "/gcv/get-cycle-details",
      GET_APPLICATION_DETAILS: "/gcv/get-cycle-application-details",
    },
    PM: {
      // PM Program Management
      GET_ASSIGNED_PROGRAM: "/pm/get-pm-program",
      // PM Cycle Management
      CREATE_CYCLE: "/pm/create-cycle",
      GET_PROGRAM_CYCLES: "/pm/get-program-cycles",
      GET_CYCLE_DETAILS: "/pm/get-cycle-details",
      UPDATE_CYCLE_DETAILS: "/pm/update-cycle-details",
      DELETE_CYCLE: "/pm/delete-program-cycle",
      // PM Application & Review Management
      GET_APPLICATION_DETAILS: "/pm/get-application-details",
      INVITE_REVIEWER: "/pm/invite-application-reviewer",
      GET_APPLICATION_REVIEWS: "/pm/get-application-reviews",
      GET_REVIEW_DETAILS: "/pm/get-application-review-details",
    },
    APPLICANT: {
      // Application Submission Steps
      CREATE_APPLICATION: "/applicant/create-application",
      ADD_BUDGET: "/applicant/add-application-budget",
      ADD_TECHNICAL_DETAILS: "/applicant/add-application-technical-details",
      ADD_REVENUE_STREAM: "/applicant/add-application-revenue-stream",
      ADD_RISKS_MILESTONES: "/applicant/add-application-risks-and-milestones",
      ADD_DOCUMENTS: "/applicant/add-application-documents",
      ADD_TEAMMATES: "/applicant/add-application-teammates",
      // Application Management
      GET_USER_APPLICATIONS: "/applicant/get-user-applications",
      GET_APPLICATION_WITH_CYCLE: "/applicant/get-application-details-with-cycle",
      GET_USER_CREATED_APPLICATION: "/applicant/get-user-created-applications",
      DELETE_APPLICATION: "/applicant/delete-user-application",
      // Project Management
      GET_USER_CREATED_PROJECTS: "/applicant/get-user-created-projects",
      GET_PROJECT_DETAILS: "/applicant/get-project-details",
    },
    CO_APPLICANT: {
      // Co-applicant management
      GET_APPLICATION_DETAILS: "/co-applicant/get-application-details",
      GET_TOKEN_DETAILS: "/co-applicant/get-token-details",
      UPDATE_INVITE_STATUS: "/co-applicant/update-user-invite-status",
      // Project Management
      GET_USER_LINKED_PROJECTS: "/co-applicant/get-user-linked-projects",
      GET_PROJECT_DETAILS: "/co-applicant/get-project-details",
    },
    REVIEWER: {
      // Reviewer Management
      GET_TOKEN_DETAILS: "/reviewer/get-token-details",
      UPDATE_INVITE_STATUS: "/reviewer/update-invite-status",
      SUBMIT_REVIEW: "/reviewer/submit-application-review",
      GET_USER_REVIEWS: "/reviewer/get-user-reviews",
      GET_REVIEW_DETAILS: "/reviewer/get-review-details",
    },
    PROJECT_MANAGEMENT: {
      // Project Management
      CREATE_PROJECT: "/pt-management/create-project",
      GET_CYCLE_PROJECTS: "/pt-management/get-cycle-projects",
      GET_PROJECT_DETAILS: "/pt-management/get-project-details",
      CREATE_CYCLE_CRITERIA: "/pt-management/create-cycle-criteria",
      GET_CYCLE_CRITERIAS: "/pt-management/get-cycle-criterias",
    },
    PUBLIC: {
      // Public endpoints (no auth required)
      GET_ACTIVE_CYCLES: "/public/active-program-cycles",
      GET_CYCLE_DETAILS: "/public/program-cycle-details",
    },
    USER: {
      // User Profile Management
      GET_PROFILE: "/user/user-profile",
      UPDATE_PROFILE: "/user/update-profile",
    },
    HEALTH: "/health",
  },
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "grantezy_access_token",
  USER: "grantezy_user",
  // Note: REFRESH_TOKEN is not stored in frontend
  // It's managed by backend as httpOnly cookie named "jwtToken"
} as const;
