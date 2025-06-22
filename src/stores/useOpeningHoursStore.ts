
import { create } from 'zustand';
import { OpeningHour, OpeningHoursService } from '@/services/OpeningHoursService';

interface OpeningHoursState {
  openingHours: OpeningHour[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOpeningHours: (hours: OpeningHour[]) => void;
  updateOpeningHour: (dayOfWeek: number, updates: Partial<OpeningHour>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchOpeningHours: (facilityId: number) => Promise<void>;
  saveOpeningHours: (facilityId: number) => Promise<boolean>;
  reset: () => void;
}

export const useOpeningHoursStore = create<OpeningHoursState>((set, get) => ({
  openingHours: [],
  isLoading: false,
  error: null,

  setOpeningHours: (hours) => set({ openingHours: hours }),
  updateOpeningHour: (dayOfWeek, updates) => set(state => ({
    openingHours: state.openingHours.map(hour => 
      hour.day_of_week === dayOfWeek ? { ...hour, ...updates } : hour
    )
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchOpeningHours: async (facilityId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await OpeningHoursService.getOpeningHours(facilityId);
      if (response.success && response.data) {
        set({ openingHours: response.data, isLoading: false });
      } else {
        set({ error: response.error?.message || 'Failed to fetch opening hours', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  saveOpeningHours: async (facilityId) => {
    const { openingHours } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await OpeningHoursService.saveOpeningHours(facilityId, openingHours);
      if (response.success) {
        set({ isLoading: false });
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to save opening hours', isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  reset: () => set({
    openingHours: [],
    isLoading: false,
    error: null
  })
}));
