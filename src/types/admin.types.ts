/**
 * Admin related types based on server DTOs
 */
import { UserRoles } from "./auth.types";

export interface UserFilterDto {
  role?: UserRoles;
  otherFilters?: Record<string, string | number | boolean>;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllUsersRequest {
  page: number;
  numberOfResults: number;
  filter?: UserFilterDto;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetAllUsersResponse {
  status: number;
  message: string;
  res: {
    users: any[]; // Backend user structure is complex, we'll map it in the store
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
