
import { LocalizedFacility } from '@/types/localization';

export const sportsFacilities: LocalizedFacility[] = [
  {
    id: 1,
    name: {
      NO: "Brandengen Skole - Gymsal",
      EN: "Brandengen School - Gymnasium"
    },
    address: "Iver Holters gate 48, 3041 Drammen",
    type: "Gymsal",
    area: "Bragernes",
    status: 'active',
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
    openingHours: [
      { dayOfWeek: 1, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 2, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 3, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 4, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 5, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 6, opens: "10:00", closes: "20:00" },
      { dayOfWeek: 0, opens: "10:00", closes: "20:00" }
    ],
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
    lat: 59.7464,
    lng: 10.2045,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
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
    status: 'active',
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
    openingHours: [
      { dayOfWeek: 1, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 2, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 3, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 4, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 5, opens: "07:00", closes: "24:00" },
      { dayOfWeek: 6, opens: "09:00", closes: "22:00" },
      { dayOfWeek: 0, opens: "09:00", closes: "22:00" }
    ],
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
    lat: 59.7298,
    lng: 10.1845,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
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
    id: 6,
    name: {
      NO: "Åssiden Fotballhall",
      EN: "Åssiden Football Hall"
    },
    address: "Buskerudveien 54, 3024 Drammen",
    type: "Fotballhall",
    area: "Åssiden",
    status: 'active',
    image: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
    nextAvailable: "Lørdag, 18:30",
    capacity: 300,
    accessibility: ["wheelchair"],
    suitableFor: {
      NO: ["Fotball", "Futsal", "Innebandy", "Håndball"],
      EN: ["Football", "Futsal", "Floorball", "Handball"]
    },
    equipment: {
      NO: ["Kunstgress", "Fotballmål", "Tilskuerplasser", "Garderober", "Kafeteria"],
      EN: ["Artificial turf", "Football goals", "Spectator seats", "Changing rooms", "Cafeteria"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 2, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 3, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 4, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 5, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 6, opens: "07:00", closes: "23:00" }
    ],
    description: {
      NO: "Stor fotballhall med kunstgress av høy kvalitet. Egnet for både trening, kamper og turneringer.",
      EN: "Large football hall with high-quality artificial turf. Suitable for training, matches and tournaments."
    },
    rating: 4.4,
    reviewCount: 52,
    pricePerHour: 900,
    amenities: {
      NO: ["Kunstgress", "Fotballmål", "Tilskuerplasser", "Garderober", "Kafeteria"],
      EN: ["Artificial turf", "Football goals", "Spectator seats", "Changing rooms", "Cafeteria"]
    },
    hasAutoApproval: true,
    lat: 59.7634,
    lng: 10.1456,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 4, 30),
        slots: [
          { start: "18:30", end: "20:30", available: true }
        ]
      }
    ]
  },
  {
    id: 11,
    name: {
      NO: "Ytterkollen Idrettshall",
      EN: "Ytterkollen Sports Hall"
    },
    address: "Ytterkollveien 78, 3037 Drammen",
    type: "Idrettshall",
    area: "Konnerud",
    status: 'active',
    image: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
    nextAvailable: "Torsdag, 15:00",
    capacity: 350,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Fotball", "Håndball", "Basketball", "Turnering"],
      EN: ["Football", "Handball", "Basketball", "Tournaments"]
    },
    equipment: {
      NO: ["Kunstgress", "Tribuner", "Lydanlegg", "Garderober", "Kantine"],
      EN: ["Artificial turf", "Stands", "Sound system", "Changing rooms", "Canteen"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "06:00", closes: "23:30" },
      { dayOfWeek: 2, opens: "06:00", closes: "23:30" },
      { dayOfWeek: 3, opens: "06:00", closes: "23:30" },
      { dayOfWeek: 4, opens: "06:00", closes: "23:30" },
      { dayOfWeek: 5, opens: "06:00", closes: "23:30" },
      { dayOfWeek: 6, opens: "06:00", closes: "23:30" }
    ],
    description: {
      NO: "Stor idrettshall med tribuner og moderne fasiliteter. Ideell for store idrettsarrangementer.",
      EN: "Large sports hall with stands and modern facilities. Ideal for major sports events."
    },
    rating: 4.8,
    reviewCount: 76,
    pricePerHour: 850,
    amenities: {
      NO: ["Kunstgress", "Tribuner", "Lydanlegg", "Garderober", "Kantine"],
      EN: ["Artificial turf", "Stands", "Sound system", "Changing rooms", "Canteen"]
    },
    hasAutoApproval: false,
    lat: 59.7234,
    lng: 10.1678,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 5, 5),
        slots: [
          { start: "15:00", end: "17:00", available: true },
          { start: "17:00", end: "19:00", available: true }
        ]
      }
    ]
  },
  {
    id: 998,
    name: {
      NO: "Idrettshall Mjøndalen - Fleksibel",
      EN: "Mjøndalen Sports Hall - Flexible"
    },
    address: "Idrettsveien 22, Mjøndalen",
    type: "Idrettshall",
    area: "Mjøndalen",
    status: 'active',
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    nextAvailable: "I morgen, 09:00",
    capacity: 150,
    accessibility: ["wheelchair"],
    suitableFor: {
      NO: ["Håndball", "Basketball", "Volleyball", "Badminton"],
      EN: ["Handball", "Basketball", "Volleyball", "Badminton"]
    },
    equipment: {
      NO: ["Basketkurver", "Håndballmål", "Nettstolper", "Tribuner"],
      EN: ["Basketball Hoops", "Handball Goals", "Net Posts", "Stands"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 2, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 3, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 4, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 5, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 6, opens: "09:00", closes: "21:00" },
      { dayOfWeek: 0, opens: "09:00", closes: "21:00" }
    ],
    description: {
      NO: "Moderne idrettshall med tre separate soner som kan kombineres. Ideell for håndball, basketball, volleyball og badminton med mulighet for samtidig bruk av flere områder.",
      EN: "Modern sports hall with three separate zones that can be combined. Ideal for handball, basketball, volleyball and badminton with the possibility of simultaneous use of multiple areas."
    },
    rating: 4.6,
    reviewCount: 32,
    pricePerHour: 600,
    amenities: {
      NO: ["Moderne utstyr", "God ventilasjon", "Garderober"],
      EN: ["Modern Equipment", "Good Ventilation", "Changing Rooms"]
    },
    hasAutoApproval: true,
    timeSlotDuration: 2,
    lat: 59.7234,
    lng: 10.1934,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: []
  }
];
