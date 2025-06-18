
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Badge as BadgeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FacilityCardTabs } from "./FacilityCardTabs";

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

interface FacilityCardProps {
  facility: Facility;
  onAddressClick: (e: React.MouseEvent, facility: Facility) => void;
}

export function FacilityCard({ facility, onAddressClick }: FacilityCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-3px] group border border-gray-100 flex flex-col cursor-pointer rounded-xl"
      onClick={() => navigate(`/facilities/${facility.id}`)}
    >
      <div className="h-56 bg-gray-200 relative overflow-hidden">
        <img 
          src={facility.image} 
          alt={facility.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
            target.onerror = null;
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 font-semibold px-3 py-1.5 shadow-md text-sm rounded-full">
            {facility.type}
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="bg-white/95 backdrop-blur-sm text-gray-700 border-gray-200 font-medium px-3 py-1.5 shadow-md text-sm rounded-full">
            {facility.area}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-medium text-sm">Neste ledig: {facility.nextAvailable}</p>
        </div>
      </div>
      
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors">{facility.name}</h3>
          <div className="flex items-start gap-2 text-base text-gray-600">
            <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <span 
              className="line-clamp-1 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
              onClick={(e) => onAddressClick(e, facility)}
              title="Klikk for å se på kart"
            >
              {facility.address}
            </span>
          </div>
        </div>

        <FacilityCardTabs facility={facility} />
      </CardContent>
    </Card>
  );
}
