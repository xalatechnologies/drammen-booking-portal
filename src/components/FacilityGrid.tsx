
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Users, Calendar, CheckCircle, XCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  
  // Mock data with real Drammen addresses and facilities - all 6 cards
  const facilities: Facility[] = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      address: "Knoffs gate 8, 3044 Drammen",
      type: "Gymsal",
      image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
      nextAvailable: "I dag, 18:00",
      capacity: 120,
      accessibility: ["wheelchair", "hearing-loop"],
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
      address: "Lauritz Grønlands vei 40, 3035 Drammen",
      type: "Aktivitetshall",
      image: "/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png",
      nextAvailable: "Fredag, 17:00",
      capacity: 200,
      accessibility: ["wheelchair"],
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
      address: "Smithestrømsveien 13, 3048 Drammen",
      type: "Auditorium",
      image: "/lovable-uploads/b692664c-737a-4a20-8673-25a401789f82.png",
      nextAvailable: "Torsdag, 19:00",
      capacity: 150,
      accessibility: ["wheelchair", "hearing-loop", "sign-language"],
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
      address: "Marienlyst 14, 3045 Drammen",
      type: "Møtesal",
      image: "/lovable-uploads/07eaca70-1e9b-4e73-ab4e-6b9b7f1ca27e.png",
      nextAvailable: "Lørdag, 10:00",
      capacity: 80,
      accessibility: ["wheelchair"],
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
      address: "Ormåsen 1, 3048 Drammen",
      type: "Svømmehall",
      image: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
      nextAvailable: "Søndag, 12:00",
      capacity: 250,
      accessibility: ["wheelchair", "hearing-loop"],
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
      image: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
      nextAvailable: "Lørdag, 18:30",
      capacity: 300,
      accessibility: ["wheelchair"],
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
  
  // Function to render accessibility badges with proper styling
  const renderAccessibilityBadges = (accessibilityFeatures: string[]) => {
    const badges = {
      "wheelchair": { label: "Rullestol", color: "bg-blue-50 text-blue-700 border-blue-200" },
      "hearing-loop": { label: "Teleslynge", color: "bg-green-50 text-green-700 border-green-200" },
      "sign-language": { label: "Tegnspråk", color: "bg-purple-50 text-purple-700 border-purple-200" }
    };
    
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {accessibilityFeatures.map((feature) => {
          const badge = badges[feature as keyof typeof badges];
          if (!badge) return null;
          
          return (
            <Badge 
              key={feature} 
              variant="outline" 
              className={cn("text-xs font-medium py-1 px-2 rounded-md", badge.color)}
            >
              {badge.label}
            </Badge>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="mb-8">
      {facilitiesToDisplay.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Ingen lokaler funnet</h3>
          <p className="text-gray-500">Prøv å endre søkekriteriene dine</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilitiesToDisplay.map(facility => (
            <Card 
              key={facility.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] group border border-gray-200"
            >
              <div className="h-52 bg-gray-200 relative overflow-hidden">
                <img 
                  src={facility.image} 
                  alt={facility.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
                    target.onerror = null; // Prevent infinite loop
                  }}
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium px-2.5 py-1 shadow-sm">
                    {facility.type}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-900">{facility.name}</h3>
                  <div className="flex items-start gap-1.5 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{facility.address}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>Kapasitet: {facility.capacity} personer</span>
                  </div>
                  
                  {renderAccessibilityBadges(facility.accessibility)}
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Tilgjengelighet</span>
                  </h4>
                  
                  {facility.availableTimes && facility.availableTimes[0]?.slots.map((slot, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b last:border-0 border-gray-100">
                      <span className="text-sm">
                        {format(facility.availableTimes![0].date, "EEE d. MMM", { locale: nb })} • {slot.start}-{slot.end}
                      </span>
                      {slot.available ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs gap-1 flex items-center">
                          <CheckCircle className="h-3 w-3" />
                          <span>Ledig</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs gap-1 flex items-center">
                          <XCircle className="h-3 w-3" />
                          <span>Opptatt</span>
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-1">
                  <div className="text-sm flex items-center gap-1.5 text-blue-700">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Neste: {facility.nextAvailable}</span>
                  </div>
                  
                  <Button 
                    onClick={() => navigate(`/facilities/${facility.id}`)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                    size="sm"
                  >
                    <Info className="h-3.5 w-3.5 mr-1.5" />
                    Detaljer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityGrid;
