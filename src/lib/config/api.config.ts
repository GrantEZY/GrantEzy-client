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
    },
    PM: {
      // PM Cycle Management
      CREATE_CYCLE: "/pm/create-cycle",
      GET_PROGRAM_CYCLES: "/pm/get-program-cycles",
      UPDATE_CYCLE_DETAILS: "/pm/update-cycle-details",
      DELETE_CYCLE: "/pm/delete-program-cycle",
      // PM Program Management (for assigned programs)
      GET_ASSIGNED_PROGRAMS: "/pm/get-assigned-programs",
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
