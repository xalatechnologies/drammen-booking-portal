
import { Zone } from '@/components/booking/types';

interface CalendarZone {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description: string;
}

export function convertCalendarZoneToBookingZone(calendarZone: CalendarZone, facilityId: number): Zone {
  // Generate hourly time slots from 08:00 to 22:00
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = 8 + i;
    const nextHour = hour + 1;
    return `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
  });

  return {
    id: calendarZone.id,
    name: calendarZone.name,
    capacity: calendarZone.capacity,
    equipment: [],
    pricePerHour: calendarZone.pricePerHour,
    description: calendarZone.description,
    area: "100 m²", // Convert to string with unit
    parentZoneId: undefined,
    isMainZone: true,
    subZones: [],
    bookingRules: {
      minBookingDuration: 1,
      maxBookingDuration: 8,
      allowedTimeSlots: timeSlots,
      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
      advanceBookingDays: 90,
      cancellationHours: 24
    },
    adminInfo: {
      contactPersonName: "Facility Manager",
      contactPersonEmail: "manager@drammen.kommune.no",
      specialInstructions: calendarZone.description,
      maintenanceSchedule: []
    },
    layout: {
      coordinates: { x: 0, y: 0, width: 100, height: 100 },
      entryPoints: ["Hovedinngang"]
    },
    accessibility: [],
    features: [],
    restrictions: [],
    isActive: true
  };
}
