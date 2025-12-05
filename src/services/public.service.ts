/**
 * Public service for fetching publicly available data (no auth required)
 */
import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";

export interface ProgramCycle {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string; // CycleStatus enum: "OPEN", "CLOSED", "ARCHIVED"
  round?: {
    year: number;
    type: string;
  };
  duration?: {
    startDate: string;
    endDate: string;
  };
  budget?: {
    amount: number;
    currency: string;
  };
  program?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface ProgramDetails {
  name: string;
  description: string;
  category: string;
}

export interface GetActiveCyclesResponse {
  status: number;
  message: string;
  res: {
    programs: Array<{
      id: string;
      details?: ProgramDetails; // Backend structure uses details object
      slug: string;
      status: string;
      cycles: ProgramCycle[];
    }>;
  };
}

export interface GetCycleDetailsResponse {
  status: number;
  message: string;
  res: {
    program: any;
    cycle: ProgramCycle;
  };
}

export class PublicService {
  /**
   * Get all active program cycles (public endpoint)
   */
  async getActiveProgramCycles(filters?: {
    page?: number;
    numberOfResults?: number;
  }): Promise<GetActiveCyclesResponse> {
    const params = new URLSearchParams();

    // Required pagination parameters
    params.append("page", String(filters?.page ?? 1));
    params.append("numberOfResults", String(filters?.numberOfResults ?? 10));

    const url = `${API_CONFIG.ENDPOINTS.PUBLIC.GET_ACTIVE_CYCLES}?${params.toString()}`;
    return httpClient.get<GetActiveCyclesResponse>(url);
  }

  /**
   * Get details of a specific program cycle by slug
   */
  async getProgramCycleDetails(slug: string): Promise<GetCycleDetailsResponse> {
    const url = `${API_CONFIG.ENDPOINTS.PUBLIC.GET_CYCLE_DETAILS}?slug=${slug}`;
    return httpClient.get<GetCycleDetailsResponse>(url);
  }
}

export const publicService = new PublicService();
