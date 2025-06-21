
import { CoreFacility } from '@/types/translation';

export const coreFacilities: CoreFacility[] = [
  {
    id: 1,
    address_street: "Iver Holters gate 48",
    address_city: "Drammen",
    address_postal_code: "3041",
    address_country: "Norway",
    type: "Gymsal",
    area: "Bragernes",
    status: 'active',
    image_url: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    next_available: "I dag, 18:00",
    capacity: 120,
    accessibility_features: ["wheelchair", "hearing-loop"],
    openingHours: [
      { dayOfWeek: 1, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 2, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 3, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 4, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 5, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 6, opens: "10:00", closes: "20:00" },
      { dayOfWeek: 0, opens: "10:00", closes: "20:00" }
    ],
    rating: 4.2,
    review_count: 15,
    price_per_hour: 500,
    has_auto_approval: false,
    latitude: 59.7464,
    longitude: 10.2045,
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
    address_street: "Lauritz Hervigs vei 20",
    address_city: "Drammen",
    address_postal_code: "3035",
    address_country: "Norway",
    type: "Aktivitetshall",
    area: "Konnerud",
    status: 'active',
    image_url: "/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png",
    next_available: "Fredag, 17:00",
    capacity: 200,
    accessibility_features: ["wheelchair"],
    openingHours: [
      { dayOfWeek: 1, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 2, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 3, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 4, opens: "07:00", closes: "23:00" },
      { dayOfWeek: 5, opens: "07:00", closes: "24:00" },
      { dayOfWeek: 6, opens: "09:00", closes: "22:00" },
      { dayOfWeek: 0, opens: "09:00", closes: "22:00" }
    ],
    rating: 4.5,
    review_count: 23,
    price_per_hour: 650,
    has_auto_approval: false,
    latitude: 59.7298,
    longitude: 10.1845,
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
    id: 5,
    address_street: "Danvikgata 40",
    address_city: "Drammen",
    address_postal_code: "3045",
    address_country: "Norway",
    type: "Svømmehall",
    area: "Åssiden",
    status: 'active',
    image_url: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
    next_available: "Søndag, 12:00",
    capacity: 250,
    accessibility_features: ["wheelchair", "hearing-loop"],
    openingHours: [
      { dayOfWeek: 1, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 2, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 3, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 4, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 5, opens: "06:00", closes: "22:00" },
      { dayOfWeek: 6, opens: "08:00", closes: "20:00" }
    ],
    rating: 4.7,
    review_count: 89,
    price_per_hour: 700,
    has_auto_approval: false,
    latitude: 59.7545,
    longitude: 10.1798,
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
        date: new Date(2025, 5, 1),
        slots: [
          { start: "12:00", end: "14:00", available: true },
          { start: "14:00", end: "16:00", available: true }
        ]
      }
    ]
  }
];
