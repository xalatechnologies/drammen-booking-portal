
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Zone } from '@/types/zone';
import { PaginationParams } from '@/types/api';
import { ZoneService } from '@/services/zoneService';

interface ZoneState {
  // Zones data
  zones: Zone[];
  currentZone: Zone | null;
  totalCount: number;
  pagination: PaginationParams;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setZones: (zones: Zone[], total: number) => void;
  setCurrentZone: (zone: Zone | null) => void;
  addZone: (zone: Zone) => void;
  updateZone: (zoneId: string, updates: Partial<Zone>) => void;
  removeZone: (zoneId: string) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchZones: (facilityId?: string) => Promise<void>;
  fetchZoneById: (id: string) => Promise<void>;
  createZone: (zoneData: Partial<Zone>) => Promise<void>;
  updateZoneAsync: (id: string, zoneData: Partial<Zone>) => Promise<void>;
  deleteZone: (id: string) => Promise<void>;
  
  reset: () => void;
}

export const useZoneStore = create<ZoneState>()(
  persist(
    (set, get) => ({
      // Initial state
      zones: [],
      currentZone: null,
      totalCount: 0,
      pagination: { page: 1, limit: 20 },
      isLoading: false,
      error: null,

      // Actions
      setZones: (zones, total) => {
        set({ zones, totalCount: total, isLoading: false, error: null });
      },

      setCurrentZone: (zone) => {
        set({ currentZone: zone });
      },

      addZone: (zone) => {
        set(state => ({
          zones: [...state.zones, zone],
          totalCount: state.totalCount + 1
        }));
      },

      updateZone: (zoneId, updates) => {
        set(state => ({
          zones: state.zones.map(zone =>
            zone.id === zoneId ? { ...zone, ...updates } : zone
          ),
          currentZone: state.currentZone?.id === zoneId
            ? { ...state.currentZone, ...updates }
            : state.currentZone
        }));
      },

      removeZone: (zoneId) => {
        set(state => ({
          zones: state.zones.filter(zone => zone.id !== zoneId),
          totalCount: state.totalCount - 1,
          currentZone: state.currentZone?.id === zoneId ? null : state.currentZone
        }));
      },

      setPagination: (newPagination) => {
        set(state => ({
          pagination: { ...state.pagination, ...newPagination }
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Async actions
      fetchZones: async (facilityId) => {
        const { setLoading, setError, setZones } = get();
        setLoading(true);
        setError(null);

        try {
          let result;
          if (facilityId) {
            result = await ZoneService.getZonesByFacility(parseInt(facilityId));
          } else {
            result = await ZoneService.getZones();
          }
          
          if (result.success && result.data) {
            setZones(result.data, result.data.length);
          } else {
            setError(result.error?.message || 'Failed to fetch zones');
          }
        } catch (error) {
          setError('Failed to fetch zones');
        } finally {
          setLoading(false);
        }
      },

      fetchZoneById: async (id) => {
        const { setLoading, setError, setCurrentZone } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await ZoneService.getZoneById(id);
          if (result.success && result.data) {
            setCurrentZone(result.data);
          } else {
            setError(result.error?.message || 'Failed to fetch zone');
          }
        } catch (error) {
          setError('Failed to fetch zone');
        } finally {
          setLoading(false);
        }
      },

      createZone: async (zoneData) => {
        const { setLoading, setError, addZone } = get();
        setLoading(true);
        setError(null);

        try {
          const completeZoneData = {
            name: zoneData.name || '',
            facilityId: zoneData.facilityId || '',
            isMainZone: zoneData.isMainZone || false,
            capacity: zoneData.capacity || 1,
            area: zoneData.area || 0,
            features: zoneData.features || [],
            accessibility: zoneData.accessibility || [],
            pricing: zoneData.pricing || {
              basePrice: 0,
              currency: 'NOK',
              priceRules: [],
              minimumBookingDuration: 60,
              maximumBookingDuration: 480,
              cancellationPolicy: {
                freeUntilHours: 24,
                partialRefundUntilHours: 12,
                partialRefundPercentage: 50,
                noRefundAfterHours: 2
              }
            },
            availability: zoneData.availability || {
              openingHours: [],
              blackoutPeriods: [],
              maintenanceSchedule: [],
              recurringUnavailability: []
            },
            restrictions: zoneData.restrictions || {
              requiresSupervision: false,
              allowedActivities: [],
              prohibitedActivities: [],
              requiresTraining: false,
              alcoholPermitted: false,
              smokingPermitted: false,
              petsAllowed: false,
              cateringAllowed: true,
              decorationsAllowed: true,
              amplifiedSoundAllowed: false,
              commercialUseAllowed: false
            },
            isActive: zoneData.isActive !== undefined ? zoneData.isActive : true,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...zoneData
          };

          const result = await ZoneService.createZone(completeZoneData);
          if (result.success && result.data) {
            addZone(result.data);
          } else {
            setError(result.error?.message || 'Failed to create zone');
          }
        } catch (error) {
          setError('Failed to create zone');
        } finally {
          setLoading(false);
        }
      },

      updateZoneAsync: async (id, zoneData) => {
        const { setLoading, setError, updateZone } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await ZoneService.updateZone(id, zoneData);
          if (result.success && result.data) {
            updateZone(id, result.data);
          } else {
            setError(result.error?.message || 'Failed to update zone');
          }
        } catch (error) {
          setError('Failed to update zone');
        } finally {
          setLoading(false);
        }
      },

      deleteZone: async (id) => {
        const { setLoading, setError, removeZone } = get();
        setLoading(true);
        setError(null);

        try {
          const result = await ZoneService.deleteZone(id);
          if (result.success) {
            removeZone(id);
          } else {
            setError(result.error?.message || 'Failed to delete zone');
          }
        } catch (error) {
          setError('Failed to delete zone');
        } finally {
          setLoading(false);
        }
      },

      reset: () => {
        set({
          zones: [],
          currentZone: null,
          totalCount: 0,
          pagination: { page: 1, limit: 20 },
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'zone-storage',
      partialize: (state) => ({
        pagination: state.pagination
      }),
    }
  )
);
