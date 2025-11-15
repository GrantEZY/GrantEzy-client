/**
 * User Profile Service
 * Handles user profile related API calls
 */

import { API_CONFIG } from "../lib/config/api.config";
import { httpClient } from "../lib/http/http-client";
import {
  GetUserProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../types/user.types";

export class UserService {
  /**
   * Get current user's profile
   * @returns Promise<GetUserProfileResponse>
   */
  async getUserProfile(): Promise<GetUserProfileResponse> {
    return httpClient.get<GetUserProfileResponse>(
      API_CONFIG.ENDPOINTS.USER.GET_PROFILE
    );
  }

  /**
   * Update user profile
   * @param data - Profile update data
   * @returns Promise<UpdateProfileResponse>
   */
  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    return httpClient.patch<UpdateProfileResponse>(
      API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
  }
}

// Export singleton instance
export const userService = new UserService();
