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
  
  // Mock data with real Drammen addresses and facilities
  const facilities: Facility[] = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      address: "Knoffs gate 8, 3044 Drammen",
      type: "Gymsal",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop",
      nextAvailable: "I dag, 18:00"
    },
    {
      id: 2,
      name: "Bragernes Skole - Aula",
      address: "Capjonsgate 3, 3016 Drammen",
      type: "Aula",
      image: "https://www.drammen.kommune.no/globalassets/tjenester/skole/bilder/bragernes-skole.jpg?quality=80&width=900",
      nextAvailable: "I morgen, 16:30"
    },
    {
      id: 3,
      name: "Danvik Folkehøgskole - Møterom",
      address: "Gjerpenkollen 3, 3022 Drammen",
      type: "Møterom",
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop",
      nextAvailable: "I dag, 15:00"
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
      image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=600&auto=format&fit=crop",
      nextAvailable: "Torsdag, 19:00"
    },
    {
      id: 6,
      name: "Marienlyst Stadion - Møtesal",
      address: "Marienlyst 14, 3045 Drammen",
      type: "Møtesal",
      image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&auto=format&fit=crop",
      nextAvailable: "Lørdag, 10:00"
    },
    {
      id: 7,
      name: "Drammensbadet - Svømmehall",
      address: "Ormåsen 1, 3048 Drammen",
      type: "Svømmehall",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=600&auto=format&fit=crop",
      nextAvailable: "Søndag, 12:00"
    },
    {
      id: 8,
      name: "Konnerud Samfunnshus - Festsal",
      address: "Bernåsbakken 3, 3032 Drammen",
      type: "Festsal",
      image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&auto=format&fit=crop",
      nextAvailable: "Lørdag, 18:30"
    },
    {
      id: 9,
      name: "Strømsø Skole - Klasserom",
      address: "Knoffs gate 30, 3044 Drammen",
      type: "Klasserom",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&auto=format&fit=crop",
      nextAvailable: "Mandag, 16:00"
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
