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
      // GCV Program Cycles
      GET_PROGRAM_CYCLES: "/gcv/get-program-cycles",
      GET_CYCLE_DETAILS: "/gcv/get-cycle-details",
      GET_APPLICATION_DETAILS: "/gcv/get-application-details",
    },
    PM: {
      // PM Cycle Management
      CREATE_CYCLE: "/pm/create-cycle",
      GET_PROGRAM_CYCLES: "/pm/get-program-cycles",
      UPDATE_CYCLE_DETAILS: "/pm/update-cycle-details",
      DELETE_CYCLE: "/pm/delete-program-cycle",
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
      GET_USER_APPLICATIONS: "/applicant/get-user-applications",
      GET_APPLICATION_WITH_CYCLE: "/applicant/get-application-details-with-cycle",
    },
    PUBLIC: {
      // Public endpoints (no auth required)
      GET_ACTIVE_CYCLES: "/public/active-program-cycles",
      GET_CYCLE_DETAILS: "/public/program-cycle-details",
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
