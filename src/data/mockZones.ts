
import { Zone } from '@/types/zone';

export const mockZones: Zone[] = [
  // Brandengen Skole - Gymsal zones
  {
    id: "zone-1-main",
    facilityId: "1",
    name: "Hele gymsalen",
    description: "Full gymnasium with all equipment",
    isMainZone: true,
    capacity: 120,
    area: 400,
    floor: "1",
    coordinates: { x: 0, y: 0, width: 20, height: 20 },
    equipment: ["Basketkurver", "Volleyballnett", "Lydsystem", "Projektor"],
    features: ["Høy standard", "God ventilasjon", "Moderne utstyr"],
    accessibility: ["wheelchair", "hearing-loop"],
    pricing: {
      basePrice: 800,
      currency: "NOK",
      priceRules: [
        {
          id: "rule-1",
          actorType: "lag-foreninger",
          timeSlot: "evening",
          dayType: "weekday",
          multiplier: 0.5,
          isActive: true
        }
      ],
      minimumBookingDuration: 60,
      maximumBookingDuration: 480,
      cancellationPolicy: {
        freeUntilHours: 24,
        partialRefundUntilHours: 12,
        partialRefundPercentage: 50,
        noRefundAfterHours: 2
      }
    },
    availability: {
      openingHours: [
        { dayOfWeek: 1, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 2, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 3, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 4, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 5, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "20:00", isOpen: true },
        { dayOfWeek: 0, openTime: "10:00", closeTime: "20:00", isOpen: true }
      ],
      blackoutPeriods: [
        {
          id: "blackout-1",
          startDate: new Date(2025, 5, 15),
          endDate: new Date(2025, 5, 20),
          reason: "Summer maintenance",
          type: "maintenance"
        }
      ],
      maintenanceSchedule: [
        {
          id: "maint-1",
          title: "Weekly cleaning",
          startDate: new Date(2025, 5, 1),
          endDate: new Date(2025, 5, 1),
          isRecurring: true,
          recurrencePattern: "0 6 * * 0",
          maintenanceType: "cleaning"
        }
      ],
      recurringUnavailability: []
    },
    restrictions: {
      requiresSupervision: false,
      allowedActivities: ["Basketball", "Volleyball", "Håndball", "Badminton"],
      prohibitedActivities: ["Smoking", "Alcohol consumption"],
      requiresTraining: false,
      alcoholPermitted: false,
      smokingPermitted: false,
      petsAllowed: false,
      cateringAllowed: true,
      decorationsAllowed: true,
      amplifiedSoundAllowed: true,
      commercialUseAllowed: true
    },
    isActive: true,
    createdAt: new Date(2025, 0, 1),
    updatedAt: new Date(2025, 5, 1)
  },
  {
    id: "zone-1-half-a",
    facilityId: "1",
    name: "Gymsal - Del A",
    description: "Halvparten av gymsalen (basketballbane)",
    isMainZone: false,
    parentZoneId: "zone-1-main",
    capacity: 60,
    area: 200,
    floor: "1",
    coordinates: { x: 0, y: 0, width: 20, height: 10 },
    equipment: ["Basketkurver", "Lydsystem"],
    features: ["Basketball standard", "Delt område"],
    accessibility: ["wheelchair", "hearing-loop"],
    pricing: {
      basePrice: 450,
      currency: "NOK",
      priceRules: [
        {
          id: "rule-2",
          actorType: "lag-foreninger",
          timeSlot: "evening",
          dayType: "weekday",
          multiplier: 0.5,
          isActive: true
        }
      ],
      minimumBookingDuration: 60,
      maximumBookingDuration: 480,
      cancellationPolicy: {
        freeUntilHours: 24,
        partialRefundUntilHours: 12,
        partialRefundPercentage: 50,
        noRefundAfterHours: 2
      }
    },
    availability: {
      openingHours: [
        { dayOfWeek: 1, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 2, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 3, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 4, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 5, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "20:00", isOpen: true },
        { dayOfWeek: 0, openTime: "10:00", closeTime: "20:00", isOpen: true }
      ],
      blackoutPeriods: [],
      maintenanceSchedule: [],
      recurringUnavailability: []
    },
    restrictions: {
      requiresSupervision: false,
      allowedActivities: ["Basketball", "Badminton"],
      prohibitedActivities: ["Smoking", "Alcohol consumption"],
      requiresTraining: false,
      alcoholPermitted: false,
      smokingPermitted: false,
      petsAllowed: false,
      cateringAllowed: true,
      decorationsAllowed: true,
      amplifiedSoundAllowed: true,
      commercialUseAllowed: true
    },
    isActive: true,
    createdAt: new Date(2025, 0, 1),
    updatedAt: new Date(2025, 5, 1)
  },
  // Fjell Skole - Aktivitetshall zones
  {
    id: "zone-2-main",
    facilityId: "2",
    name: "Hele aktivitetshallen",
    description: "Full activity hall with stage and sound system",
    isMainZone: true,
    capacity: 200,
    area: 600,
    floor: "1",
    coordinates: { x: 0, y: 0, width: 30, height: 20 },
    equipment: ["Fotballmål", "Lydanlegg", "Scene", "Garderober"],
    features: ["Stor hall", "Scene", "God akustikk"],
    accessibility: ["wheelchair"],
    pricing: {
      basePrice: 1200,
      currency: "NOK",
      priceRules: [
        {
          id: "rule-3",
          actorType: "lag-foreninger",
          timeSlot: "evening",
          dayType: "weekday",
          multiplier: 0.4,
          isActive: true
        },
        {
          id: "rule-4",
          actorType: "paraply",
          timeSlot: "day",
          dayType: "weekday",
          multiplier: 0.3,
          isActive: true
        }
      ],
      minimumBookingDuration: 120,
      maximumBookingDuration: 720,
      cancellationPolicy: {
        freeUntilHours: 48,
        partialRefundUntilHours: 24,
        partialRefundPercentage: 60,
        noRefundAfterHours: 4
      }
    },
    availability: {
      openingHours: [
        { dayOfWeek: 1, openTime: "07:00", closeTime: "23:00", isOpen: true },
        { dayOfWeek: 2, openTime: "07:00", closeTime: "23:00", isOpen: true },
        { dayOfWeek: 3, openTime: "07:00", closeTime: "23:00", isOpen: true },
        { dayOfWeek: 4, openTime: "07:00", closeTime: "23:00", isOpen: true },
        { dayOfWeek: 5, openTime: "07:00", closeTime: "24:00", isOpen: true },
        { dayOfWeek: 6, openTime: "09:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 0, openTime: "09:00", closeTime: "22:00", isOpen: true }
      ],
      blackoutPeriods: [],
      maintenanceSchedule: [],
      recurringUnavailability: []
    },
    restrictions: {
      requiresSupervision: false,
      allowedActivities: ["Fotball", "Innebandy", "Dans", "Konsert", "Teater"],
      prohibitedActivities: ["Smoking"],
      requiresTraining: false,
      alcoholPermitted: true,
      smokingPermitted: false,
      petsAllowed: false,
      cateringAllowed: true,
      decorationsAllowed: true,
      amplifiedSoundAllowed: true,
      commercialUseAllowed: true
    },
    isActive: true,
    createdAt: new Date(2025, 0, 1),
    updatedAt: new Date(2025, 5, 1)
  },
  // Add more zones for other facilities...
  {
    id: "zone-3-main",
    facilityId: "3",
    name: "Auditorium",
    description: "Professional auditorium with stage lighting",
    isMainZone: true,
    capacity: 150,
    area: 300,
    floor: "1",
    coordinates: { x: 0, y: 0, width: 25, height: 12 },
    equipment: ["Projektor", "Lydsystem", "Mikrofoner", "Scene", "Lysrigger"],
    features: ["Profesjonelt", "Scenebelysning", "Høykvalitets lyd"],
    accessibility: ["wheelchair", "hearing-loop", "sign-language"],
    pricing: {
      basePrice: 1500,
      currency: "NOK",
      priceRules: [
        {
          id: "rule-5",
          actorType: "kultur",
          timeSlot: "evening",
          dayType: "weekday",
          multiplier: 0.6,
          isActive: true
        }
      ],
      minimumBookingDuration: 180,
      maximumBookingDuration: 480,
      cancellationPolicy: {
        freeUntilHours: 72,
        partialRefundUntilHours: 48,
        partialRefundPercentage: 70,
        noRefundAfterHours: 6
      }
    },
    availability: {
      openingHours: [
        { dayOfWeek: 1, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 2, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 3, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 4, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 5, openTime: "08:00", closeTime: "22:00", isOpen: true },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "18:00", isOpen: true },
        { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isOpen: false }
      ],
      blackoutPeriods: [],
      maintenanceSchedule: [],
      recurringUnavailability: []
    },
    restrictions: {
      requiresSupervision: true,
      allowedActivities: ["Presentasjoner", "Teater", "Konferanser", "Filmvisning"],
      prohibitedActivities: ["Smoking", "Food consumption in auditorium"],
      requiresTraining: true,
      alcoholPermitted: false,
      smokingPermitted: false,
      petsAllowed: false,
      cateringAllowed: false,
      decorationsAllowed: true,
      amplifiedSoundAllowed: true,
      commercialUseAllowed: true
    },
    isActive: true,
    createdAt: new Date(2025, 0, 1),
    updatedAt: new Date(2025, 5, 1)
  }
];

// Helper function to get zones by facility ID
export const getZonesByFacilityId = (facilityId: string): Zone[] => {
  return mockZones.filter(zone => zone.facilityId === facilityId);
};

// Helper function to get main zones only
export const getMainZones = (): Zone[] => {
  return mockZones.filter(zone => zone.isMainZone);
};
