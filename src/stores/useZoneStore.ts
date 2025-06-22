import { create } from 'zustand';
import { Zone } from '@/types/facility';
import { ZoneService } from '@/services/zoneService';

interface ZoneState {
  zones: Zone[];
  currentZone: Zone | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setZones: (zones: Zone[]) => void;
  setCurrentZone: (zone: Zone | null) => void;
  addZone: (zone: Zone) => void;
  updateZone: (id: string, updates: Partial<Zone>) => void;
  removeZone: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchZonesByFacility: (facilityId: number) => Promise<void>;
  createZone: (zoneData: Partial<Zone>) => Promise<Zone | null>;
  updateZoneAsync: (id: string, zoneData: Partial<Zone>) => Promise<Zone | null>;
  deleteZone: (id: string) => Promise<boolean>;
  reset: () => void;
}

export const useZoneStore = create<ZoneState>((set, get) => ({
  zones: [],
  currentZone: null,
  isLoading: false,
  error: null,

  setZones: (zones) => set({ zones }),
  setCurrentZone: (zone) => set({ currentZone: zone }),
  addZone: (zone) => set(state => ({ zones: [...state.zones, zone] })),
  updateZone: (id, updates) => set(state => ({
    zones: state.zones.map(zone => 
      zone.id === id ? { ...zone, ...updates } : zone
    ),
    currentZone: state.currentZone?.id === id 
      ? { ...state.currentZone, ...updates }
      : state.currentZone
  })),
  removeZone: (id) => set(state => ({
    zones: state.zones.filter(zone => zone.id !== id),
    currentZone: state.currentZone?.id === id ? null : state.currentZone
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchZonesByFacility: async (facilityId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ZoneService.getZonesByFacilityId(facilityId);
      if (response.success && response.data) {
        set({ zones: response.data, isLoading: false });
      } else {
        set({ error: response.error?.message || 'Failed to fetch zones', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createZone: async (zoneData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ZoneService.createZone(zoneData);
      if (response.success && response.data) {
        get().addZone(response.data);
        set({ isLoading: false });
        return response.data;
      } else {
        set({ error: response.error?.message || 'Failed to create zone', isLoading: false });
        return null;
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateZoneAsync: async (id, zoneData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ZoneService.updateZone(id, zoneData);
      if (response.success && response.data) {
        get().updateZone(id, response.data);
        set({ isLoading: false });
        return response.data;
      } else {
        set({ error: response.error?.message || 'Failed to update zone', isLoading: false });
        return null;
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  deleteZone: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ZoneService.deleteZone(id);
      if (response.success) {
        get().removeZone(id);
        set({ isLoading: false });
        return true;
      } else {
        set({ error: response.error?.message || 'Failed to delete zone', isLoading: false });
        return false;
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  reset: () => set({
    zones: [],
    currentZone: null,
    isLoading: false,
    error: null
  })
}));
