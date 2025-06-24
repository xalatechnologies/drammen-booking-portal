
import { Zone } from '@/types/facility';

export const normalizeZoneData = (dbZones: any[]): Zone[] => {
  return dbZones.map(zone => ({
    id: zone.id,
    name: zone.name,
    facility_id: zone.facility_id,
    type: zone.type,
    capacity: zone.capacity,
    description: zone.description,
    is_main_zone: zone.is_main_zone,
    parent_zone_id: zone.parent_zone_id,
    bookable_independently: zone.bookable_independently,
    area_sqm: zone.area_sqm,
    floor: zone.floor,
    coordinates_x: zone.coordinates_x,
    coordinates_y: zone.coordinates_y,
    coordinates_width: zone.coordinates_width,
    coordinates_height: zone.coordinates_height,
    equipment: zone.equipment || [],
    accessibility_features: zone.accessibility_features || [],
    status: zone.status,
    created_at: zone.created_at,
    updated_at: zone.updated_at,
    // Add required computed fields
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
    },
    // Legacy fields for backwards compatibility
    facilityId: zone.facility_id?.toString(),
    conflictRules: [],
    dimensions: {
      width: zone.coordinates_width || 100,
      length: zone.coordinates_height || 100,
      height: 300
    }
  }));
};
