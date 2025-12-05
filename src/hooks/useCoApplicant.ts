/**
 * Custom hooks for co-applicant functionality
 */

import { useCoApplicantStore } from '../store/co-applicant.store';
import { InviteStatus } from '../types/co-applicant.types';

export const useCoApplicant = () => {
  const store = useCoApplicantStore();
  const {
    applicationDetails,
    tokenDetails,
    linkedProjects,
    isLoading,
    error,
    getApplicationDetails,
    getTokenDetails,
    updateInviteStatus,
    getUserLinkedProjects,
    clearError,
    clearState,
  } = store;

  const handleGetApplicationDetails = async (applicationId: string) => {
    try {
      await getApplicationDetails(applicationId);
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch application details';
      return { success: false, error: message };
    }
  };

  const handleGetTokenDetails = async (token: string, slug: string) => {
    try {
      await getTokenDetails(token, slug);
      const currentTokenDetails = useCoApplicantStore.getState().tokenDetails;
      return { success: true, data: currentTokenDetails };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch token details';
      return { success: false, error: message };
    }
  };

  const handleAcceptInvite = async (token: string, slug: string) => {
    try {
      await updateInviteStatus(token, slug, InviteStatus.ACCEPTED);
      return { success: true, message: 'Invite accepted successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to accept invite';
      return { success: false, error: message };
    }
  };

  const handleRejectInvite = async (token: string, slug: string) => {
    try {
      await updateInviteStatus(token, slug, InviteStatus.REJECTED);
      return { success: true, message: 'Invite rejected successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reject invite';
      return { success: false, error: message };
    }
  };

  const handleUpdateInviteStatus = async (
    token: string,
    slug: string,
    status: InviteStatus.ACCEPTED | InviteStatus.REJECTED
  ) => {
    try {
      await updateInviteStatus(token, slug, status);
      const statusText = status === InviteStatus.ACCEPTED ? 'accepted' : 'rejected';
      return { success: true, message: `Invite ${statusText} successfully` };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update invite status';
      return { success: false, error: message };
    }
  };

  return {
    // State
    applicationDetails,
    tokenDetails,
    linkedProjects,
    isLoading,
    error,

    // Actions
    getApplicationDetails: handleGetApplicationDetails,
    getTokenDetails: handleGetTokenDetails,
    acceptInvite: handleAcceptInvite,
    rejectInvite: handleRejectInvite,
    updateInviteStatus: handleUpdateInviteStatus,
    getUserLinkedProjects,
    clearError,
    clearState,
  };
};

/**
 * Hook for token verification page
 */
export const useCoApplicantInvite = (token?: string, slug?: string) => {
  const { getTokenDetails, acceptInvite, rejectInvite, ...rest } = useCoApplicant();

  const verifyToken = async () => {
    if (!token || !slug) {
      return { success: false, error: 'Token and slug are required' };
    }
    return getTokenDetails(token, slug);
  };

  const accept = async () => {
    if (!token || !slug) {
      return { success: false, error: 'Token and slug are required' };
    }
    return acceptInvite(token, slug);
  };

  const reject = async () => {
    if (!token || !slug) {
      return { success: false, error: 'Token and slug are required' };
    }
    return rejectInvite(token, slug);
  };

  return {
    ...rest,
    verifyToken,
    accept,
    reject,
  };
};

/**
 * Hook for application details view
 */
export const useCoApplicantApplication = (applicationId?: string) => {
  const { getApplicationDetails, ...rest } = useCoApplicant();

  const fetchApplication = async () => {
    if (!applicationId) {
      return { success: false, error: 'Application ID is required' };
    }
    return getApplicationDetails(applicationId);
  };

  return {
    ...rest,
    fetchApplication,
  };
};
