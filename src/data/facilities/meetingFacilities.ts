
import { LocalizedFacility } from '@/types/localization';

export const meetingFacilities: LocalizedFacility[] = [
  {
    id: 4,
    name: {
      NO: "Marienlyst Stadion - Møtesal",
      EN: "Marienlyst Stadium - Meeting Room"
    },
    address: "Schwartz gate 2, 3043 Drammen",
    type: "Møtesal",
    area: "Strømsø",
    status: 'active',
    image: "/lovable-uploads/07eaca70-1e9b-4e73-ab4e-6b9b7f1ca27e.png",
    nextAvailable: "Lørdag, 10:00",
    capacity: 80,
    accessibility: ["wheelchair"],
    suitableFor: {
      NO: ["Møter", "Kurs", "Workshops", "Seminarer"],
      EN: ["Meetings", "Courses", "Workshops", "Seminars"]
    },
    equipment: {
      NO: ["Whiteboard", "Projektor", "WiFi", "Kaffe/te", "Flipchart"],
      EN: ["Whiteboard", "Projector", "WiFi", "Coffee/tea", "Flipchart"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "07:00", closes: "20:00" },
      { dayOfWeek: 2, opens: "07:00", closes: "20:00" },
      { dayOfWeek: 3, opens: "07:00", closes: "20:00" },
      { dayOfWeek: 4, opens: "07:00", closes: "20:00" },
      { dayOfWeek: 5, opens: "07:00", closes: "20:00" },
      { dayOfWeek: 6, opens: "09:00", closes: "16:00" }
    ],
    description: {
      NO: "Romslig møtesal med naturlig lys og moderne konferanseutstyr. Ideell for bedriftsmøter og kursvirksomhet.",
      EN: "Spacious meeting room with natural light and modern conference equipment. Ideal for business meetings and training activities."
    },
    rating: 4.1,
    reviewCount: 18,
    pricePerHour: 450,
    amenities: {
      NO: ["Whiteboard", "Projektor", "WiFi", "Kaffe/te", "Flipchart"],
      EN: ["Whiteboard", "Projector", "WiFi", "Coffee/tea", "Flipchart"]
    },
    hasAutoApproval: true,
    lat: 59.7389,
    lng: 10.2167,
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
          { start: "10:00", end: "12:00", available: true },
          { start: "12:00", end: "14:00", available: true }
        ]
      }
    ]
  },
  {
    id: 7,
    name: {
      NO: "Drammen Bibliotek - Møterom",
      EN: "Drammen Library - Meeting Room"
    },
    address: "Grønland 32, 3045 Drammen",
    type: "Møterom",
    area: "Bragernes",
    status: 'active',
    image: "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
    nextAvailable: "Mandag, 09:00",
    capacity: 25,
    accessibility: ["wheelchair", "hearing-loop", "sign-language"],
    suitableFor: {
      NO: ["Møter", "Studiegrupper", "Workshops", "Lesninger"],
      EN: ["Meetings", "Study groups", "Workshops", "Readings"]
    },
    equipment: {
      NO: ["Whiteboard", "Projektor", "WiFi", "Bøker", "Stilleområde"],
      EN: ["Whiteboard", "Projector", "WiFi", "Books", "Quiet area"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "09:00", closes: "20:00" },
      { dayOfWeek: 2, opens: "09:00", closes: "20:00" },
      { dayOfWeek: 3, opens: "09:00", closes: "20:00" },
      { dayOfWeek: 4, opens: "09:00", closes: "20:00" },
      { dayOfWeek: 5, opens: "09:00", closes: "20:00" },
      { dayOfWeek: 6, opens: "10:00", closes: "16:00" }
    ],
    description: {
      NO: "Rolig møterom i biblioteket med tilgang til forskningsressurser og stille arbeidsmiljø.",
      EN: "Quiet meeting room in the library with access to research resources and peaceful working environment."
    },
    rating: 4.3,
    reviewCount: 27,
    pricePerHour: 200,
    amenities: {
      NO: ["Whiteboard", "Projektor", "WiFi", "Bøker", "Stilleområde"],
      EN: ["Whiteboard", "Projector", "WiFi", "Books", "Quiet area"]
    },
    hasAutoApproval: true,
    lat: 59.7423,
    lng: 10.2056,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 5, 2),
        slots: [
          { start: "09:00", end: "11:00", available: true },
          { start: "11:00", end: "13:00", available: true },
          { start: "13:00", end: "15:00", available: false },
          { start: "15:00", end: "17:00", available: true }
        ]
      }
    ]
  },
  {
    id: 10,
    name: {
      NO: "Tangen Skole - Klasserom",
      EN: "Tangen School - Classroom"
    },
    address: "Tangenvegen 45, 3047 Drammen",
    type: "Klasserom",
    area: "Tangen",
    status: 'active',
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    nextAvailable: "Onsdag, 17:00",
    capacity: 30,
    accessibility: ["wheelchair"],
    suitableFor: {
      NO: ["Undervisning", "Kurs", "Studiegrupper", "Seminarer"],
      EN: ["Teaching", "Courses", "Study groups", "Seminars"]
    },
    equipment: {
      NO: ["Tavle", "Projektor", "WiFi", "Stoler", "Bord"],
      EN: ["Blackboard", "Projector", "WiFi", "Chairs", "Tables"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "16:00", closes: "21:00" },
      { dayOfWeek: 2, opens: "16:00", closes: "21:00" },
      { dayOfWeek: 3, opens: "16:00", closes: "21:00" },
      { dayOfWeek: 4, opens: "16:00", closes: "21:00" },
      { dayOfWeek: 5, opens: "16:00", closes: "21:00" },
      { dayOfWeek: 6, opens: "10:00", closes: "16:00" }
    ],
    description: {
      NO: "Praktisk klasserom med god belysning og moderne undervisningsutstyr.",
      EN: "Practical classroom with good lighting and modern teaching equipment."
    },
    rating: 4.0,
    reviewCount: 12,
    pricePerHour: 250,
    amenities: {
      NO: ["Tavle", "Projektor", "WiFi", "Stoler", "Bord"],
      EN: ["Blackboard", "Projector", "WiFi", "Chairs", "Tables"]
    },
    hasAutoApproval: true,
    lat: 59.7512,
    lng: 10.2234,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 5, 4),
        slots: [
          { start: "17:00", end: "19:00", available: true },
          { start: "19:00", end: "21:00", available: false }
        ]
      }
    ]
  },
  {
    id: 12,
    name: {
      NO: "Buskerud Rådhus - Forsamlingssal",
      EN: "Buskerud City Hall - Assembly Hall"
    },
    address: "Gamle Kirkeplass 3, 3012 Drammen",
    type: "Forsamlingssal",
    area: "Bragernes",
    status: 'active',
    image: "/lovable-uploads/b692664c-737a-4a20-8673-25a401789f82.png",
    nextAvailable: "Fredag, 14:00",
    capacity: 100,
    accessibility: ["wheelchair", "hearing-loop", "sign-language"],
    suitableFor: {
      NO: ["Offentlige møter", "Konferanser", "Presentasjoner", "Debatter"],
      EN: ["Public meetings", "Conferences", "Presentations", "Debates"]
    },
    equipment: {
      NO: ["Mikrofoner", "Projektor", "Lyd-/videoutstyr", "Wifi", "Tolketjenester"],
      EN: ["Microphones", "Projector", "Audio/video equipment", "WiFi", "Interpretation services"]
    },
    openingHours: [
      { dayOfWeek: 1, opens: "08:00", closes: "16:00" },
      { dayOfWeek: 2, opens: "08:00", closes: "16:00" },
      { dayOfWeek: 3, opens: "08:00", closes: "16:00" },
      { dayOfWeek: 4, opens: "08:00", closes: "16:00" },
      { dayOfWeek: 5, opens: "08:00", closes: "16:00" },
      { dayOfWeek: 6, opens: "08:00", closes: "16:00" }
    ],
    description: {
      NO: "Representativ forsamlingssal i rådhuset med full teknisk utrustning for offentlige arrangementer.",
      EN: "Representative assembly hall in the city hall with full technical equipment for public events."
    },
    rating: 4.4,
    reviewCount: 22,
    pricePerHour: 600,
    amenities: {
      NO: ["Mikrofoner", "Projektor", "Lyd-/videoutstyr", "Wifi", "Tolketjenester"],
      EN: ["Microphones", "Projector", "Audio/video equipment", "WiFi", "Interpretation services"]
    },
    hasAutoApproval: false,
    lat: 59.7445,
    lng: 10.2089,
    season: {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
    zones: [],
    availableTimes: [
      {
        date: new Date(2025, 5, 6),
        slots: [
          { start: "14:00", end: "16:00", available: true }
        ]
      }
    ]
  }
];
