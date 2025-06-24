
export const coreFacilities = [
  {
    id: 1,
    name: { NO: "Brandengen Skole - Gymsal", EN: "Brandengen School - Gymnasium" },
    address_street: "Iver Holters gate 48",
    address_city: "Drammen",
    address_postal_code: "3041",
    address_country: "Norway",
    type: "Gymsal",
    area: "Bragernes",
    status: "active",
    capacity: 120,
    price_per_hour: 500,
    has_auto_approval: false,
    time_slot_duration: 1,
    latitude: 59.7464,
    longitude: 10.2045,
    accessibility_features: ["wheelchair", "hearing-loop"],
    allowed_booking_types: ['engangs', 'fastlan', 'rammetid', 'strotimer'],
    season_from: "2024-01-01",
    season_to: "2024-12-31",
    booking_lead_time_hours: 2,
    max_advance_booking_days: 365,
    cancellation_deadline_hours: 24,
    is_featured: false,
    description: {
      NO: "En moderne gymsal med høy standard og god ventilasjon. Ideell for ballsport og større arrangementer.",
      EN: "A modern gymnasium with high standards and good ventilation. Ideal for ball sports and larger events."
    },
    suitableFor: {
      NO: ["Basketball", "Volleyball", "Håndball", "Badminton"],
      EN: ["Basketball", "Volleyball", "Handball", "Badminton"]
    },
    equipment: {
      NO: ["Basketkurver", "Volleyballnett", "Lydsystem", "Projektor"],
      EN: ["Basketball hoops", "Volleyball net", "Sound system", "Projector"]
    },
    amenities: {
      NO: ["Basketkurver", "Volleyballnett", "Lydsystem", "Projektor"],
      EN: ["Basketball hoops", "Volleyball net", "Sound system", "Projector"]
    }
  },
  {
    id: 2,
    name: { NO: "Fjell Skole - Aktivitetshall", EN: "Fjell School - Activity Hall" },
    address_street: "Lauritz Hervigs vei 20",
    address_city: "Drammen",
    address_postal_code: "3035",
    address_country: "Norway",
    type: "Aktivitetshall",
    area: "Konnerud",
    status: "active",
    capacity: 200,
    price_per_hour: 650,
    has_auto_approval: false,
    time_slot_duration: 1,
    latitude: 59.7298,
    longitude: 10.1845,
    accessibility_features: ["wheelchair"],
    allowed_booking_types: ['engangs', 'fastlan', 'rammetid', 'strotimer'],
    season_from: "2024-01-01",
    season_to: "2024-12-31",
    booking_lead_time_hours: 2,
    max_advance_booking_days: 365,
    cancellation_deadline_hours: 24,
    is_featured: false,
    description: {
      NO: "Stor aktivitetshall med mulighet for både sport og kulturarrangementer. God akustikk og moderne fasiliteter.",
      EN: "Large activity hall suitable for both sports and cultural events. Good acoustics and modern facilities."
    },
    suitableFor: {
      NO: ["Fotball", "Innebandy", "Dans", "Konsert"],
      EN: ["Football", "Floorball", "Dance", "Concert"]
    },
    equipment: {
      NO: ["Fotballmål", "Lydanlegg", "Scene", "Garderober"],
      EN: ["Football goals", "Sound system", "Stage", "Changing rooms"]
    },
    amenities: {
      NO: ["Fotballmål", "Lydanlegg", "Scene", "Garderober"],
      EN: ["Football goals", "Sound system", "Stage", "Changing rooms"]
    }
  }
];
