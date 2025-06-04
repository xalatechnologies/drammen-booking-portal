import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Clock, Wrench } from "lucide-react";

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

interface FacilityListProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
}

const FacilityList: React.FC<FacilityListProps> = ({
  date,
  facilityType,
  location,
  accessibility,
  capacity
}) => {
  const navigate = useNavigate();
  
  // Mock data with correct Drammen addresses and facilities
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
    }
  ];

  // Filtering logic - same as FacilityGrid
  const filteredFacilities = facilities.filter(facility => {
    const hasActiveFilters = 
      (facilityType && facilityType !== "") ||
      (location && location !== "") ||
      (accessibility && accessibility !== "") ||
      (capacity && Array.isArray(capacity) && capacity[0] > 0);
    
    if (!hasActiveFilters) return true;
    
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

  const facilitiesToDisplay = filteredFacilities;

  // Function to handle address click - navigate to map view with filters
  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation();
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
        <div className="space-y-4">
          {facilitiesToDisplay.map(facility => (
            <Card 
              key={facility.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:translate-y-[-1px] group border border-gray-200 cursor-pointer"
              onClick={() => navigate(`/facilities/${facility.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex h-40">
                  {/* Image - full height */}
                  <div className="w-48 h-full bg-gray-200 relative overflow-hidden flex-shrink-0">
                    <img 
                      src={facility.image} 
                      alt={facility.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
                        target.onerror = null;
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium text-xs px-2 py-1 shadow-sm">
                        {facility.type}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Left Content - Main info */}
                  <div className="flex-grow p-4 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-grow min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{facility.name}</h3>
                          <div className="flex flex-wrap gap-1">
                            {facility.suitableFor.slice(0, 4).map((activity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                                {activity}
                              </Badge>
                            ))}
                            {facility.suitableFor.length > 4 && (
                              <Badge variant="secondary" className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                                +{facility.suitableFor.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-white text-gray-700 border-gray-200 font-medium text-xs px-2 py-1 flex-shrink-0">
                          {facility.area}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        <span 
                          className="hover:text-slate-800 hover:underline cursor-pointer transition-colors truncate"
                          onClick={(e) => handleAddressClick(e, facility)}
                          title="Klikk for å se på kart"
                        >
                          {facility.address}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">{facility.description}</p>
                    </div>
                  </div>
                  
                  {/* Right Content - Enhanced details */}
                  <div className="w-72 p-4 flex flex-col justify-between border-l border-gray-100 bg-gradient-to-br from-gray-50/80 to-slate-50/80 flex-shrink-0">
                    <div className="space-y-4">
                      {/* Capacity and Hours */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-amber-600 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Kapasitet</div>
                            <div className="text-gray-800 font-semibold">{facility.capacity}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Neste ledig</div>
                            <div className="text-gray-800 font-semibold text-xs">{facility.nextAvailable}</div>
                          </div>
                        </div>
                      </div>

                      {/* Opening Hours */}
                      <div className="flex items-start gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">Åpningstider</div>
                          <div className="text-xs text-gray-700 leading-relaxed">{facility.openingHours}</div>
                        </div>
                      </div>
                      
                      {/* Equipment */}
                      {facility.equipment.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <Wrench className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-gray-500 font-medium mb-1">Utstyr</div>
                            <div className="text-xs text-gray-700 leading-relaxed">
                              {facility.equipment.slice(0, 3).join(", ")}
                              {facility.equipment.length > 3 && "..."}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="bg-slate-800 hover:bg-slate-700 text-white w-full mt-4 font-medium shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/facilities/${facility.id}`);
                      }}
                    >
                      Se detaljer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityList;
