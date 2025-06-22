import { create } from 'zustand';
import { FacilityBlackoutService } from '@/services/FacilityBlackoutService';
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
      const response = await FacilityBlackoutService.getBlackoutsByFacility(facilityId);
      if (response.data) {
        // Convert repository data to FacilityBlackoutPeriod format
        const periods: FacilityBlackoutPeriod[] = response.data.map(period => ({
          id: period.id || '',
          facility_id: typeof period.facility_id === 'string' ? parseInt(period.facility_id) : period.facility_id,
          type: period.type,
          reason: period.reason,
          start_date: typeof period.start_date === 'string' ? new Date(period.start_date) : period.start_date,
          end_date: typeof period.end_date === 'string' ? new Date(period.end_date) : period.end_date,
          created_by: period.created_by,
          created_at: typeof period.created_at === 'string' ? new Date(period.created_at) : period.created_at
        }));
        set({ blackoutPeriods: periods, isLoading: false });
      } else {
        set({ error: response.error || 'Failed to fetch blackout periods', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  saveBlackoutPeriods: async (facilityId) => {
    set({ isLoading: true, error: null });
    try {
      const periods = get().blackoutPeriods;
      
      // Save each period individually
      const savePromises = periods.map(async (period) => {
        if (period.id) {
          // Update existing period
          return await FacilityBlackoutService.updateBlackout(period.id, {
            facility_id: facilityId,
            type: period.type,
            reason: period.reason,
            start_date: period.start_date,
            end_date: period.end_date
          });
        } else {
          // Create new period
          return await FacilityBlackoutService.createBlackout({
            facility_id: facilityId,
            type: period.type,
            reason: period.reason,
            start_date: period.start_date,
            end_date: period.end_date,
            created_by: 'system' // TODO: Get from auth context
          });
        }
      });

      const results = await Promise.all(savePromises);
      const allSuccessful = results.every(result => result.data !== null);
      
      set({ isLoading: false });
      return allSuccessful;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  createBlackoutPeriod: async (periodData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await FacilityBlackoutService.createBlackout({
        facility_id: periodData.facility_id!,
        type: periodData.type!,
        reason: periodData.reason!,
        start_date: periodData.start_date!,
        end_date: periodData.end_date!,
        created_by: 'system' // TODO: Get from auth context
      });
      
      if (response.data) {
        const period: FacilityBlackoutPeriod = {
          id: response.data.id || '',
          facility_id: typeof response.data.facility_id === 'string' ? parseInt(response.data.facility_id) : response.data.facility_id,
          type: response.data.type,
          reason: response.data.reason,
          start_date: typeof response.data.start_date === 'string' ? new Date(response.data.start_date) : response.data.start_date,
          end_date: typeof response.data.end_date === 'string' ? new Date(response.data.end_date) : response.data.end_date,
          created_by: response.data.created_by,
          created_at: typeof response.data.created_at === 'string' ? new Date(response.data.created_at) : response.data.created_at
        };
        
        get().addBlackoutPeriod(period);
        set({ isLoading: false });
        return period;
      } else {
        set({ error: response.error || 'Failed to create blackout period', isLoading: false });
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
      const response = await FacilityBlackoutService.updateBlackout(id, periodData);
      if (response.data) {
        const period: FacilityBlackoutPeriod = {
          id: response.data.id || '',
          facility_id: typeof response.data.facility_id === 'string' ? parseInt(response.data.facility_id) : response.data.facility_id,
          type: response.data.type,
          reason: response.data.reason,
          start_date: typeof response.data.start_date === 'string' ? new Date(response.data.start_date) : response.data.start_date,
          end_date: typeof response.data.end_date === 'string' ? new Date(response.data.end_date) : response.data.end_date,
          created_by: response.data.created_by,
          created_at: typeof response.data.created_at === 'string' ? new Date(response.data.created_at) : response.data.created_at
        };
        
        const periods = get().blackoutPeriods;
        const index = periods.findIndex(p => p.id === id);
        if (index !== -1) {
          get().updateBlackoutPeriod(index, period);
        }
        set({ isLoading: false });
        return period;
      } else {
        set({ error: response.error || 'Failed to update blackout period', isLoading: false });
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
      const response = await FacilityBlackoutService.deleteBlackout(id);
      if (response.data) {
        const periods = get().blackoutPeriods;
        const index = periods.findIndex(p => p.id === id);
        if (index !== -1) {
          get().removeBlackoutPeriod(index);
        }
        set({ isLoading: false });
        return true;
      } else {
        set({ error: response.error || 'Failed to delete blackout period', isLoading: false });
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
