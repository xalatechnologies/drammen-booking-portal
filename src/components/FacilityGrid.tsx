import React from "react";
import { useNavigate } from "react-router-dom";
import { FacilityCard } from "./facility/FacilityCard";

// Define the facility type
interface Facility {
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
  availableTimes?: {
    date: Date;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
}

interface FacilityGridProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
}

const FacilityGrid: React.FC<FacilityGridProps> = ({
  date,
  facilityType,
  location,
  accessibility,
  capacity
}) => {
  const navigate = useNavigate();
  
  // Mock data with correct Drammen addresses and facilities - all 6 cards with extended information
  const facilities: Facility[] = [
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
      id: 4,
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
      id: 6,
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
      id: 8,
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
      availableTimes: [
        {
          date: new Date(2025, 4, 30),
          slots: [
            { start: "18:30", end: "20:30", available: true }
          ]
        }
      ]
    }
  ];

  // Debug all facilities to make sure they exist
  console.log("All facilities:", facilities);
  
  // Simplified filtering logic - don't filter if values are empty/undefined
  const filteredFacilities = facilities.filter(facility => {
    // Don't filter at all if all filter criteria are empty or default
    const hasActiveFilters = 
      (facilityType && facilityType !== "") ||
      (location && location !== "") ||
      (accessibility && accessibility !== "") ||
      (capacity && Array.isArray(capacity) && capacity[0] > 0);
    
    // If no active filters, show all facilities
    if (!hasActiveFilters) return true;
    
    // Otherwise apply filters when criteria is provided
    let matchesCriteria = true;
    
    if (facilityType && facilityType !== "") {
      matchesCriteria = matchesCriteria && 
        facility.type.toLowerCase().includes(facilityType.toLowerCase().replace("-", " "));
    }
    
    if (location && location !== "") {
      matchesCriteria = matchesCriteria && 
        facility.address.toLowerCase().includes(location.toLowerCase().replace("-", " "));
    }
    
    if (accessibility && accessibility !== "") {
      matchesCriteria = matchesCriteria && 
        facility.accessibility.includes(accessibility);
    }
    
    if (capacity && Array.isArray(capacity) && capacity.length === 2 && capacity[0] > 0) {
      matchesCriteria = matchesCriteria && 
        (facility.capacity >= capacity[0] && facility.capacity <= capacity[1]);
    }
    
    return matchesCriteria;
  });

  console.log("Filtered facilities:", filteredFacilities.length, "out of", facilities.length);
  console.log("Filter values:", { facilityType, location, accessibility, capacity });
  
  // Show all facilities if there are no active filters
  const facilitiesToDisplay = filteredFacilities;
  
  // Function to handle address click - navigate to map view with filters
  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation(); // Prevent card click from triggering
    // Navigate to map view with current filters and focus on this facility
    const searchParams = new URLSearchParams();
    if (facilityType) searchParams.set('facilityType', facilityType);
    if (location) searchParams.set('location', location);
    if (accessibility) searchParams.set('accessibility', accessibility);
    if (capacity && Array.isArray(capacity)) {
      searchParams.set('capacity', capacity.join(','));
    }
    searchParams.set('viewMode', 'map');
    searchParams.set('focusFacility', facility.id.toString());
    
    navigate(`/?${searchParams.toString()}`);
  };
  
  return (
    <div className="mb-8">
      {facilitiesToDisplay.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Ingen lokaler funnet</h3>
          <p className="text-gray-500">Prøv å endre søkekriteriene dine</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {facilitiesToDisplay.map(facility => (
            <FacilityCard 
              key={facility.id} 
              facility={facility} 
              onAddressClick={handleAddressClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityGrid;
