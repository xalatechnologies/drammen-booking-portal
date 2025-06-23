
import { createGenericEntityStore } from '@/stores/createGenericEntityStore';
import { Facility } from '@/types/facility';
import { Zone } from '@/types/zone';
import { OpeningHours } from '@/types/openingHours';
import { Blackout } from '@/types/blackout';

/**
 * Entity-specific stores using the generic entity store factory
 */

// Facility store with related data
export const useFacilityStore = createGenericEntityStore<Facility>('facilities', {
  related: [
    'facility_opening_hours',
    'zones',
    'facility_images',
    'facility_translations'
  ],
  idField: 'id',
  statusField: 'status',
  activeValue: 'active'
});

// Zone store
export const useZoneStore = createGenericEntityStore<Zone>('zones', {
  related: ['facility'],
  idField: 'id',
  statusField: 'status',
  activeValue: 'active'
});

// Opening Hours store
export const useOpeningHoursStore = createGenericEntityStore<OpeningHours>('facility_opening_hours', {
  related: ['facility'],
  idField: 'id'
});

// Blackout store
export const useBlackoutStore = createGenericEntityStore<Blackout>('facility_blackout_periods', {
  related: ['facility'],
  idField: 'id'
});
