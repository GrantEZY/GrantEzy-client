/**
 * Public store for managing publicly available data
 */
import { create } from 'zustand';

import { ProgramCycle, publicService } from '@/services/public.service';

interface PublicState {
  activeCycles: ProgramCycle[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchActiveCycles: (filters?: {
    isActive?: boolean;
    programSlug?: string;
    page?: number;
    numberOfResults?: number;
  }) => Promise<void>;
  clearError: () => void;
}

export const usePublicStore = create<PublicState>((set, _get) => ({
  activeCycles: [],
  loading: false,
  error: null,

  fetchActiveCycles: async (filters) => {
    try {
      set({ loading: true, error: null });

      const response = await publicService.getActiveProgramCycles(filters);

      if (response.status === 200) {
        // Extract all cycles from all programs
        // Note: Currently the public API doesn't return cycles in programs, so this will be empty
        const allCycles = response.res.programs.flatMap((program) =>
          (program.cycles || []).map((cycle) => ({
            ...cycle,
            program: {
              id: program.id,
              name: program.details?.name || 'Unknown Program',
              description: program.details?.description || '',
            },
          }))
        );

        set({
          activeCycles: allCycles,
          loading: false,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch active cycles');
      }
    } catch (error: any) {
      console.error('Error fetching active cycles:', error);
      set({
        error: error?.message || 'Failed to fetch active cycles',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
