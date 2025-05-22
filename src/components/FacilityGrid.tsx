
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";

// Define the facility type
interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  image: string;
  nextAvailable: string;
}

const FacilityGrid = () => {
  const navigate = useNavigate();
  
  // Mock data with real Drammen addresses and facilities - reduced to 6 cards
  const facilities: Facility[] = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      address: "Knoffs gate 8, 3044 Drammen",
      type: "Gymsal",
      image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
      nextAvailable: "I dag, 18:00"
    },
    {
      id: 4,
      name: "Fjell Skole - Aktivitetshall",
      address: "Lauritz Grønlands vei 40, 3035 Drammen",
      type: "Aktivitetshall",
      image: "/lovable-uploads/b12bcda3-d611-4e9e-bbcc-d53d2db38af9.png",
      nextAvailable: "Fredag, 17:00"
    },
    {
      id: 5,
      name: "Gulskogen Skole - Auditorium",
      address: "Smithestrømsveien 13, 3048 Drammen",
      type: "Auditorium",
      image: "/lovable-uploads/b692664c-737a-4a20-8673-25a401789f82.png",
      nextAvailable: "Torsdag, 19:00"
    },
    {
      id: 6,
      name: "Marienlyst Stadion - Møtesal",
      address: "Marienlyst 14, 3045 Drammen",
      type: "Møtesal",
      image: "/lovable-uploads/07eaca70-1e9b-4e73-ab4e-6b9b7f1ca27e.png",
      nextAvailable: "Lørdag, 10:00"
    },
    {
      id: 7,
      name: "Drammensbadet - Svømmehall",
      address: "Ormåsen 1, 3048 Drammen",
      type: "Svømmehall",
      image: "/lovable-uploads/740258a0-d4f7-49b6-a8a6-9c994e75baae.png",
      nextAvailable: "Søndag, 12:00"
    },
    {
      id: 8,
      name: "Åssiden Fotballhall",
      address: "Buskerudveien 54, 3024 Drammen",
      type: "Fotballhall",
      image: "/lovable-uploads/a72ba2e2-f0a3-4561-bff6-17fa721a0c02.png",
      nextAvailable: "Lørdag, 18:30"
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facilities.map(facility => (
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
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1">{facility.name}</h3>
              <p className="text-sm text-gray-600 mb-3 flex items-center">
                <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                {facility.address}
              </p>
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
    </div>
  );
};

export default FacilityGrid;
