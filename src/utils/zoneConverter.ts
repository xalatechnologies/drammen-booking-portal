
import { Zone } from '@/types/zone';

export function convertToLegacyZone(zone: Zone): any {
  return {
    id: zone.id,
    name: zone.name,
    facilityId: zone.facility_id.toString(),
    type: zone.type,
    capacity: zone.capacity,
    description: zone.description,
    is_main_zone: zone.is_main_zone,
    parent_zone_id: zone.parent_zone_id,
    bookable_independently: zone.bookable_independently,
    area_sqm: zone.area_sqm,
    floor: zone.floor,
    coordinates: {
      x: zone.coordinates_x || 0,
      y: zone.coordinates_y || 0,
      width: zone.coordinates_width || 0,
      height: zone.coordinates_height || 0
    },
    equipment: zone.equipment || [],
    accessibility_features: zone.accessibility_features || [],
    status: zone.status,
    created_at: zone.created_at,
    updated_at: zone.updated_at,
    dimensions: {
      width: zone.coordinates_width || 0,
      length: zone.coordinates_height || 0,
      height: 3
    },
    conflictRules: []
  };
}

export function convertFromLegacyZone(legacyZone: any): Zone {
  return {
    id: legacyZone.id,
    name: legacyZone.name,
    facility_id: parseInt(legacyZone.facilityId),
    type: legacyZone.type,
    capacity: legacyZone.capacity,
    description: legacyZone.description,
    is_main_zone: legacyZone.is_main_zone || legacyZone.isMainZone,
    parent_zone_id: legacyZone.parent_zone_id || legacyZone.parentZoneId,
    bookable_independently: legacyZone.bookable_independently || legacyZone.bookableIndependently,
    area_sqm: legacyZone.area_sqm || legacyZone.areaSqm,
    floor: legacyZone.floor,
    coordinates_x: legacyZone.coordinates?.x || 0,
    coordinates_y: legacyZone.coordinates?.y || 0,
    coordinates_width: legacyZone.coordinates?.width || 0,
    coordinates_height: legacyZone.coordinates?.height || 0,
    equipment: legacyZone.equipment || [],
    accessibility_features: legacyZone.accessibility_features || legacyZone.accessibilityFeatures || [],
    status: legacyZone.status,
    created_at: legacyZone.created_at || legacyZone.createdAt,
    updated_at: legacyZone.updated_at || legacyZone.updatedAt
  };
}

export function convertZoneToBookingZone(zone: Zone): any {
  return {
    id: zone.id,
    name: zone.name,
    description: zone.description || '',
    capacity: zone.capacity || 30,
    pricePerHour: 450,
    area: `${zone.area_sqm || 100} m²`,
    equipment: zone.equipment || [],
    amenities: zone.accessibility_features || [],
    bookingRules: {
      minBookingDuration: 1,
      maxBookingDuration: 8,
      allowedTimeSlots: ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'],
      bookingTypes: ['one-time', 'recurring'],
      advanceBookingDays: 30,
      cancellationHours: 24
    },
    accessibility: zone.accessibility_features || [],
    features: [],
    isActive: zone.status === 'active',
    subZones: [],
    layout: {
      coordinates: {
        x: zone.coordinates_x || 0,
        y: zone.coordinates_y || 0,
        width: zone.coordinates_width || 100,
        height: zone.coordinates_height || 80
      },
      entryPoints: ['Hovedinngang']
    },
    adminInfo: {
      contactPersonName: 'Ansvarlig',
      contactPersonEmail: 'contact@facility.no',
      specialInstructions: 'Følg fasilitetets regler',
      maintenanceSchedule: []
    }
  };
}
