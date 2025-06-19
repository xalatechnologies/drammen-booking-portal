
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
  },
  {
    id: 3,
    name: {
      NO: "Strømsø Idrettshall",
      EN: "Strømsø Sports Hall"
    },
    address: "Strømsø torg 8, Drammen",
    type: "Idrettshall",
    area: "Strømsø",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
    nextAvailable: "I dag 16:00",
    capacity: 50,
    accessibility: ["wheelchair", "hearing-loop", "visual-guidance"],
    suitableFor: {
      NO: ["Idrett", "Ballsport", "Turneringer", "Arrangementer"],
      EN: ["Sports", "Ball games", "Tournaments", "Events"]
    },
    equipment: {
      NO: ["Projektor", "Lydanlegg", "Basketkurver", "Volleyballnett", "Håndballmål", "Tribuner"],
      EN: ["Projector", "Sound system", "Basketball hoops", "Volleyball net", "Handball goals", "Stands"]
    },
    openingHours: "Man-Søn: 06:00-23:00",
    description: {
      NO: "Stor idrettshall med tribuner og profesjonelt utstyr for alle typer ballsport.",
      EN: "Large sports hall with stands and professional equipment for all types of ball sports."
    },
    rating: 4.8,
    reviewCount: 42,
    pricePerHour: 750,
    amenities: {
      NO: ["Projektor", "Lydanlegg", "Basketkurver", "Volleyballnett", "Håndballmål", "Tribuner"],
      EN: ["Projector", "Sound system", "Basketball hoops", "Volleyball net", "Handball goals", "Stands"]
    },
    hasAutoApproval: true,
    availableTimes: [
      {
        date: new Date(),
        slots: [
          { start: "08:00", end: "10:00", available: true },
          { start: "10:00", end: "12:00", available: true },
          { start: "12:00", end: "14:00", available: true },
          { start: "14:00", end: "16:00", available: true },
          { start: "16:00", end: "18:00", available: true },
          { start: "18:00", end: "20:00", available: true },
          { start: "20:00", end: "22:00", available: true },
        ]
      }
    ]
  }
];
