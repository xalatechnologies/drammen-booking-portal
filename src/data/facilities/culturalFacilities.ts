
import { LocalizedFacility } from '@/types/localization';

export const culturalFacilities: LocalizedFacility[] = [
  {
    id: 3,
    name: {
      NO: "Gulskogen Skole - Auditorium",
      EN: "Gulskogen School - Auditorium"
    },
    address: "Vintergata 8, 3048 Drammen",
    type: "Auditorium",
    area: "Gulskogen",
    status: 'active',
    image: "/lovable-uploads/b692664c-737a-4a20-8673-25a401789f82.png",
    nextAvailable: "Torsdag, 19:00",
    capacity: 150,
    accessibility: ["wheelchair", "hearing-loop", "sign-language"],
    suitableFor: {
      NO: ["Presentasjoner", "Teater", "Konferanser", "Filmvisning"],
      EN: ["Presentations", "Theatre", "Conferences", "Film screenings"]
    },
    equipment: {
      NO: ["Projektor", "Lydsystem", "Mikrofoner", "Scene", "Lysrigger"],
      EN: ["Projector", "Sound system", "Microphones", "Stage", "Lighting rig"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 2, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 3, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 4, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 5, opens: "08:00", closes: "22:00" },
      { dayOfWeek: 6, opens: "10:00", closes: "18:00" }
    ],
    description: {
      NO: "Profesjonelt auditorium med scenebelysning og høykvalitets lyd- og bildeutstyr. Perfekt for større arrangementer.",
      EN: "Professional auditorium with stage lighting and high-quality audio-visual equipment. Perfect for larger events."
    },
    rating: 4.6,
    reviewCount: 31,
    pricePerHour: 800,
    amenities: {
      NO: ["Projektor", "Lydsystem", "Mikrofoner", "Scene", "Lysrigger"],
      EN: ["Projector", "Sound system", "Microphones", "Stage", "Lighting rig"]
    },
    hasAutoApproval: false,
    lat: 59.7512,
    lng: 10.1689,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 4, 27),
        slots: [
          { start: "19:00", end: "21:00", available: true }
        ]
      }
    ]
  },
  {
    id: 8,
    name: {
      NO: "Strømsø Samfunnshus - Festsal",
      EN: "Strømsø Community House - Banquet Hall"
    },
    address: "Nedre Storgate 15, 3044 Drammen",
    type: "Festsal",
    area: "Strømsø",
    status: 'active',
    image: "/lovable-uploads/1d336434-5d93-4af7-8f92-32867c579c2a.png",
    nextAvailable: "Fredag, 20:00",
    capacity: 180,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Bryllup", "Konfirmasjon", "Kulturarrangementer", "Dans"],
      EN: ["Weddings", "Confirmations", "Cultural events", "Dancing"]
    },
    equipment: {
      NO: ["Scene", "Lydanlegg", "Dansegulv", "Kjøkken", "Bar"],
      EN: ["Stage", "Sound system", "Dance floor", "Kitchen", "Bar"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "10:00", closes: "24:00" },
      { dayOfWeek: 2, opens: "10:00", closes: "24:00" },
      { dayOfWeek: 3, opens: "10:00", closes: "24:00" },
      { dayOfWeek: 4, opens: "10:00", closes: "24:00" },
      { dayOfWeek: 5, opens: "10:00", closes: "24:00" },
      { dayOfWeek: 6, opens: "10:00", closes: "24:00" }
    ],
    description: {
      NO: "Tradisjonell festsal med historisk charme. Perfekt for store feiringer og kulturelle arrangementer.",
      EN: "Traditional banquet hall with historic charm. Perfect for large celebrations and cultural events."
    },
    rating: 4.5,
    reviewCount: 64,
    pricePerHour: 1200,
    amenities: {
      NO: ["Scene", "Lydanlegg", "Dansegulv", "Kjøkken", "Bar"],
      EN: ["Stage", "Sound system", "Dance floor", "Kitchen", "Bar"]
    },
    hasAutoApproval: false,
    lat: 59.7401,
    lng: 10.2134,
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
          { start: "20:00", end: "24:00", available: true }
        ]
      }
    ]
  },
  {
    id: 9,
    name: {
      NO: "Konnerud Kultursenter - Studio",
      EN: "Konnerud Cultural Center - Studio"
    },
    address: "Konnerudgata 15, 3036 Drammen",
    type: "Studio",
    area: "Konnerud",
    status: 'active',
    image: "/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png",
    nextAvailable: "Tirsdag, 16:00",
    capacity: 40,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Musikk", "Dans", "Yoga", "Teater"],
      EN: ["Music", "Dance", "Yoga", "Theatre"]
    },
    equipment: {
      NO: ["Speil", "Lydanlegg", "Piano", "Yogamatter", "Belysning"],
      EN: ["Mirrors", "Sound system", "Piano", "Yoga mats", "Lighting"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "09:00", closes: "22:00" },
      { dayOfWeek: 2, opens: "09:00", closes: "22:00" },
      { dayOfWeek: 3, opens: "09:00", closes: "22:00" },
      { dayOfWeek: 4, opens: "09:00", closes: "22:00" },
      { dayOfWeek: 5, opens: "09:00", closes: "22:00" },
      { dayOfWeek: 6, opens: "10:00", closes: "20:00" }
    ],
    description: {
      NO: "Fleksibelt studio med høy standard. Perfekt for kreative aktiviteter og treningsgrupper.",
      EN: "Flexible studio with high standards. Perfect for creative activities and exercise groups."
    },
    rating: 4.6,
    reviewCount: 38,
    pricePerHour: 350,
    amenities: {
      NO: ["Speil", "Lydanlegg", "Piano", "Yogamatter", "Belysning"],
      EN: ["Mirrors", "Sound system", "Piano", "Yoga mats", "Lighting"]
    },
    hasAutoApproval: true,
    lat: 59.7356,
    lng: 10.1923,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 5, 3),
        slots: [
          { start: "16:00", end: "18:00", available: true },
          { start: "18:00", end: "20:00", available: true }
        ]
      }
    ]
  },
  {
    id: 13,
    name: {
      NO: "Svelvik Kulturhus - Teatersal",
      EN: "Svelvik Cultural House - Theatre Hall"
    },
    address: "Rådhusgata 12, 3060 Svelvik",
    type: "Teatersal",
    area: "Svelvik",
    status: 'active',
    image: "/lovable-uploads/1d336434-5d93-4af7-8f92-32867c579c2a.png",
    nextAvailable: "Lørdag, 19:30",
    capacity: 220,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Teater", "Konserter", "Stand-up", "Forestillinger"],
      EN: ["Theatre", "Concerts", "Stand-up", "Performances"]
    },
    equipment: {
      NO: ["Scene", "Lysrigg", "Lydanlegg", "Kostymeavdeling", "Billettluke"],
      EN: ["Stage", "Lighting rig", "Sound system", "Costume department", "Box office"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "18:00", closes: "23:00" },
      { dayOfWeek: 2, opens: "18:00", closes: "23:00" },
      { dayOfWeek: 3, opens: "18:00", closes: "23:00" },
      { dayOfWeek: 4, opens: "18:00", closes: "23:00" },
      { dayOfWeek: 5, opens: "18:00", closes: "23:00" },
      { dayOfWeek: 6, opens: "18:00", closes: "23:00" }
    ],
    description: {
      NO: "Profesjonell teatersal med fullt utstyrt scene og god akustikk for kulturelle opplevelser.",
      EN: "Professional theatre hall with fully equipped stage and excellent acoustics for cultural experiences."
    },
    rating: 4.7,
    reviewCount: 45,
    pricePerHour: 950,
    amenities: {
      NO: ["Scene", "Lysrigg", "Lydanlegg", "Kostymeavdeling", "Billettluke"],
      EN: ["Stage", "Lighting rig", "Sound system", "Costume department", "Box office"]
    },
    hasAutoApproval: false,
    lat: 59.6123,
    lng: 10.4056,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 5, 7),
        slots: [
          { start: "19:30", end: "22:00", available: true }
        ]
      }
    ]
  },
  {
    id: 14,
    name: {
      NO: "Drammen Ungdomshus - Aktivitetsrom",
      EN: "Drammen Youth House - Activity Room"
    },
    address: "Øvre Sund 15, 3017 Drammen",
    type: "Aktivitetsrom",
    area: "Strømsø",
    status: 'active',
    image: "/lovable-uploads/07eaca70-1e9b-4e73-ab4e-6b9b7f1ca27e.png",
    nextAvailable: "Mandag, 18:00",
    capacity: 60,
    accessibility: ["wheelchair"],
    suitableFor: {
      NO: ["Ungdomsaktiviteter", "Gaming", "Musikk", "Sosiale treff"],
      EN: ["Youth activities", "Gaming", "Music", "Social gatherings"]
    },
    equipment: {
      NO: ["Gaming-setup", "Lydanlegg", "Instrumenter", "Spillkonsoll", "WiFi"],
      EN: ["Gaming setup", "Sound system", "Instruments", "Game consoles", "WiFi"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "15:00", closes: "22:00" },
      { dayOfWeek: 2, opens: "15:00", closes: "22:00" },
      { dayOfWeek: 3, opens: "15:00", closes: "22:00" },
      { dayOfWeek: 4, opens: "15:00", closes: "22:00" },
      { dayOfWeek: 5, opens: "15:00", closes: "22:00" },
      { dayOfWeek: 6, opens: "12:00", closes: "20:00" }
    ],
    description: {
      NO: "Moderne ungdomslokale med gaming og musikk-utstyr. Perfekt for ungdomsgrupper og sosiale aktiviteter.",
      EN: "Modern youth facility with gaming and music equipment. Perfect for youth groups and social activities."
    },
    rating: 4.3,
    reviewCount: 29,
    pricePerHour: 300,
    amenities: {
      NO: ["Gaming-setup", "Lydanlegg", "Instrumenter", "Spillkonsoll", "WiFi"],
      EN: ["Gaming setup", "Sound system", "Instruments", "Game consoles", "WiFi"]
    },
    hasAutoApproval: true,
    lat: 59.7398,
    lng: 10.2178,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 5, 8),
        slots: [
          { start: "18:00", end: "20:00", available: true },
          { start: "20:00", end: "22:00", available: true }
        ]
      }
    ]
  },
  {
    id: 15,
    name: {
      NO: "Bragernes Kirke - Menighetsal",
      EN: "Bragernes Church - Parish Hall"
    },
    address: "Bragernes Torg 3, 3017 Drammen",
    type: "Menighetsal",
    area: "Bragernes",
    status: 'active',
    image: "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
    nextAvailable: "Søndag, 14:00",
    capacity: 90,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Religiøse møter", "Konserter", "Begravelser", "Bryllup"],
      EN: ["Religious meetings", "Concerts", "Funerals", "Weddings"]
    },
    equipment: {
      NO: ["Orgel", "Lydanlegg", "Lysanlegg", "Kjøkken", "Servering"],
      EN: ["Organ", "Sound system", "Lighting", "Kitchen", "Catering"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "10:00", closes: "16:00" },
      { dayOfWeek: 2, opens: "10:00", closes: "16:00" },
      { dayOfWeek: 3, opens: "10:00", closes: "16:00" },
      { dayOfWeek: 4, opens: "10:00", closes: "16:00" },
      { dayOfWeek: 5, opens: "10:00", closes: "16:00" },
      { dayOfWeek: 6, opens: "08:00", closes: "15:00" }
    ],
    description: {
      NO: "Vakker menighetsal med historisk atmosfære og flott akustikk for konserter og seremonier.",
      EN: "Beautiful parish hall with historic atmosphere and excellent acoustics for concerts and ceremonies."
    },
    rating: 4.5,
    reviewCount: 34,
    pricePerHour: 400,
    amenities: {
      NO: ["Orgel", "Lydanlegg", "Lysanlegg", "Kjøkken", "Servering"],
      EN: ["Organ", "Sound system", "Lighting", "Kitchen", "Catering"]
    },
    hasAutoApproval: false,
    lat: 59.7434,
    lng: 10.2067,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 5, 9),
        slots: [
          { start: "14:00", end: "16:00", available: true }
        ]
      }
    ]
  },
  {
    id: 999,
    name: {
      NO: "Storsal Kulturhus - Multisone",
      EN: "Grand Hall Cultural Center - Multizone"
    },
    address: "Storgata 15, Drammen",
    type: "Kulturlokale",
    area: "Drammen sentrum",
    status: 'active',
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    nextAvailable: "I dag, 16:00",
    capacity: 200,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Teater", "Konsert", "Konferanser", "Workshop"],
      EN: ["Theater", "Concert", "Conference", "Workshop"]
    },
    equipment: {
      NO: ["Scene", "Lydanlegg", "Lysrigger", "Projektor"],
      EN: ["Stage", "Sound System", "Light Rig", "Projector"]
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
      NO: "Storsal med flere avdelinger som kan brukes separat eller sammen. Perfekt for teater, konserter, konferanser og workshops med fleksible romløsninger.",
      EN: "Grand hall with multiple sections that can be used separately or together. Perfect for theater, concerts, conferences and workshops with flexible room solutions."
    },
    rating: 4.8,
    reviewCount: 45,
    pricePerHour: 800,
    amenities: {
      NO: ["Scene", "Profesjonelt lydanlegg", "Garderober"],
      EN: ["Stage", "Professional Sound System", "Dressing Rooms"]
    },
    hasAutoApproval: false,
    timeSlotDuration: 1,
    lat: 59.7456,
    lng: 10.2023,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: []
  }
];
