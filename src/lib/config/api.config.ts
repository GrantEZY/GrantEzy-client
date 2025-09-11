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
  REFRESH_TOKEN: "grantezy_refresh_token",
  USER: "grantezy_user",
} as const;
