
import { Zone as FacilityZone } from '@/types/facility';
import { Zone as BookingZone } from '@/components/booking/types';

export function convertZoneToBookingZone(facilityZone: FacilityZone): BookingZone {
  return {
    id: facilityZone.id,
    name: facilityZone.name,
    facilityId: facilityZone.facility_id?.toString() || '', 
    capacity: facilityZone.capacity,
    pricePerHour: 250, // Default price
    description: facilityZone.description || '',
    area: facilityZone.area_sqm ? `${facilityZone.area_sqm} m²` : "100 m²",
    isMainZone: facilityZone.is_main_zone || false,
    parentZoneId: facilityZone.parent_zone_id || undefined,
    subZones: [],
    equipment: facilityZone.equipment || [],
    amenities: facilityZone.accessibility_features || [], // Map accessibility_features to amenities
    bookingRules: {
      minBookingDuration: 1,
      maxBookingDuration: 8,
      allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"],
      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
      advanceBookingDays: 90,
      cancellationHours: 24
    },
    adminInfo: {
      contactPersonName: "Zone Manager",
      contactPersonEmail: "zone@drammen.kommune.no",
      specialInstructions: facilityZone.description || '',
      maintenanceSchedule: []
    },
    layout: {
      coordinates: {
        x: facilityZone.coordinates_x || 0,
        y: facilityZone.coordinates_y || 0,
        width: facilityZone.coordinates_width || 100,
        height: facilityZone.coordinates_height || 100
      },
      entryPoints: ["Hovedinngang"]
    },
    accessibility: facilityZone.accessibility_features || [],
    features: facilityZone.equipment || [],
    isActive: facilityZone.status === 'active'
  };
}
