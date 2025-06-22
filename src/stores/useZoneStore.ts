
import { create } from 'zustand';
import { Zone } from '@/types/facility';
import { zoneService } from '@/services/zoneService';

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
      const response = await zoneService.getZonesByFacility(facilityId);
      if (response.success && response.data) {
        // Convert booking zones to facility zones
        const facilityZones: Zone[] = response.data.map(bookingZone => ({
          id: bookingZone.id,
          facility_id: parseInt(bookingZone.facilityId),
          name: bookingZone.name,
          type: 'room' as const,
          description: bookingZone.description,
          capacity: bookingZone.capacity,
          area_sqm: parseInt(bookingZone.area.replace(' m²', '')) || 100,
          is_main_zone: bookingZone.isMainZone,
          bookable_independently: true,
          parent_zone_id: bookingZone.parentZoneId,
          equipment: bookingZone.equipment,
          accessibility_features: bookingZone.amenities,
          status: bookingZone.isActive ? 'active' as const : 'inactive' as const,
          coordinates_x: bookingZone.layout.coordinates.x,
          coordinates_y: bookingZone.layout.coordinates.y,
          coordinates_width: bookingZone.layout.coordinates.width,
          coordinates_height: bookingZone.layout.coordinates.height,
          floor: '1',
          createdAt: new Date(),
          updatedAt: new Date()
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
      // Convert facility zone to booking zone format for the service
      const bookingZoneData = {
        name: zoneData.name || '',
        facilityId: zoneData.facility_id?.toString() || '',
        capacity: zoneData.capacity || 1,
        description: zoneData.description || '',
        area: `${zoneData.area_sqm || 100} m²`,
        isMainZone: zoneData.is_main_zone || false,
        parentZoneId: zoneData.parent_zone_id,
        equipment: zoneData.equipment || [],
        amenities: zoneData.accessibility_features || [],
        layout: {
          coordinates: {
            x: zoneData.coordinates_x || 0,
            y: zoneData.coordinates_y || 0,
            width: zoneData.coordinates_width || 100,
            height: zoneData.coordinates_height || 100
          },
          entryPoints: ['Hovedinngang']
        },
        isActive: zoneData.status === 'active',
        pricePerHour: 250,
        subZones: [],
        bookingRules: {
          minBookingDuration: 1,
          maxBookingDuration: 8,
          allowedTimeSlots: [],
          bookingTypes: ['one-time', 'recurring'] as const,
          advanceBookingDays: 30,
          cancellationHours: 24
        },
        adminInfo: {
          contactPersonName: 'Zone Manager',
          contactPersonEmail: 'zone@drammen.kommune.no',
          specialInstructions: zoneData.description || '',
          maintenanceSchedule: []
        },
        accessibility: zoneData.accessibility_features || [],
        features: zoneData.equipment || []
      };

      const response = await zoneService.createZone(bookingZoneData);
      if (response.success && response.data) {
        // Convert back to facility zone
        const facilityZone: Zone = {
          id: response.data.id,
          facility_id: parseInt(response.data.facilityId),
          name: response.data.name,
          type: 'room' as const,
          description: response.data.description,
          capacity: response.data.capacity,
          area_sqm: parseInt(response.data.area.replace(' m²', '')) || 100,
          is_main_zone: response.data.isMainZone,
          bookable_independently: true,
          parent_zone_id: response.data.parentZoneId,
          equipment: response.data.equipment,
          accessibility_features: response.data.amenities,
          status: response.data.isActive ? 'active' as const : 'inactive' as const,
          coordinates_x: response.data.layout.coordinates.x,
          coordinates_y: response.data.layout.coordinates.y,
          coordinates_width: response.data.layout.coordinates.width,
          coordinates_height: response.data.layout.coordinates.height,
          floor: '1',
          createdAt: new Date(),
          updatedAt: new Date()
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
      // Convert facility zone updates to booking zone format
      const bookingZoneData: any = {};
      if (zoneData.name) bookingZoneData.name = zoneData.name;
      if (zoneData.description) bookingZoneData.description = zoneData.description;
      if (zoneData.capacity) bookingZoneData.capacity = zoneData.capacity;
      if (zoneData.area_sqm) bookingZoneData.area = `${zoneData.area_sqm} m²`;
      if (zoneData.is_main_zone !== undefined) bookingZoneData.isMainZone = zoneData.is_main_zone;
      if (zoneData.parent_zone_id) bookingZoneData.parentZoneId = zoneData.parent_zone_id;
      if (zoneData.equipment) bookingZoneData.equipment = zoneData.equipment;
      if (zoneData.accessibility_features) bookingZoneData.amenities = zoneData.accessibility_features;
      if (zoneData.status !== undefined) bookingZoneData.isActive = zoneData.status === 'active';
      
      if (zoneData.coordinates_x !== undefined || zoneData.coordinates_y !== undefined || 
          zoneData.coordinates_width !== undefined || zoneData.coordinates_height !== undefined) {
        bookingZoneData.layout = {
          coordinates: {
            x: zoneData.coordinates_x || 0,
            y: zoneData.coordinates_y || 0,
            width: zoneData.coordinates_width || 100,
            height: zoneData.coordinates_height || 100
          },
          entryPoints: ['Hovedinngang']
        };
      }

      const response = await zoneService.updateZone(id, bookingZoneData);
      if (response.success && response.data) {
        // Convert back to facility zone format
        const facilityZoneUpdates: Partial<Zone> = {
          name: response.data.name,
          description: response.data.description,
          capacity: response.data.capacity,
          area_sqm: parseInt(response.data.area.replace(' m²', '')) || 100,
          is_main_zone: response.data.isMainZone,
          parent_zone_id: response.data.parentZoneId,
          equipment: response.data.equipment,
          accessibility_features: response.data.amenities,
          status: response.data.isActive ? 'active' as const : 'inactive' as const,
          coordinates_x: response.data.layout.coordinates.x,
          coordinates_y: response.data.layout.coordinates.y,
          coordinates_width: response.data.layout.coordinates.width,
          coordinates_height: response.data.layout.coordinates.height,
          updatedAt: new Date()
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
      const response = await zoneService.deleteZone(id);
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
