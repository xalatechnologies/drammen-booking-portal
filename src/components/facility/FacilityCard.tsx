
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
      className="card-primary hover-lift cursor-pointer group overflow-hidden"
      onClick={() => navigate(`/facilities/${facility.id}`)}
    >
      <div className="h-48 gradient-surface relative overflow-hidden">
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
          <Badge className="badge-primary shadow-sm">
            {facility.type}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge className="badge-secondary">
            {facility.area}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-lg surface-primary">
        <div className="mb-md">
          <h3 className="heading-primary text-xl mb-sm line-clamp-1">{facility.name}</h3>
          <div className="flex items-start gap-xs text-base text-secondary">
            <MapPin className="h-5 w-5 text-brand-secondary shrink-0 mt-0.5" />
            <span 
              className="line-clamp-1 hover:text-brand-accent hover:underline cursor-pointer transition-colors"
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
