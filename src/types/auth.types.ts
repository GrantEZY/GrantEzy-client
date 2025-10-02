/**
 * Authentication related types based on server DTOs
 */

export enum UserRoles {
  ADMIN = "ADMIN",
  DIRECTOR = "DIRECTOR",
  PROGRAM_MANAGER = "PROGRAM_MANAGER",
  COMMITTEE_MEMBER = "COMMITTEE_MEMBER",
  MENTOR = "MENTOR",
  APPLICANT = "APPLICANT",
  TEAM_MATE = "TEAM_MATE",
  FINANCE = "FINANCE",
  REVIEWER = "REVIEWER",
  NORMAL_USER = "NORMAL_USER",
}

export enum UserCommitmentStatus {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  commitment: UserCommitmentStatus;
  password: string;
}

export interface LoginRequest {
  email: string;
  role: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  res: {
    id: string;
    email: string;
    accessToken?: string;
    role?: UserRoles;
    name?: string;
  };
}

export interface LoginResponse {
  status: number;
  message: string;
  res: {
    id: string;
    email: string;
    role: UserRoles;
    name: string;
    accessToken: string;
  };
}

export interface RefreshResponse {
  status: number;
  message: string;
  res: {
    userData: {
      id: string;
      email: string;
      role: UserRoles;
      token_version: number;
    };
    accessToken: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  // Note: refreshToken is managed by backend as httpOnly cookie named "jwtToken"
  // Frontend never stores or accesses it directly
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
  commitment: UserCommitmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean; // Track when Zustand persist has completed
}
