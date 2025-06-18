
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
      className="overflow-hidden hover:shadow-strong transition-all duration-300 hover:translate-y-[-2px] group glass border-0 flex flex-col cursor-pointer hover-lift"
      onClick={() => navigate(`/facilities/${facility.id}`)}
    >
      <div className="h-48 bg-gradient-to-br from-navy-100 to-purple-50 relative overflow-hidden">
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
        <div className="absolute top-3 right-3">
          <Badge className="glass text-navy-800 border-0 font-medium px-2.5 py-1 shadow-soft text-sm">
            {facility.type}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="glass text-navy-700 border-white/20 font-medium px-2.5 py-1 shadow-soft text-sm">
            {facility.area}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow bg-white/80 backdrop-blur-sm">
        <div className="mb-3">
          <h3 className="font-bold text-xl mb-2 text-navy-900 line-clamp-1">{facility.name}</h3>
          <div className="flex items-start gap-1.5 text-base text-navy-600">
            <MapPin className="h-5 w-5 text-navy-500 shrink-0 mt-0.5" />
            <span 
              className="line-clamp-1 hover:text-purple-600 hover:underline cursor-pointer transition-colors"
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
