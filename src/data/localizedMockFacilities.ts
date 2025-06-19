
import { LocalizedFacility } from '@/types/localization';

export const localizedMockFacilities: LocalizedFacility[] = [
  {
    id: 1,
    name: {
      NO: "Brandengen Skole - Gymsal",
      EN: "Brandengen School - Gymnasium"
    },
    address: "Iver Holters gate 48, 3041 Drammen",
    type: "Gymsal",
    area: "Bragernes",
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    nextAvailable: "I dag, 18:00",
    capacity: 120,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Basketball", "Volleyball", "Håndball", "Badminton"],
      EN: ["Basketball", "Volleyball", "Handball", "Badminton"]
    },
    equipment: {
      NO: ["Basketkurver", "Volleyballnett", "Lydsystem", "Projektor"],
      EN: ["Basketball hoops", "Volleyball net", "Sound system", "Projector"]
    },
    openingHours: "Man-Fre: 08:00-22:00, Lør-Søn: 10:00-20:00",
    description: {
      NO: "En moderne gymsal med høy standard og god ventilasjon. Ideell for ballsport og større arrangementer.",
      EN: "A modern gymnasium with high standards and good ventilation. Ideal for ball sports and larger events."
    },
    rating: 4.2,
    reviewCount: 15,
    pricePerHour: 500,
    amenities: {
      NO: ["Basketkurver", "Volleyballnett", "Lydsystem", "Projektor"],
      EN: ["Basketball hoops", "Volleyball net", "Sound system", "Projector"]
    },
    hasAutoApproval: false,
    availableTimes: [
      {
        date: new Date(2025, 4, 25),
        slots: [
          { start: "14:00", end: "16:00", available: true },
          { start: "16:00", end: "18:00", available: false },
          { start: "18:00", end: "20:00", available: true }
        ]
      }
    ]
  },
  {
    id: 2,
    name: {
      NO: "Fjell Skole - Aktivitetshall",
      EN: "Fjell School - Activity Hall"
    },
    address: "Lauritz Hervigs vei 20, 3035 Drammen",
    type: "Aktivitetshall",
    area: "Konnerud",
    image: "/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png",
    nextAvailable: "Fredag, 17:00",
    capacity: 200,
    accessibility: ["wheelchair"],
    suitableFor: {
      NO: ["Fotball", "Innebandy", "Dans", "Konsert"],
      EN: ["Football", "Floorball", "Dance", "Concert"]
    },
    equipment: {
      NO: ["Fotballmål", "Lydanlegg", "Scene", "Garderober"],
      EN: ["Football goals", "Sound system", "Stage", "Changing rooms"]
    },
    openingHours: "Man-Tor: 07:00-23:00, Fre: 07:00-24:00, Lør-Søn: 09:00-22:00",
    description: {
      NO: "Stor aktivitetshall med mulighet for både sport og kulturarrangementer. God akustikk og moderne fasiliteter.",
      EN: "Large activity hall suitable for both sports and cultural events. Good acoustics and modern facilities."
    },
    rating: 4.5,
    reviewCount: 23,
    pricePerHour: 650,
    amenities: {
      NO: ["Fotballmål", "Lydanlegg", "Scene", "Garderober"],
      EN: ["Football goals", "Sound system", "Stage", "Changing rooms"]
    },
    hasAutoApproval: false,
    availableTimes: [
      {
        date: new Date(2025, 4, 28),
        slots: [
          { start: "17:00", end: "19:00", available: true },
          { start: "19:00", end: "21:00", available: true }
        ]
      }
    ]
  }
];
