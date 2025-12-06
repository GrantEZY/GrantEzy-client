/**
 * Admin service for handling admin-related API calls
 */
import { API_CONFIG } from '../lib/config/api.config';
import { httpClient } from '../lib/http/http-client';
import {
  AddOrganizationRequest,
  AddOrganizationResponse,
  AddUserRequest,
  AdminOperationResponse,
  DeleteOrganizationRequest,
  DeleteOrganizationResponse,
  DeleteUserRequest,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetOrganizationsResponse,
  GetUserProfileRequest,
  GetUserProfileResponse,
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
  UpdateUserRoleRequest,
} from '../types/admin.types';

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

    return httpClient.get<GetAllUsersResponse>(API_CONFIG.ENDPOINTS.ADMIN.GET_USERS, queryParams);
  }

  async addUser(data: AddUserRequest): Promise<AdminOperationResponse> {
    return httpClient.post<AdminOperationResponse>(API_CONFIG.ENDPOINTS.ADMIN.ADD_USER, data);
  }

  async updateUserRole(data: UpdateUserRoleRequest): Promise<AdminOperationResponse> {
    return httpClient.patch<AdminOperationResponse>(API_CONFIG.ENDPOINTS.ADMIN.UPDATE_ROLE, data);
  }

  async deleteUser(data: DeleteUserRequest): Promise<AdminOperationResponse> {
    return httpClient.delete<AdminOperationResponse>(API_CONFIG.ENDPOINTS.ADMIN.DELETE_USER, data);
  }

  async getUserProfile(params: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    return httpClient.get<GetUserProfileResponse>(API_CONFIG.ENDPOINTS.ADMIN.GET_USER_PROFILE, {
      userSlug: params.userSlug,
    });
  }

  async addOrganization(data: AddOrganizationRequest): Promise<AddOrganizationResponse> {
    return httpClient.post<AddOrganizationResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.ADD_ORGANIZATION,
      data
    );
  }

  async getOrganizations(): Promise<GetOrganizationsResponse> {
    return httpClient.get<GetOrganizationsResponse>(API_CONFIG.ENDPOINTS.ADMIN.GET_ORGANIZATIONS);
  }

  async updateOrganization(data: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
    return httpClient.patch<UpdateOrganizationResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.UPDATE_ORGANIZATION,
      data
    );
  }

  async deleteOrganization(data: DeleteOrganizationRequest): Promise<DeleteOrganizationResponse> {
    return httpClient.delete<DeleteOrganizationResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.DELETE_ORGANIZATION,
      data
    );
  }
}

export const adminService = new AdminService();
