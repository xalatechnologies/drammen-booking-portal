import { create } from 'zustand';

interface Zone {
  id: string; // Using string for client-side UUIDs
  name: string;
  type: 'court' | 'room' | 'area' | 'section' | 'field';
  capacity: number;
  description: string;
  isMainZone: boolean;
  bookableIndependently: boolean;
  areaSqm: number;
  floor: string;
  equipment: string[];
  status: 'active' | 'maintenance' | 'inactive';
  priceMultiplier: number;
  minBookingDuration: number;
  maxBookingDuration: number;
}

export type FacilityZoneState = {
  zones: Zone[];
  isDirty: boolean;
  actions: {
    initialize: (initialZones: Zone[]) => void;
    addZone: (newZone: Omit<Zone, 'id'>) => void;
    updateZone: (zoneId: string, updatedZone: Partial<Omit<Zone, 'id'>>) => void;
    removeZone: (zoneId: string) => void;
    reset: () => void;
    setZones: (zones: Zone[]) => void;
  };
};

const initialState = {
  zones: [],
  isDirty: false,
};

export const useFacilityZoneStore = create<FacilityZoneState>((set) => ({
  ...initialState,
  actions: {
    initialize: (initialZones) => set({ zones: initialZones, isDirty: false }),
    
    addZone: (newZone) =>
      set((state) => ({
        zones: [...state.zones, { ...newZone, id: crypto.randomUUID() }],
        isDirty: true,
      })),

    updateZone: (zoneId, updatedZone) =>
      set((state) => ({
        zones: state.zones.map((zone) =>
          zone.id === zoneId ? { ...zone, ...updatedZone } : zone
        ),
        isDirty: true,
      })),

    removeZone: (zoneId) =>
      set((state) => ({
        zones: state.zones.filter((zone) => zone.id !== zoneId),
        isDirty: true,
      })),
      
    setZones: (zones) => set({ zones, isDirty: true }),

    reset: () => set(initialState),
  }
})); 