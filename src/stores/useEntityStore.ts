
import { createGenericEntityStore } from '@/stores/createGenericEntityStore';
import { Facility } from '@/types/facility';
import { Zone } from '@/types/zone';
import { OpeningHours } from '@/types/openingHours';
import { Blackout } from '@/types/blackout';

/**
 * Entity-specific stores using the generic entity store factory
 * Using actual database table structure - no complex relations for now to avoid errors
 */

// Facility store - simplified to avoid relation errors
export const useFacilityStore = createGenericEntityStore<Facility>('facilities', {
  idField: 'id',
  statusField: 'status',
  activeValue: 'active'
});

// Zone store
export const useZoneStore = createGenericEntityStore<Zone>('zones', {
  idField: 'id',
  statusField: 'status',
  activeValue: 'active'
});

// Opening Hours store
export const useOpeningHoursStore = createGenericEntityStore<OpeningHours>('facility_opening_hours', {
  idField: 'id'
});

// Blackout store
export const useBlackoutStore = createGenericEntityStore<Blackout>('facility_blackout_periods', {
  idField: 'id'
});
