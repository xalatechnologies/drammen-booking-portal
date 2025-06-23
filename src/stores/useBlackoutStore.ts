
import { create } from 'zustand';

interface BlackoutPeriod {
  id?: string;
  facility_id: number;
  type: string;
  reason: string;
  start_date: Date;
  end_date: Date;
}

interface BlackoutStore {
  blackouts: any[];
  blackoutPeriods: BlackoutPeriod[];
  isLoading: boolean;
  error: string | null;
  fetchBlackoutPeriods: (facilityId: number) => Promise<void>;
  saveBlackoutPeriods: (facilityId: number) => Promise<boolean>;
  addBlackoutPeriod: (period: BlackoutPeriod) => void;
  updateBlackoutPeriod: (index: number, updates: Partial<BlackoutPeriod>) => void;
  removeBlackoutPeriod: (index: number) => void;
  addBlackout: (blackout: any) => void;
  removeBlackout: (id: string) => void;
}

export const useBlackoutStore = create<BlackoutStore>((set, get) => ({
  blackouts: [],
  blackoutPeriods: [],
  isLoading: false,
  error: null,

  fetchBlackoutPeriods: async (facilityId: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      set({ blackoutPeriods: [], isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch blackout periods', isLoading: false });
    }
  },

  saveBlackoutPeriods: async (facilityId: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: 'Failed to save blackout periods', isLoading: false });
      return false;
    }
  },

  addBlackoutPeriod: (period) => {
    set((state) => ({
      blackoutPeriods: [...state.blackoutPeriods, period]
    }));
  },

  updateBlackoutPeriod: (index, updates) => {
    set((state) => ({
      blackoutPeriods: state.blackoutPeriods.map((period, i) =>
        i === index ? { ...period, ...updates } : period
      )
    }));
  },

  removeBlackoutPeriod: (index) => {
    set((state) => ({
      blackoutPeriods: state.blackoutPeriods.filter((_, i) => i !== index)
    }));
  },

  addBlackout: (blackout) => set((state) => ({ 
    blackouts: [...state.blackouts, blackout] 
  })),

  removeBlackout: (id) => set((state) => ({ 
    blackouts: state.blackouts.filter(b => b.id !== id) 
  })),
}));
