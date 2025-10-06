/**
 * PM (Program Manager) service for handling PM-related API calls
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
import {
  CreateCycleRequest,
  CreateCycleResponse,
  DeleteCycleRequest,
  DeleteCycleResponse,
  GetProgramCyclesRequest,
  GetProgramCyclesResponse,
  UpdateCycleRequest,
  UpdateCycleResponse,
} from "../types/pm.types";

export class PMService {
  // ============= Cycle Management =============

  /**
   * Create a new cycle for a program
   */
  async createCycle(data: CreateCycleRequest): Promise<CreateCycleResponse> {
    return httpClient.post<CreateCycleResponse>(
      API_CONFIG.ENDPOINTS.PM.CREATE_CYCLE,
      data,
    );
  }

  /**
   * Get all cycles for a specific program with pagination
   */
  async getProgramCycles(
    params: GetProgramCyclesRequest,
  ): Promise<GetProgramCyclesResponse> {
    const queryParams: Record<string, string> = {
      programId: params.programId,
      page: params.page.toString(),
      numberOfResults: params.numberOfResults.toString(),
    };

    return httpClient.get<GetProgramCyclesResponse>(
      API_CONFIG.ENDPOINTS.PM.GET_PROGRAM_CYCLES,
      queryParams,
    );
  }

  /**
   * Update cycle details
   */
  async updateCycle(data: UpdateCycleRequest): Promise<UpdateCycleResponse> {
    return httpClient.patch<UpdateCycleResponse>(
      API_CONFIG.ENDPOINTS.PM.UPDATE_CYCLE_DETAILS,
      data,
    );
  }

  /**
   * Delete a program cycle
   */
  async deleteCycle(data: DeleteCycleRequest): Promise<DeleteCycleResponse> {
    return httpClient.delete<DeleteCycleResponse>(
      API_CONFIG.ENDPOINTS.PM.DELETE_CYCLE,
      data,
    );
  }
}

// Export singleton instance
export const pmService = new PMService();
