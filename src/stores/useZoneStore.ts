
import { create } from 'zustand';
import { Zone } from '@/types/facility';
import { ZoneService } from '@/services/ZoneService';

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
        // Convert the response data to facility zones format
        const facilityZones: Zone[] = response.data.map(zone => ({
          id: zone.id,
          facility_id: facilityId,
          name: zone.name,
          type: 'room' as const,
          description: zone.description || '',
          capacity: zone.capacity,
          area_sqm: 100, // Default value
          is_main_zone: false,
          bookable_independently: true,
          parent_zone_id: null,
          equipment: zone.equipment || [],
          accessibility_features: zone.accessibility_features || [],
          status: zone.status === 'active' ? 'active' as const : 'inactive' as const,
          coordinates_x: zone.coordinates_x || 0,
          coordinates_y: zone.coordinates_y || 0,
          coordinates_width: zone.coordinates_width || 100,
          coordinates_height: zone.coordinates_height || 100,
          floor: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        set({ zones: facilityZones, isLoading: false });
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
      const response = await ZoneService.createZone(zoneData as any);
      if (response.success && response.data) {
        // Convert back to facility zone
        const facilityZone: Zone = {
          id: response.data.id,
          facility_id: zoneData.facility_id!,
          name: response.data.name,
          type: 'room' as const,
          description: response.data.description,
          capacity: response.data.capacity,
          area_sqm: 100,
          is_main_zone: response.data.is_main_zone || false,
          bookable_independently: true,
          parent_zone_id: response.data.parent_zone_id || null,
          equipment: response.data.equipment || [],
          accessibility_features: response.data.accessibility_features || [],
          status: response.data.status === 'active' ? 'active' as const : 'inactive' as const,
          coordinates_x: response.data.coordinates_x || 0,
          coordinates_y: response.data.coordinates_y || 0,
          coordinates_width: response.data.coordinates_width || 100,
          coordinates_height: response.data.coordinates_height || 100,
          floor: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        get().addZone(facilityZone);
        set({ isLoading: false });
        return facilityZone;
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
      const response = await ZoneService.updateZone(id, zoneData as any);
      if (response.success && response.data) {
        // Convert back to facility zone format
        const facilityZoneUpdates: Partial<Zone> = {
          name: response.data.name,
          description: response.data.description,
          capacity: response.data.capacity,
          area_sqm: 100,
          is_main_zone: response.data.is_main_zone || false,
          parent_zone_id: response.data.parent_zone_id || null,
          equipment: response.data.equipment || [],
          accessibility_features: response.data.accessibility_features || [],
          status: response.data.status === 'active' ? 'active' as const : 'inactive' as const,
          coordinates_x: response.data.coordinates_x || 0,
          coordinates_y: response.data.coordinates_y || 0,
          coordinates_width: response.data.coordinates_width || 100,
          coordinates_height: response.data.coordinates_height || 100,
          updated_at: new Date().toISOString()
        };
        
        get().updateZone(id, facilityZoneUpdates);
        set({ isLoading: false });
        return { ...get().zones.find(z => z.id === id)!, ...facilityZoneUpdates };
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
