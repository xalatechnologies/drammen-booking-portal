
import { Zone as DatabaseZone } from '@/types/zone';
import { Zone as BookingZone } from '@/components/booking/types';

export function convertZoneToBookingZone(dbZone: DatabaseZone): BookingZone {
  return {
    id: dbZone.id,
    name: dbZone.name,
    capacity: dbZone.capacity || 30,
    equipment: dbZone.equipment || [],
    pricePerHour: dbZone.pricing?.basePrice || 450,
    description: dbZone.description || '',
    area: dbZone.area ? `${dbZone.area} m²` : "120 m²",
    isMainZone: dbZone.isMainZone,
    subZones: [],
    bookingRules: {
      minBookingDuration: dbZone.pricing?.minimumBookingDuration ? Math.floor(dbZone.pricing.minimumBookingDuration / 60) : 2,
      maxBookingDuration: dbZone.pricing?.maximumBookingDuration ? Math.floor(dbZone.pricing.maximumBookingDuration / 60) : 8,
      allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
      bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
      advanceBookingDays: 90,
      cancellationHours: dbZone.pricing?.cancellationPolicy?.freeUntilHours || 48
    },
    adminInfo: {
      contactPersonName: "Lars Hansen",
      contactPersonEmail: "lars.hansen@drammen.kommune.no",
      specialInstructions: dbZone.description || '',
      maintenanceSchedule: []
    },
    layout: dbZone.coordinates ? {
      coordinates: {
        x: dbZone.coordinates.x,
        y: dbZone.coordinates.y,
        width: dbZone.coordinates.width,
        height: dbZone.coordinates.height
      },
      entryPoints: ["Hovedinngang"]
    } : undefined,
    accessibility: dbZone.accessibility || [],
    features: dbZone.features || [],
    isActive: dbZone.isActive
  };
}
