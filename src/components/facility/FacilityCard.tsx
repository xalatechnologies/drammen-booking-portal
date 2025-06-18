
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Badge as BadgeIcon, Star, Heart } from "lucide-react";
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
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-3px] group border border-gray-100 flex flex-col cursor-pointer rounded-xl relative"
      onClick={() => navigate(`/facilities/${facility.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite button */}
      <button 
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 ${
          isFavorite ? 'bg-white text-red-500' : isHovered ? 'bg-white/90 text-gray-600' : 'opacity-0'
        }`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Fjern fra favoritter" : "Legg til i favoritter"}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
      </button>
      
      <div className="h-64 bg-gray-200 relative overflow-hidden">
        <img 
          src={facility.image} 
          alt={facility.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
            target.onerror = null;
          }}
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 font-semibold px-4 py-2 shadow-md text-base transition-all duration-300 hover:bg-white">
            {facility.type}
          </Badge>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-24 flex items-end">
          <div className="p-4 w-full">
            <div className="flex justify-between items-center">
              <p className="text-white font-medium text-base bg-blue-600/90 px-3 py-1.5">
                {facility.nextAvailable}
              </p>
              <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-800">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-5 flex flex-col flex-grow bg-white">
        <div className="mb-3">
          <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors">{facility.name}</h3>
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
          <div className="flex items-center gap-2 mt-2 text-base text-gray-500">
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 font-medium px-2.5 py-1 text-sm">
              {facility.area}
            </Badge>
            <span>•</span>
            <span>{facility.capacity} personer</span>
          </div>
        </div>

        <FacilityCardTabs facility={facility} />
      </CardContent>
    </Card>
  );
}
