
import { Facility } from "@/types/facility";

export const transformFacilitiesToCalendarFormat = (facilities: Facility[]) => {
  return facilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    location: (facility.address && facility.address.toLowerCase().includes('sentrum')) ? 'drammen-sentrum' : 'konnerud',
    type: facility.type,
    capacity: facility.capacity,
    accessibility: facility.accessibility,
    address: facility.address || '',
    suitableFor: facility.suitableFor,
    image: facility.image,
    zones: [
      {
        id: `zone-${facility.id}-1`,
        name: "Hovedområde",
        facilityId: facility.id.toString(),
        capacity: Math.floor(facility.capacity * 0.7),
        pricePerHour: 250,
        description: "Hovedområdet i lokalet",
        area: "100 m²",
        isMainZone: true,
        subZones: [],
        equipment: [],
        amenities: [],
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
          contactPersonEmail: "manager@drammen.kommune.no",
          specialInstructions: "Hovedområdet i lokalet",
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
      }
    ]
  }));
};
