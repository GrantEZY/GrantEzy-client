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
  data: {
    users: AdminUser[];
    pagination: PaginationMeta;
  };
}
