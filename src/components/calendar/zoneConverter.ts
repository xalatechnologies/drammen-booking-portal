
import { Zone } from '@/components/booking/types';

export function convertApiZoneToZone(apiZone: any): Zone {
  return {
    id: apiZone.id || apiZone.zone_id,
    name: apiZone.name || apiZone.zone_name || 'Unnamed Zone',
    facilityId: apiZone.facility_id?.toString() || apiZone.facilityId?.toString() || '1', // Add missing facilityId
    description: apiZone.description || '',
    capacity: apiZone.capacity || 30,
    pricePerHour: apiZone.price_per_hour || apiZone.pricePerHour || 450,
    area: apiZone.area || '100 m²',
    isMainZone: apiZone.is_main_zone || apiZone.isMainZone || false, // Add missing isMainZone
    equipment: apiZone.equipment || [],
    amenities: apiZone.amenities || [],
    bookingRules: {
      minBookingDuration: apiZone.min_booking_duration || 1,
      maxBookingDuration: apiZone.max_booking_duration || 8,
      allowedTimeSlots: apiZone.allowed_time_slots || ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'],
      bookingTypes: apiZone.booking_types || ['one-time', 'recurring'],
      advanceBookingDays: apiZone.advance_booking_days || 30,
      cancellationHours: apiZone.cancellation_hours || 24
    },
    accessibility: apiZone.accessibility || [],
    features: apiZone.features || [],
    isActive: apiZone.is_active !== false,
    subZones: apiZone.sub_zones || [],
    layout: {
      coordinates: {
        x: 0,
        y: 0,
        width: 100,
        height: 80
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

export function convertZoneToApiFormat(zone: Zone): any {
  return {
    id: zone.id,
    name: zone.name,
    facility_id: zone.facilityId,
    description: zone.description,
    capacity: zone.capacity,
    price_per_hour: zone.pricePerHour,
    area: zone.area,
    is_main_zone: zone.isMainZone,
    equipment: zone.equipment,
    amenities: zone.amenities,
    min_booking_duration: zone.bookingRules?.minBookingDuration,
    max_booking_duration: zone.bookingRules?.maxBookingDuration,
    allowed_time_slots: zone.bookingRules?.allowedTimeSlots,
    booking_types: zone.bookingRules?.bookingTypes,
    advance_booking_days: zone.bookingRules?.advanceBookingDays,
    cancellation_hours: zone.bookingRules?.cancellationHours,
    accessibility: zone.accessibility,
    features: zone.features,
    is_active: zone.isActive,
    sub_zones: zone.subZones
  };
}

export function convertCalendarZoneToBookingZone(calendarZone: any, facilityId: number): Zone {
  return {
    id: calendarZone.id,
    name: calendarZone.name,
    facilityId: facilityId.toString(), // Add missing facilityId
    description: calendarZone.description || '',
    capacity: calendarZone.capacity || 30,
    pricePerHour: calendarZone.pricePerHour || 450,
    area: '100 m²',
    isMainZone: calendarZone.isMainZone || false, // Add missing isMainZone
    equipment: [],
    amenities: [],
    bookingRules: {
      minBookingDuration: 1,
      maxBookingDuration: 8,
      allowedTimeSlots: ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'],
      bookingTypes: ['one-time', 'recurring'],
      advanceBookingDays: 30,
      cancellationHours: 24
    },
    accessibility: [],
    features: [],
    isActive: true,
    subZones: [],
    layout: {
      coordinates: {
        x: 0,
        y: 0,
        width: 100,
        height: 80
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
