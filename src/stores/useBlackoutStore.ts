
import { create } from 'zustand';
import { BlackoutPeriod, BlackoutService } from '@/services/BlackoutService';

interface BlackoutState {
  blackoutPeriods: BlackoutPeriod[];
  currentBlackout: BlackoutPeriod | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setBlackoutPeriods: (periods: BlackoutPeriod[]) => void;
  setCurrentBlackout: (blackout: BlackoutPeriod | null) => void;
  addBlackoutPeriod: (blackout: BlackoutPeriod) => void;
  updateBlackoutPeriod: (id: string, updates: Partial<BlackoutPeriod>) => void;
  removeBlackoutPeriod: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchBlackoutPeriods: (facilityId: number) => Promise<void>;
  createBlackoutPeriod: (blackoutData: Omit<BlackoutPeriod, 'id' | 'created_at'>) => Promise<BlackoutPeriod | null>;
  updateBlackoutPeriodAsync: (id: string, blackoutData: Partial<BlackoutPeriod>) => Promise<BlackoutPeriod | null>;
  deleteBlackoutPeriod: (id: string) => Promise<boolean>;
  reset: () => void;
}

export const useBlackoutStore = create<BlackoutState>((set, get) => ({
  blackoutPeriods: [],
  currentBlackout: null,
  isLoading: false,
  error: null,

  setBlackoutPeriods: (periods) => set({ blackoutPeriods: periods }),
  setCurrentBlackout: (blackout) => set({ currentBlackout: blackout }),
  addBlackoutPeriod: (blackout) => set(state => ({ 
    blackoutPeriods: [...state.blackoutPeriods, blackout] 
  })),
  updateBlackoutPeriod: (id, updates) => set(state => ({
    blackoutPeriods: state.blackoutPeriods.map(period => 
      period.id === id ? { ...period, ...updates } : period
    ),
    currentBlackout: state.currentBlackout?.id === id 
      ? { ...state.currentBlackout, ...updates }
      : state.currentBlackout
  })),
  removeBlackoutPeriod: (id) => set(state => ({
    blackoutPeriods: state.blackoutPeriods.filter(period => period.id !== id),
    currentBlackout: state.currentBlackout?.id === id ? null : state.currentBlackout
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchBlackoutPeriods: async (facilityId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await BlackoutService.getBlackoutPeriods(facilityId);
      if (response.success && response.data) {
        set({ blackoutPeriods: response.data, isLoading: false });
      } else {
        set({ error: response.error?.message || 'Failed to fetch blackout periods', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createBlackoutPeriod: async (blackoutData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await BlackoutService.createBlackoutPeriod(blackoutData);
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

  updateBlackoutPeriodAsync: async (id, blackoutData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await BlackoutService.updateBlackoutPeriod(id, blackoutData);
      if (response.success && response.data) {
        get().updateBlackoutPeriod(id, response.data);
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
        get().removeBlackoutPeriod(id);
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
    currentBlackout: null,
    isLoading: false,
    error: null
  })
}));
