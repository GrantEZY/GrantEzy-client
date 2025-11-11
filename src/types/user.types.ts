/**
 * User Profile Types
 * Types for user profile management
 */

/**
 * User Commitment Status Enum
 */
export enum UserCommitmentStatus {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  FREELANCE = "FREELANCE",
}

/**
 * Experience Interface
 */
export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

/**
 * User Profile Interface
 */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  commitment?: UserCommitmentStatus;
  experiences?: Experience[];
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get User Profile Response
 */
export interface GetUserProfileResponse {
  status: number;
  message: string;
  res: {
    user: UserProfile;
  };
}

/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  commitment?: UserCommitmentStatus;
  experiences?: Experience[];
}

/**
 * Update Profile Response
 */
export interface UpdateProfileResponse {
  status: number;
  message: string;
  res: {
    user: UserProfile;
  };
}
