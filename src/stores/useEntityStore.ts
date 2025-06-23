
import { createGenericEntityStore } from '@/stores/createGenericEntityStore';
import { Facility } from '@/types/facility';
import { Zone } from '@/types/zone';
import { OpeningHours } from '@/types/openingHours';
import { Blackout } from '@/types/blackout';

/**
 * Entity-specific stores using the generic entity store factory
 * 
 * This approach allows us to use the generic entity pattern consistently across all entities
 * while maintaining type safety and specific configuration for each entity type.
 */

// Facility store
export const useFacilityStore = createGenericEntityStore<Facility>('facilities', {
  related: [], // Removed relationships as they're not needed for the list view
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
