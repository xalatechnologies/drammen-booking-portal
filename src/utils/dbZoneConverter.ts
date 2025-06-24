
import { Zone } from '@/types/facility';

const getLocalizedText = (value: any, fallback: string = 'Unknown'): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    return value.no || value.en || value.nb || fallback;
  }
  return fallback;
};

const normalizeStatus = (status: string): 'active' | 'maintenance' | 'inactive' => {
  const validStatuses: ('active' | 'maintenance' | 'inactive')[] = ['active', 'maintenance', 'inactive'];
  return validStatuses.includes(status as any) ? status as any : 'active';
};

export function convertDatabaseZoneToZone(dbZone: any): Zone {
  return {
    id: dbZone.id,
    facility_id: dbZone.facility_id || dbZone.location_id,
    name: getLocalizedText(dbZone.name, 'Unknown Zone'),
    type: dbZone.type || 'area',
    description: dbZone.description || null,
    capacity: dbZone.capacity || 1,
    area_sqm: dbZone.area_sqm || null,
    equipment: dbZone.equipment || [],
    accessibility_features: dbZone.accessibility_features || [],
    bookable_independently: dbZone.bookable_independently !== false,
    is_main_zone: dbZone.is_main_zone || false,
    parent_zone_id: dbZone.parent_zone_id || null,
    coordinates_x: dbZone.coordinates_x || null,
    coordinates_y: dbZone.coordinates_y || null,
    coordinates_width: dbZone.coordinates_width || null,
    coordinates_height: dbZone.coordinates_height || null,
    floor: dbZone.floor || null,
    status: normalizeStatus(dbZone.status || 'active'),
    metadata: dbZone.metadata || {},
    created_at: dbZone.created_at,
    updated_at: dbZone.updated_at,
    // Computed/derived fields for backwards compatibility
    pricePerHour: 250,
    availableTimes: [],
    openingHours: [],
    bookingRules: {
      minBookingDuration: 1,
      maxBookingDuration: 8,
      allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"],
      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
      advanceBookingDays: 90,
      cancellationHours: 24
    }
  };
}
