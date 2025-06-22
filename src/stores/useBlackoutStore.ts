
import { create } from 'zustand';
import { BlackoutService } from '@/services/BlackoutService';
import { FacilityBlackoutPeriod } from '@/types/facility';

interface BlackoutState {
  blackoutPeriods: FacilityBlackoutPeriod[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setBlackoutPeriods: (periods: FacilityBlackoutPeriod[]) => void;
  addBlackoutPeriod: (period: Partial<FacilityBlackoutPeriod>) => void;
  updateBlackoutPeriod: (index: number, updates: Partial<FacilityBlackoutPeriod>) => void;
  removeBlackoutPeriod: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchBlackoutPeriods: (facilityId: number) => Promise<void>;
  saveBlackoutPeriods: (facilityId: number) => Promise<boolean>;
  createBlackoutPeriod: (periodData: Partial<FacilityBlackoutPeriod>) => Promise<FacilityBlackoutPeriod | null>;
  updateBlackoutPeriodAsync: (id: string, periodData: Partial<FacilityBlackoutPeriod>) => Promise<FacilityBlackoutPeriod | null>;
  deleteBlackoutPeriod: (id: string) => Promise<boolean>;
  reset: () => void;
}

export const useBlackoutStore = create<BlackoutState>((set, get) => ({
  blackoutPeriods: [],
  isLoading: false,
  error: null,

  setBlackoutPeriods: (periods) => set({ blackoutPeriods: periods }),
  addBlackoutPeriod: (period) => set(state => ({ 
    blackoutPeriods: [...state.blackoutPeriods, period as FacilityBlackoutPeriod] 
  })),
  updateBlackoutPeriod: (index, updates) => set(state => ({
    blackoutPeriods: state.blackoutPeriods.map((period, i) => 
      i === index ? { ...period, ...updates } : period
    )
  })),
  removeBlackoutPeriod: (index) => set(state => ({
    blackoutPeriods: state.blackoutPeriods.filter((_, i) => i !== index)
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchBlackoutPeriods: async (facilityId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await BlackoutService.getBlackoutPeriods(facilityId.toString());
      if (response.success && response.data) {
        set({ blackoutPeriods: response.data, isLoading: false });
      } else {
        set({ error: response.error?.message || 'Failed to fetch blackout periods', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  saveBlackoutPeriods: async (facilityId) => {
    set({ isLoading: true, error: null });
    try {
      const periods = get().blackoutPeriods;
      const response = await BlackoutService.saveBlackoutPeriods(facilityId.toString(), periods);
      set({ isLoading: false });
      return response.success;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  createBlackoutPeriod: async (periodData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await BlackoutService.createBlackoutPeriod(periodData);
      if (response.success && response.data) {
        get().addBlackoutPeriod(response.data);
        set({ isLoading: false });
        return response.data;
      } else {
        set({ error: response.error?.message || 'Failed to create blackout period', isLoading: false });
        return null;
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateBlackoutPeriodAsync: async (id, periodData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await BlackoutService.updateBlackoutPeriod(id, periodData);
      if (response.success && response.data) {
        const periods = get().blackoutPeriods;
        const index = periods.findIndex(p => p.id === id);
        if (index !== -1) {
          get().updateBlackoutPeriod(index, response.data);
        }
        set({ isLoading: false });
        return response.data;
      } else {
        set({ error: response.error?.message || 'Failed to update blackout period', isLoading: false });
        return null;
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  deleteBlackoutPeriod: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await BlackoutService.deleteBlackoutPeriod(id);
      if (response.success) {
        const periods = get().blackoutPeriods;
        const index = periods.findIndex(p => p.id === id);
        if (index !== -1) {
          get().removeBlackoutPeriod(index);
        }
        set({ isLoading: false });
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to delete blackout period', isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  reset: () => set({
    blackoutPeriods: [],
    isLoading: false,
    error: null
  })
}));
