
import { Zone } from '@/components/booking/types';

interface CalendarZone {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description: string;
}

export function transformCalendarZoneToBookingZone(
  zone: CalendarZone, 
  facilityId: number
): Zone {
  return {
    id: zone.id,
    name: zone.name,
    capacity: zone.capacity,
    pricePerHour: zone.pricePerHour,
    description: zone.description,
    area: "120 m²",
    equipment: [],
    accessibility: [],
    images: [],
    facilityId: facilityId.toString(),
    isMainZone: true,
    subZones: [],
    amenities: [],
    features: [],
    bookingRules: {
      minBookingDuration: 1,
      maxBookingDuration: 8,
      allowedTimeSlots: [],
      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
      advanceBookingDays: 90,
      cancellationHours: 24
    },
    adminInfo: {
      contactPersonName: "Facility Manager",
      contactPersonEmail: "manager@facility.no",
      specialInstructions: "",
      maintenanceSchedule: []
    },
    layout: {
      coordinates: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      },
      entryPoints: ["Hovedinngang"]
    },
    isActive: true
  };
}
