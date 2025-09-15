/**
 * Admin related types based on server DTOs
 */
import { UserRoles } from "./auth.types";

export interface UserFilterDto {
  role?: UserRoles;
  otherFilters?: Record<string, string | number | boolean>;
}

export interface AdminUser {
  id?: string; // For backward compatibility
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
  // Additional fields from backend
  firstName?: string; // For backward compatibility
  lastName?: string; // For backward compatibility  
  email: string; // Make email required - extracted from contact.email or fallback
}

export interface GetAllUsersRequest {
  page: number;
  numberOfResults: number;
  filter?: UserFilterDto;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetAllUsersResponse {
  status: number;
  message: string;
  res: {
    users: AdminUser[];
    totalNumberOfUsers: number;
  };
}

// Missing types for admin operations
export interface AddUserRequest {
  email: string;
  role: UserRoles;
}

export enum UpdateRole {
  ADD_ROLE = "ADD_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
}

export interface UpdateUserRoleRequest {
  email: string;
  type: UpdateRole;
  role: UserRoles;
}

export interface DeleteUserRequest {
  email: string;
}

export interface AdminOperationResponse {
  status: number;
  message: string;
  res: Record<string, unknown>;
}
