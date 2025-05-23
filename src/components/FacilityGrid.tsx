
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Users, Calendar, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

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

  // Filter facilities based on criteria
  const filteredFacilities = facilities.filter(facility => {
    // Filter by facility type (if provided)
    if (facilityType && facilityType !== "" && !facility.type.toLowerCase().includes(facilityType.toLowerCase().replace("-", " "))) {
      return false;
    }
    
    // Filter by location (if provided)
    if (location && location !== "" && !facility.address.toLowerCase().includes(location.toLowerCase().replace("-", " "))) {
      return false;
    }
    
    // Filter by accessibility (if provided)
    if (accessibility && accessibility !== "" && !facility.accessibility.includes(accessibility)) {
      return false;
    }
    
    // Filter by capacity (if provided)
    if (capacity && (facility.capacity < capacity[0] || facility.capacity > capacity[1])) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="mb-8">
      {filteredFacilities.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Ingen lokaler funnet</h3>
          <p className="text-gray-500">Prøv å endre søkekriteriene dine</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFacilities.map(facility => (
            <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={facility.image} 
                  alt={facility.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
                    target.onerror = null; // Prevent infinite loop
                  }}
                />
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-lg">
                  {facility.type}
                </div>
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {facility.accessibility.includes("wheelchair") && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs">Rullestol</span>
                  )}
                  {facility.accessibility.includes("hearing-loop") && (
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-md text-xs">Teleslynge</span>
                  )}
                  {facility.accessibility.includes("sign-language") && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-md text-xs">Tegnspråk</span>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{facility.name}</h3>
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                  {facility.address}
                </p>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Users className="h-3 w-3 mr-1 text-gray-500" />
                  <span>Kapasitet: {facility.capacity} personer</span>
                </div>
                
                <div className="text-sm mb-3">
                  <div className="font-medium mb-1">Tilgjengelighet:</div>
                  {facility.availableTimes && facility.availableTimes[0]?.slots.map((slot, i) => (
                    <div key={i} className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-blue-600" />
                        <span className="mr-2">
                          {format(facility.availableTimes![0].date, "EEE, d. MMM", { locale: nb })}:
                        </span>
                        <span>{slot.start} - {slot.end}</span>
                      </div>
                      {slot.available ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span className="text-xs">Ledig</span>
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <XCircle className="h-3 w-3 mr-1" />
                          <span className="text-xs">Opptatt</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm flex items-center text-blue-700">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Neste ledige: {facility.nextAvailable}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-700 border-blue-200"
                    onClick={() => navigate(`/facilities/${facility.id}`)}
                  >
                    Se detaljer →
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
