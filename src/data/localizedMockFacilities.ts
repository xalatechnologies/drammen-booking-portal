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
    lat: 59.7464,
    lng: 10.2045,
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
    lat: 59.7298,
    lng: 10.1845,
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
      NO: "Gulskogen Skole - Auditorium",
      EN: "Gulskogen School - Auditorium"
    },
    address: "Vintergata 8, 3048 Drammen",
    type: "Auditorium",
    area: "Gulskogen",
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
    openingHours: "Man-Fre: 08:00-22:00, Lør: 10:00-18:00, Søn: Stengt",
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
    id: 4,
    name: {
      NO: "Marienlyst Stadion - Møtesal",
      EN: "Marienlyst Stadium - Meeting Room"
    },
    address: "Schwartz gate 2, 3043 Drammen",
    type: "Møtesal",
    area: "Strømsø",
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
    openingHours: "Man-Fre: 07:00-20:00, Lør: 09:00-16:00, Søn: Stengt",
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
    id: 5,
    name: {
      NO: "Drammensbadet - Svømmehall",
      EN: "Drammensbadet - Swimming Pool"
    },
    address: "Danvikgata 40, 3045 Drammen",
    type: "Svømmehall",
    area: "Åssiden",
    image: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
    nextAvailable: "Søndag, 12:00",
    capacity: 250,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Svømming", "Vanngymnastikk", "Svømmeopplæring", "Konkurranser"],
      EN: ["Swimming", "Water aerobics", "Swimming lessons", "Competitions"]
    },
    equipment: {
      NO: ["25m basseng", "Barnebassseng", "Garderober", "Dusjer", "Livredningsutstyr"],
      EN: ["25m pool", "Children's pool", "Changing rooms", "Showers", "Safety equipment"]
    },
    openingHours: "Man-Fre: 06:00-22:00, Lør-Søn: 08:00-20:00",
    description: {
      NO: "Moderne svømmeanlegg med både konkurransebasseng og barneområde. Høy standard på fasiliteter og sikkerhet.",
      EN: "Modern swimming facility with both competition pool and children's area. High standard facilities and safety measures."
    },
    rating: 4.7,
    reviewCount: 89,
    pricePerHour: 700,
    amenities: {
      NO: ["25m basseng", "Barnebassseng", "Garderober", "Dusjer", "Livredningsutstyr"],
      EN: ["25m pool", "Children's pool", "Changing rooms", "Showers", "Safety equipment"]
    },
    hasAutoApproval: false,
    lat: 59.7545,
    lng: 10.1798,
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
    id: 6,
    name: {
      NO: "Åssiden Fotballhall",
      EN: "Åssiden Football Hall"
    },
    address: "Buskerudveien 54, 3024 Drammen",
    type: "Fotballhall",
    area: "Åssiden",
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
    openingHours: "Man-Søn: 07:00-23:00",
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
    id: 7,
    name: {
      NO: "Drammen Bibliotek - Møterom",
      EN: "Drammen Library - Meeting Room"
    },
    address: "Grønland 32, 3045 Drammen",
    type: "Møterom",
    area: "Bragernes",
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
    openingHours: "Man-Fre: 09:00-20:00, Lør: 10:00-16:00, Søn: 12:00-17:00",
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
    id: 8,
    name: {
      NO: "Strømsø Samfunnshus - Festsal",
      EN: "Strømsø Community House - Banquet Hall"
    },
    address: "Nedre Storgate 15, 3044 Drammen",
    type: "Festsal",
    area: "Strømsø",
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
    openingHours: "Man-Søn: 10:00-24:00",
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
    openingHours: "Man-Fre: 09:00-22:00, Lør: 10:00-20:00, Søn: 12:00-18:00",
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
    id: 10,
    name: {
      NO: "Tangen Skole - Klasserom",
      EN: "Tangen School - Classroom"
    },
    address: "Tangenvegen 45, 3047 Drammen",
    type: "Klasserom",
    area: "Tangen",
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
    openingHours: "Man-Fre: 16:00-21:00, Lør: 10:00-16:00, Søn: Stengt",
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
    id: 11,
    name: {
      NO: "Ytterkollen Idrettshall",
      EN: "Ytterkollen Sports Hall"
    },
    address: "Ytterkollveien 78, 3037 Drammen",
    type: "Idrettshall",
    area: "Konnerud",
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
    openingHours: "Man-Søn: 06:00-23:30",
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
    id: 12,
    name: {
      NO: "Buskerud Rådhus - Forsamlingssal",
      EN: "Buskerud City Hall - Assembly Hall"
    },
    address: "Gamle Kirkeplass 3, 3012 Drammen",
    type: "Forsamlingssal",
    area: "Bragernes",
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
    openingHours: "Man-Fre: 08:00-16:00, Lør-Søn: Kun ved avtale",
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
    availableTimes: [
      {
        date: new Date(2025, 5, 6),
        slots: [
          { start: "14:00", end: "16:00", available: true }
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
    openingHours: "Man-Søn: 18:00-23:00, eller ved arrangement",
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
    openingHours: "Man-Fre: 15:00-22:00, Lør: 12:00-20:00, Søn: Stengt",
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
    openingHours: "Man-Fre: 10:00-16:00, Søn: 08:00-15:00, Lør: Kun ved avtale",
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
    id: 16,
    name: {
      NO: "Holmestrand Svømmehall",
      EN: "Holmestrand Swimming Pool"
    },
    address: "Storgata 25, 3080 Holmestrand",
    type: "Svømmehall",
    area: "Holmestrand",
    image: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
    nextAvailable: "Tirsdag, 07:00",
    capacity: 180,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: {
      NO: ["Svømming", "Vanngymnastikk", "Barneskole", "Kurs"],
      EN: ["Swimming", "Water aerobics", "Primary school", "Courses"]
    },
    equipment: {
      NO: ["25m basseng", "Varmbasseng", "Badstue", "Garderober", "Kafeteria"],
      EN: ["25m pool", "Warm pool", "Sauna", "Changing rooms", "Cafeteria"]
    },
    openingHours: "Man-Fre: 06:00-21:00, Lør-Søn: 09:00-18:00",
    description: {
      NO: "Moderne svømmeanlegg med varmebasseng og badstue. Familievennlig med gode fasiliteter.",
      EN: "Modern swimming facility with warm pool and sauna. Family-friendly with excellent facilities."
    },
    rating: 4.2,
    reviewCount: 41,
    pricePerHour: 550,
    amenities: {
      NO: ["25m basseng", "Varmbasseng", "Badstue", "Garderober", "Kafeteria"],
      EN: ["25m pool", "Warm pool", "Sauna", "Changing rooms", "Cafeteria"]
    },
    hasAutoApproval: true,
    lat: 59.4894,
    lng: 10.3123,
    availableTimes: [
      {
        date: new Date(2025, 5, 10),
        slots: [
          { start: "07:00", end: "09:00", available: true },
          { start: "09:00", end: "11:00", available: true }
        ]
      }
    ]
  },
  {
    id: 999,
    translations: {
      NO: {
        name: "Storsal Kulturhus - Multisone",
        description: "Storsal med flere avdelinger som kan brukes separat eller sammen. Perfekt for teater, konserter, konferanser og workshops med fleksible romløsninger.",
        type: "Kulturlokale",
        area: "Drammen sentrum",
        suitableFor: ["Teater", "Konsert", "Konferanser", "Workshop"],
        equipment: ["Scene", "Lydanlegg", "Lysrigger", "Projektor"],
        amenities: ["Scene", "Profesjonelt lydanlegg", "Garderober"],
      },
      EN: {
        name: "Grand Hall Cultural Center - Multizone",
        description: "Grand hall with multiple sections that can be used separately or together. Perfect for theater, concerts, conferences and workshops with flexible room solutions.",
        type: "Cultural Facility",
        area: "Drammen Center",
        suitableFor: ["Theater", "Concert", "Conference", "Workshop"],
        equipment: ["Stage", "Sound System", "Light Rig", "Projector"],
        amenities: ["Stage", "Professional Sound System", "Dressing Rooms"],
      }
    },
    address: "Storgata 15, Drammen",
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    nextAvailable: "I dag, 16:00",
    capacity: 200,
    accessibility: ["Rullestoltilgjengelig", "Hørselssløyfe"],
    openingHours: "Man-Fre: 08:00-22:00, Lør-Søn: 10:00-20:00",
    rating: 4.8,
    reviewCount: 45,
    pricePerHour: 800,
    hasAutoApproval: false,
    timeSlotDuration: 1
  },
  {
    id: 998,
    translations: {
      NO: {
        name: "Idrettshall Mjøndalen - Fleksibel",
        description: "Moderne idrettshall med tre separate soner som kan kombineres. Ideell for håndball, basketball, volleyball og badminton med mulighet for samtidig bruk av flere områder.",
        type: "Idrettshall",
        area: "Mjøndalen",
        suitableFor: ["Håndball", "Basketball", "Volleyball", "Badminton"],
        equipment: ["Basketkurver", "Håndballmål", "Nettstolper", "Tribuner"],
        amenities: ["Moderne utstyr", "God ventilasjon", "Garderober"],
      },
      EN: {
        name: "Mjøndalen Sports Hall - Flexible",
        description: "Modern sports hall with three separate zones that can be combined. Ideal for handball, basketball, volleyball and badminton with the possibility of simultaneous use of multiple areas.",
        type: "Sports Hall", 
        area: "Mjøndalen",
        suitableFor: ["Handball", "Basketball", "Volleyball", "Badminton"],
        equipment: ["Basketball Hoops", "Handball Goals", "Net Posts", "Stands"],
        amenities: ["Modern Equipment", "Good Ventilation", "Changing Rooms"],
      }
    },
    address: "Idrettsveien 22, Mjøndalen",
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    nextAvailable: "I morgen, 09:00", 
    capacity: 150,
    accessibility: ["Rullestoltilgjengelig"],
    openingHours: "Man-Fre: 07:00-23:00, Lør-Søn: 09:00-21:00",
    rating: 4.6,
    reviewCount: 32,
    pricePerHour: 600,
    hasAutoApproval: true,
    timeSlotDuration: 2
  }
];

// Helper function to get facility by ID
export const getLocalizedFacilityById = (id: number): LocalizedFacility | undefined => {
  return localizedMockFacilities.find(facility => facility.id === id);
};

// Helper function to get facilities for map (with lat/lng)
export const getLocalizedFacilitiesForMap = () => {
  return localizedMockFacilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    address: facility.address,
    lat: facility.lat,
    lng: facility.lng
  }));
};
