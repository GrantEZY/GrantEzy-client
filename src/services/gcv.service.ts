/**
 * GCV (Grant Committee View) service for handling GCV-related API calls
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
import {
  AddGCVMemberRequest,
  AddGCVMemberResponse,
  AddProgramManagerRequest,
  AddProgramManagerResponse,
  CreateProgramRequest,
  CreateProgramResponse,
  DeleteProgramRequest,
  DeleteProgramResponse,
  GetAllGCVMembersRequest,
  GetAllGCVMembersResponse,
  GetAllProgramsRequest,
  GetAllProgramsResponse,
  UpdateGCVUserRoleRequest,
  UpdateGCVUserRoleResponse,
  UpdateProgramRequest,
  UpdateProgramResponse,
} from "../types/gcv.types";

export class GCVService {
  // ============= GCV Member Management =============

  /**
   * Get all GCV members with pagination and filtering
   */
  async getAllGCVMembers(
    params: GetAllGCVMembersRequest,
  ): Promise<GetAllGCVMembersResponse> {
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

    return httpClient.get<GetAllGCVMembersResponse>(
      API_CONFIG.ENDPOINTS.GCV.GET_MEMBERS,
      queryParams,
    );
  }

  /**
   * Add a new GCV member
   */
  async addGCVMember(data: AddGCVMemberRequest): Promise<AddGCVMemberResponse> {
    return httpClient.post<AddGCVMemberResponse>(
      API_CONFIG.ENDPOINTS.GCV.ADD_MEMBER,
      data,
    );
  }

  /**
   * Update GCV user role (add or delete COMMITTEE_MEMBER role)
   */
  async updateGCVUserRole(
    data: UpdateGCVUserRoleRequest,
  ): Promise<UpdateGCVUserRoleResponse> {
    return httpClient.patch<UpdateGCVUserRoleResponse>(
      API_CONFIG.ENDPOINTS.GCV.UPDATE_MEMBER_ROLE,
      data,
    );
  }

  // ============= Program Management =============

  /**
   * Create a new program
   */
  async createProgram(
    data: CreateProgramRequest,
  ): Promise<CreateProgramResponse> {
    return httpClient.post<CreateProgramResponse>(
      API_CONFIG.ENDPOINTS.GCV.CREATE_PROGRAM,
      data,
    );
  }

  /**
   * Get all programs with pagination and filtering
   */
  async getPrograms(
    params: GetAllProgramsRequest,
  ): Promise<GetAllProgramsResponse> {
    const queryParams: Record<string, string> = {
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    if (params.filter?.otherFilters) {
      // Convert other filters to query params
      Object.entries(params.filter.otherFilters).forEach(([key, value]) => {
        queryParams[key] = String(value);
      });
    }

    return httpClient.get<GetAllProgramsResponse>(
      API_CONFIG.ENDPOINTS.GCV.GET_PROGRAMS,
      queryParams,
    );
  }

  /**
   * Update an existing program
   */
  async updateProgram(
    data: UpdateProgramRequest,
  ): Promise<UpdateProgramResponse> {
    return httpClient.patch<UpdateProgramResponse>(
      API_CONFIG.ENDPOINTS.GCV.UPDATE_PROGRAM,
      data,
    );
  }

  /**
   * Delete a program
   */
  async deleteProgram(
    data: DeleteProgramRequest,
  ): Promise<DeleteProgramResponse> {
    return httpClient.delete<DeleteProgramResponse>(
      API_CONFIG.ENDPOINTS.GCV.DELETE_PROGRAM,
      data,
    );
  }

  /**
   * Add a program manager to a program
   * Note: This replaces the existing manager if one exists
   */
  async addProgramManager(
    data: AddProgramManagerRequest,
  ): Promise<AddProgramManagerResponse> {
    return httpClient.post<AddProgramManagerResponse>(
      API_CONFIG.ENDPOINTS.GCV.ADD_PROGRAM_MANAGER,
      data,
    );
  }
}

export const gcvService = new GCVService();
