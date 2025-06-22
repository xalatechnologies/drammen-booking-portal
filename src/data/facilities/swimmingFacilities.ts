
import { LocalizedFacility } from '@/types/localization';

export const swimmingFacilities: LocalizedFacility[] = [
  {
    id: 5,
    name: {
      NO: "Drammensbadet - Svømmehall",
      EN: "Drammensbadet - Swimming Pool"
    },
    address: "Danvikgata 40, 3045 Drammen",
    address_street: "Danvikgata 40",
    address_city: "Drammen",
    address_postal_code: "3045",
    address_country: "Norway",
    type: "Svømmehall",
    area: "Åssiden",
    status: 'active',
    image: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
    image_url: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
    next_available: "Søndag, 12:00",
    nextAvailable: "Søndag, 12:00",
    capacity: 250,
    accessibility_features: ["wheelchair", "hearing-loop"],
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Svømming", "Vanngymnastikk", "Svømmeopplæring", "Konkurranser"],
      EN: ["Swimming", "Water aerobics", "Swimming lessons", "Competitions"]
    },
    equipment: {
      NO: ["25m basseng", "Barnebassseng", "Garderober", "Dusjer", "Livredningsutstyr"],
      EN: ["25m pool", "Children's pool", "Changing rooms", "Showers", "Safety equipment"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 2, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 3, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 4, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 5, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 6, opens: "08:00", closes: "20:00" }
    ],
    description: {
      NO: "Moderne svømmeanlegg med både konkurransebasseng og barneområde. Høy standard på Lokaler og sikkerhet.",
      EN: "Modern swimming facility with both competition pool and children's area. High standard facilities and safety measures."
    },
    rating: 4.7,
    review_count: 89,
    price_per_hour: 700,
    pricePerHour: 700,
    amenities: {
      NO: ["25m basseng", "Barnebassseng", "Garderober", "Dusjer", "Livredningsutstyr"],
      EN: ["25m pool", "Children's pool", "Changing rooms", "Showers", "Safety equipment"]
    },
    has_auto_approval: false,
    hasAutoApproval: false,
    lat: 59.7545,
    lng: 10.1798,
    latitude: 59.7545,
    longitude: 10.1798,
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
        date: new Date(2025, 5, 1),
        slots: [
          { start: "12:00", end: "14:00", available: true },
          { start: "14:00", end: "16:00", available: true }
        ]
      }
    ]
  },
  {
    id: 16,
    name: {
      NO: "Holmestrand Svømmehall",
      EN: "Holmestrand Swimming Pool"
    },
    address: "Storgata 25, 3080 Holmestrand",
    address_street: "Storgata 25",
    address_city: "Holmestrand",
    address_postal_code: "3080",
    address_country: "Norway",
    type: "Svømmehall",
    area: "Holmestrand",
    status: 'active',
    image: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
    image_url: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
    next_available: "Tirsdag, 07:00",
    capacity: 180,
    accessibility_features: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Svømming", "Vanngymnastikk", "Barneskole", "Kurs"],
      EN: ["Swimming", "Water aerobics", "Primary school", "Courses"]
    },
    equipment: {
      NO: ["25m basseng", "Varmbasseng", "Badstue", "Garderober", "Kafeteria"],
      EN: ["25m pool", "Warm pool", "Sauna", "Changing rooms", "Cafeteria"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "06:00", closes: "21:00" },
      { dayOfWeek: 2, opens: "06:00", closes: "21:00" },
      { dayOfWeek: 3, opens: "06:00", closes: "21:00" },
      { dayOfWeek: 4, opens: "06:00", closes: "21:00" },
      { dayOfWeek: 5, opens: "06:00", closes: "21:00" },
      { dayOfWeek: 6, opens: "09:00", closes: "18:00" }
    ],
    description: {
      NO: "Moderne svømmeanlegg med varmebasseng og badstue. Familievennlig med gode Lokaler.",
      EN: "Modern swimming facility with warm pool and sauna. Family-friendly with excellent facilities."
    },
    rating: 4.2,
    review_count: 41,
    price_per_hour: 550,
    amenities: {
      NO: ["25m basseng", "Varmbasseng", "Badstue", "Garderober", "Kafeteria"],
      EN: ["25m pool", "Warm pool", "Sauna", "Changing rooms", "Cafeteria"]
    },
    has_auto_approval: true,
    lat: 59.4894,
    lng: 10.3123,
    latitude: 59.4894,
    longitude: 10.3123,
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
        date: new Date(2025, 5, 10),
        slots: [
          { start: "07:00", end: "09:00", available: true },
          { start: "09:00", end: "11:00", available: true }
        ]
      }
    ]
  }
];
