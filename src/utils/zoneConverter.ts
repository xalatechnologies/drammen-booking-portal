
import { Zone as FacilityZone } from '@/types/facility';
import { Zone as BookingZone } from '@/components/booking/types';

export function convertZoneToBookingZone(facilityZone: any): BookingZone {
  return {
    id: facilityZone.id,
    name: facilityZone.name,
    facilityId: typeof facilityZone.facilityId === 'string' ? facilityZone.facilityId : (facilityZone.facility_id?.toString() || ''), 
    capacity: facilityZone.capacity,
    pricePerHour: facilityZone.pricePerHour || 250, // Use existing or default price
    description: facilityZone.description || '',
    area: facilityZone.area || (facilityZone.area_sqm ? `${facilityZone.area_sqm} m²` : "100 m²"),
    isMainZone: facilityZone.isMainZone || facilityZone.is_main_zone || false,
    parentZoneId: facilityZone.parentZoneId || facilityZone.parent_zone_id || undefined,
    subZones: facilityZone.subZones || [],
    equipment: facilityZone.equipment || facilityZone.features || [],
    amenities: facilityZone.amenities || facilityZone.accessibility_features || [], // Ensure amenities field exists
    bookingRules: facilityZone.bookingRules || {
      minBookingDuration: 1,
      maxBookingDuration: 8,
      allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"],
      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
      advanceBookingDays: 90,
      cancellationHours: 24
    },
    adminInfo: facilityZone.adminInfo || {
      contactPersonName: "Zone Manager",
      contactPersonEmail: "zone@drammen.kommune.no",
      specialInstructions: facilityZone.description || '',
      maintenanceSchedule: []
    },
    layout: facilityZone.layout || {
      coordinates: {
        x: facilityZone.coordinates_x || 0,
        y: facilityZone.coordinates_y || 0,
        width: facilityZone.coordinates_width || 100,
        height: facilityZone.coordinates_height || 100
      },
      entryPoints: ["Hovedinngang"]
    },
    accessibility: facilityZone.accessibility || facilityZone.accessibility_features || [],
    features: facilityZone.features || facilityZone.equipment || [],
    isActive: facilityZone.isActive !== undefined ? facilityZone.isActive : (facilityZone.status === 'active')
  };
}
