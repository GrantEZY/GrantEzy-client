/**
 * User Profile Types
 * Types for user profile management
 */

/**
 * User Commitment Status Enum
 */
export enum UserCommitmentStatus {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
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
 * Person Entity (nested in User)
 */
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

/**
 * Contact Object (nested in User)
 */
export interface Contact {
  email: string;
  phone: string | null;
  address: string | null;
}

/**
 * User Profile Interface (matches backend User aggregate structure)
 */
export interface UserProfile {
  personId: string;
  person: Person;
  contact: Contact;
  commitment: UserCommitmentStatus;
  experiences: Experience[] | null;
  role: string[];
  status: string;
  isGCVmember: boolean;
  slug: string | null;
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
