/**
 * Admin service for handling admin-related API calls
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
import { GetAllUsersRequest, GetAllUsersResponse } from "../types/admin.types";

export class AdminService {
  async getAllUsers(params: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    const queryParams: Record<string, string> = {
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    if (params.filter) {
      if (params.filter.role) {
        queryParams.role = params.filter.role;
      }
      if (params.filter.otherFilters) {
        // Convert other filters to query params
        Object.entries(params.filter.otherFilters).forEach(([key, value]) => {
          queryParams[key] = String(value);
        });
      }
    }

    return httpClient.get<GetAllUsersResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.GET_USERS,
      queryParams,
    );
  }
}

export const adminService = new AdminService();
