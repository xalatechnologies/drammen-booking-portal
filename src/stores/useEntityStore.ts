
import { createGenericEntityStore } from '@/stores/createGenericEntityStore';
import { Facility } from '@/types/facility';

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

// Zone store - basic type for zones
interface Zone {
  id: string;
  name: string;
  facility_id: number;
  type: string;
  capacity: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useZoneStore = createGenericEntityStore<Zone>('zones', {
  idField: 'id',
  statusField: 'status',
  activeValue: 'active'
});

// Opening Hours store
interface OpeningHours {
  id: string;
  facility_id: number;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_open: boolean;
  created_at: string;
}

export const useOpeningHoursStore = createGenericEntityStore<OpeningHours>('facility_opening_hours', {
  idField: 'id'
});

// Blackout store
interface Blackout {
  id: string;
  facility_id: number;
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
  created_by: string;
  created_at: string;
}

export const useBlackoutStore = createGenericEntityStore<Blackout>('facility_blackout_periods', {
  idField: 'id'
});
