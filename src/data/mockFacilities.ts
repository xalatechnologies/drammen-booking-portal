
export interface MockFacility {
  id: number;
  name: string;
  address: string;
  type: string;
  image: string;
  nextAvailable: string;
  capacity: number;
  accessibility: string[];
  area: string;
  suitableFor: string[];
  equipment: string[];
  openingHours: string;
  description: string;
  lat: number;
  lng: number;
  availableTimes?: {
    date: Date;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
}

// Mock facilities data for Drammen Kommune
export const mockFacilities: MockFacility[] = [
  {
    id: 1,
    name: "Brandengen Skole - Gymsal",
    address: "Iver Holters gate 48, 3041 Drammen",
    type: "Gymsal",
    area: "Bragernes",
    image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    nextAvailable: "I dag, 18:00",
    capacity: 120,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: ["Basketball", "Volleyball", "Håndball", "Badminton"],
    equipment: ["Basketkurver", "Volleyballnett", "Lydsystem", "Projektor"],
    openingHours: "Man-Fre: 08:00-22:00, Lør-Søn: 10:00-20:00",
    description: "En moderne gymsal med høy standard og god ventilasjon. Ideell for ballsport og større arrangementer.",
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
    name: "Fjell Skole - Aktivitetshall",
    address: "Lauritz Hervigs vei 20, 3035 Drammen",
    type: "Aktivitetshall",
    area: "Konnerud",
    image: "/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png",
    nextAvailable: "Fredag, 17:00",
    capacity: 200,
    accessibility: ["wheelchair"],
    suitableFor: ["Fotball", "Innebandy", "Dans", "Konsert"],
    equipment: ["Fotballmål", "Lydanlegg", "Scene", "Garderober"],
    openingHours: "Man-Tor: 07:00-23:00, Fre: 07:00-24:00, Lør-Søn: 09:00-22:00",
    description: "Stor aktivitetshall med mulighet for både sport og kulturarrangementer. God akustikk og moderne fasiliteter.",
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
    name: "Gulskogen Skole - Auditorium",
    address: "Vintergata 8, 3048 Drammen",
    type: "Auditorium",
    area: "Gulskogen",
    image: "/lovable-uploads/b692664c-737a-4a20-8673-25a401789f82.png",
    nextAvailable: "Torsdag, 19:00",
    capacity: 150,
    accessibility: ["wheelchair", "hearing-loop", "sign-language"],
    suitableFor: ["Presentasjoner", "Teater", "Konferanser", "Filmvisning"],
    equipment: ["Projektor", "Lydsystem", "Mikrofoner", "Scene", "Lysrigger"],
    openingHours: "Man-Fre: 08:00-22:00, Lør: 10:00-18:00, Søn: Stengt",
    description: "Profesjonelt auditorium med scenebelysning og høykvalitets lyd- og bildeutstyr. Perfekt for større arrangementer.",
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
    name: "Marienlyst Stadion - Møtesal",
    address: "Schwartz gate 2, 3043 Drammen",
    type: "Møtesal",
    area: "Strømsø",
    image: "/lovable-uploads/07eaca70-1e9b-4e73-ab4e-6b9b7f1ca27e.png",
    nextAvailable: "Lørdag, 10:00",
    capacity: 80,
    accessibility: ["wheelchair"],
    suitableFor: ["Møter", "Kurs", "Workshops", "Seminarer"],
    equipment: ["Whiteboard", "Projektor", "WiFi", "Kaffe/te", "Flipchart"],
    openingHours: "Man-Fre: 07:00-20:00, Lør: 09:00-16:00, Søn: Stengt",
    description: "Romslig møtesal med naturlig lys og moderne konferanseutstyr. Ideell for bedriftsmøter og kursvirksomhet.",
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
    name: "Drammensbadet - Svømmehall",
    address: "Danvikgata 40, 3045 Drammen",
    type: "Svømmehall",
    area: "Åssiden",
    image: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
    nextAvailable: "Søndag, 12:00",
    capacity: 250,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: ["Svømming", "Vanngymnastikk", "Svømmeopplæring", "Konkurranser"],
    equipment: ["25m basseng", "Barnebassseng", "Garderober", "Dusjer", "Livredningsutstyr"],
    openingHours: "Man-Fre: 06:00-22:00, Lør-Søn: 08:00-20:00",
    description: "Moderne svømmeanlegg med både konkurransebasseng og barneområde. Høy standard på fasiliteter og sikkerhet.",
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
    name: "Åssiden Fotballhall",
    address: "Buskerudveien 54, 3024 Drammen",
    type: "Fotballhall",
    area: "Åssiden",
    image: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
    nextAvailable: "Lørdag, 18:30",
    capacity: 300,
    accessibility: ["wheelchair"],
    suitableFor: ["Fotball", "Futsal", "Innebandy", "Håndball"],
    equipment: ["Kunstgress", "Fotballmål", "Tilskuerplasser", "Garderober", "Kafeteria"],
    openingHours: "Man-Søn: 07:00-23:00",
    description: "Stor fotballhall med kunstgress av høy kvalitet. Egnet for både trening, kamper og turneringer.",
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
    name: "Drammen Bibliotek - Møterom",
    address: "Grønland 32, 3045 Drammen",
    type: "Møterom",
    area: "Bragernes",
    image: "/lovable-uploads/08e8f8d5-4126-4805-a56e-e4337f97dbd0.png",
    nextAvailable: "Mandag, 09:00",
    capacity: 25,
    accessibility: ["wheelchair", "hearing-loop", "sign-language"],
    suitableFor: ["Møter", "Studiegrupper", "Workshops", "Lesninger"],
    equipment: ["Whiteboard", "Projektor", "WiFi", "Bøker", "Stilleområde"],
    openingHours: "Man-Fre: 09:00-20:00, Lør: 10:00-16:00, Søn: 12:00-17:00",
    description: "Rolig møterom i biblioteket med tilgang til forskningsressurser og stille arbeidsmiljø.",
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
    name: "Strømsø Samfunnshus - Festsal",
    address: "Nedre Storgate 15, 3044 Drammen",
    type: "Festsal",
    area: "Strømsø",
    image: "/lovable-uploads/1d336434-5d93-4af7-8f92-32867c579c2a.png",
    nextAvailable: "Fredag, 20:00",
    capacity: 180,
    accessibility: ["wheelchair", "hearing-loop"],
    suitableFor: ["Bryllup", "Konfirmasjon", "Kulturarrangementer", "Dans"],
    equipment: ["Scene", "Lydanlegg", "Dansegulv", "Kjøkken", "Bar"],
    openingHours: "Man-Søn: 10:00-24:00",
    description: "Tradisjonell festsal med historisk charme. Perfekt for store feiringer og kulturelle arrangementer.",
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
  }
];

// Helper function to get facility by ID
export const getFacilityById = (id: number): MockFacility | undefined => {
  return mockFacilities.find(facility => facility.id === id);
};

// Helper function to get facilities for map (with lat/lng)
export const getFacilitiesForMap = () => {
  return mockFacilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    address: facility.address,
    lat: facility.lat,
    lng: facility.lng
  }));
};
