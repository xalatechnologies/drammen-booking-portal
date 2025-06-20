
import { Zone as BookingZone } from '@/components/booking/types';
import { Zone as TypesZone } from '@/types/zone';

export function convertZoneToBookingZone(zone: TypesZone): BookingZone {
  return {
    id: zone.id,
    name: zone.name,
    capacity: zone.capacity,
    equipment: zone.equipment,
    pricePerHour: zone.pricing.basePrice,
    description: zone.description || '',
    area: `${zone.area} m²`,
    parentZoneId: zone.parentZoneId,
    isMainZone: zone.isMainZone,
    subZones: [], // Could be derived from child zones if needed
    bookingRules: {
      minBookingDuration: Math.floor(zone.pricing.minimumBookingDuration / 60), // Convert minutes to hours
      maxBookingDuration: Math.floor(zone.pricing.maximumBookingDuration / 60), // Convert minutes to hours
      allowedTimeSlots: generateTimeSlots(),
      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
      advanceBookingDays: 90,
      cancellationHours: zone.pricing.cancellationPolicy.freeUntilHours
    },
    adminInfo: {
      contactPersonName: "Facility Manager",
      contactPersonEmail: "manager@drammen.kommune.no",
      specialInstructions: zone.description || '',
      maintenanceSchedule: zone.availability.maintenanceSchedule.map(m => ({
        day: new Date(m.startDate).toLocaleDateString('no-NO', { weekday: 'long' }),
        startTime: m.startDate.toTimeString().slice(0, 5),
        endTime: m.endDate.toTimeString().slice(0, 5)
      }))
    },
    layout: {
      coordinates: zone.coordinates || { x: 0, y: 0, width: 100, height: 100 },
      entryPoints: ["Hovedinngang"]
    },
    accessibility: zone.accessibility,
    features: zone.features,
    restrictions: zone.restrictions.prohibitedActivities,
    isActive: zone.isActive
  };
}

function generateTimeSlots(): string[] {
  return [
    "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
    "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00",
    "20:00-21:00", "21:00-22:00"
  ];
}
