/**
 * Common API response types
 */

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  status: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
