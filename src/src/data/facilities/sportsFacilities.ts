
import { LocalizedFacility } from '@/types/localization';

export const sportsFacilities: LocalizedFacility[] = [
  {
    id: 1,
    name: {
      NO: "Brandengen Skole - Gymsal",
      EN: "Brandengen School - Gymnasium"
    },
    address: "Iver Holters gate 48, 3041 Drammen",
    address_street: "Iver Holters gate 48",
    address_city: "Drammen",
    address_postal_code: "3041",
    address_country: "Norway",
    type: "Gymsal",
    area: "Bragernes",
    status: 'active',
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    image_url: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    next_available: "I dag, 18:00",
    nextAvailable: "I dag, 18:00",
    capacity: 120,
    accessibility_features: ["wheelchair", "hearing-loop"],
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
    review_count: 15,
    price_per_hour: 500,
    pricePerHour: 500,
    amenities: {
      NO: ["Basketkurver", "Volleyballnett", "Lydsystem", "Projektor"],
      EN: ["Basketball hoops", "Volleyball net", "Sound system", "Projector"]
    },
    has_auto_approval: false,
    hasAutoApproval: false,
    lat: 59.7464,
    lng: 10.2045,
    latitude: 59.7464,
    longitude: 10.2045,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    season_from: "2024-01-01",
    season_to: "2024-12-31",
    allowed_booking_types: ['engangs', 'fastlan', 'rammetid', 'strotimer'],
    zones: [],
    time_slot_duration: 1,
    timeSlotDuration: 1,
    booking_lead_time_hours: 2,
    max_advance_booking_days: 365,
    cancellation_deadline_hours: 24,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    area_sqm: null,
    contact_name: null,
    contact_email: null,
    contact_phone: null,
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
    address_street: "Lauritz Hervigs vei 20",
    address_city: "Drammen",
    address_postal_code: "3035",
    address_country: "Norway",
    type: "Aktivitetshall",
    area: "Konnerud",
    status: 'active',
    image: "/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png",
    image_url: "/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png",
    next_available: "Fredag, 17:00",
    capacity: 200,
    accessibility_features: ["wheelchair"],
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
    review_count: 23,
    price_per_hour: 650,
    amenities: {
      NO: ["Fotballmål", "Lydanlegg", "Scene", "Garderober"],
      EN: ["Football goals", "Sound system", "Stage", "Changing rooms"]
    },
    has_auto_approval: false,
    lat: 59.7298,
    lng: 10.1845,
    latitude: 59.7298,
    longitude: 10.1845,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    season_from: "2024-01-01",
    season_to: "2024-12-31",
    allowed_booking_types: ['engangs', 'fastlan', 'rammetid', 'strotimer'],
    zones: [],
    time_slot_duration: 1,
    booking_lead_time_hours: 2,
    max_advance_booking_days: 365,
    cancellation_deadline_hours: 24,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    area_sqm: null,
    contact_name: null,
    contact_email: null,
    contact_phone: null,
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
    address_street: "Buskerudveien 54",
    address_city: "Drammen",
    address_postal_code: "3024",
    address_country: "Norway",
    type: "Fotballhall",
    area: "Åssiden",
    status: 'active',
    image: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
    image_url: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
    next_available: "Lørdag, 18:30",
    capacity: 300,
    accessibility_features: ["wheelchair"],
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
    review_count: 52,
    price_per_hour: 900,
    amenities: {
      NO: ["Kunstgress", "Fotballmål", "Tilskuerplasser", "Garderober", "Kafeteria"],
      EN: ["Artificial turf", "Football goals", "Spectator seats", "Changing rooms", "Cafeteria"]
    },
    has_auto_approval: true,
    lat: 59.7634,
    lng: 10.1456,
    latitude: 59.7634,
    longitude: 10.1456,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    season_from: "2024-01-01",
    season_to: "2024-12-31",
    allowed_booking_types: ['engangs', 'fastlan', 'rammetid', 'strotimer'],
    zones: [],
    time_slot_duration: 1,
    booking_lead_time_hours: 2,
    max_advance_booking_days: 365,
    cancellation_deadline_hours: 24,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    area_sqm: null,
    contact_name: null,
    contact_email: null,
    contact_phone: null,
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
    address_street: "Ytterkollveien 78",
    address_city: "Drammen",
    address_postal_code: "3037",
    address_country: "Norway",
    type: "Idrettshall",
    area: "Konnerud",
    status: 'active',
    image: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
    image_url: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
    next_available: "Torsdag, 15:00",
    capacity: 350,
    accessibility_features: ["wheelchair", "hearing-loop"],
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
    review_count: 76,
    price_per_hour: 850,
    amenities: {
      NO: ["Kunstgress", "Tribuner", "Lydanlegg", "Garderober", "Kantine"],
      EN: ["Artificial turf", "Stands", "Sound system", "Changing rooms", "Canteen"]
    },
    has_auto_approval: false,
    lat: 59.7234,
    lng: 10.1678,
    latitude: 59.7234,
    longitude: 10.1678,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    season_from: "2024-01-01",
    season_to: "2024-12-31",
    allowed_booking_types: ['engangs', 'fastlan', 'rammetid', 'strotimer'],
    zones: [],
    time_slot_duration: 1,
    booking_lead_time_hours: 2,
    max_advance_booking_days: 365,
    cancellation_deadline_hours: 24,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    area_sqm: null,
    contact_name: null,
    contact_email: null,
    contact_phone: null,
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
    address_street: "Idrettsveien 22",
    address_city: "Mjøndalen",
    address_postal_code: "3050",
    address_country: "Norway",
    type: "Idrettshall",
    area: "Mjøndalen",
    status: 'active',
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    image_url: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    next_available: "I morgen, 09:00",
    capacity: 150,
    accessibility_features: ["wheelchair"],
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
    review_count: 32,
    price_per_hour: 600,
    amenities: {
      NO: ["Moderne utstyr", "God ventilasjon", "Garderober"],
      EN: ["Modern Equipment", "Good Ventilation", "Changing Rooms"]
    },
    has_auto_approval: true,
    lat: 59.7234,
    lng: 10.1934,
    latitude: 59.7234,
    longitude: 10.1934,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    season_from: "2024-01-01",
    season_to: "2024-12-31",
    allowed_booking_types: ['engangs', 'fastlan', 'rammetid', 'strotimer'],
    zones: [],
    time_slot_duration: 2,
    booking_lead_time_hours: 2,
    max_advance_booking_days: 365,
    cancellation_deadline_hours: 24,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    area_sqm: null,
    contact_name: null,
    contact_email: null,
    contact_phone: null
  }
];
