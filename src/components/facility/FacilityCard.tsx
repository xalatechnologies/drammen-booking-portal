
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Heart, Share2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

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
  const { t } = useTranslation();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const getAmenityIcons = () => {
    const amenityMap: { [key: string]: string } = {
      'projektor': '📽️',
      'lydanlegg': '🔊',
      'whiteboard': '📝',
      'kjøkken': '🍳',
      'parkering': '🚗',
      'wifi': '📶',
      'klimaanlegg': '❄️',
      'rullestolvennlig': '♿',
    };
    
    return facility.equipment.slice(0, 4).map(item => 
      amenityMap[item.toLowerCase()] || '⚡'
    );
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px] border-0 shadow-lg bg-white relative cursor-pointer"
      onClick={() => navigate(`/facilities/${facility.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={facility.image} 
          alt={facility.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
            target.onerror = null;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 h-10 w-10 p-0 rounded-full"
            onClick={handleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 h-10 w-10 p-0 rounded-full"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Type and Area Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 font-semibold px-3 py-1.5 shadow-lg">
            {t(`facility.types.${facility.type}`, {}, facility.type)}
          </Badge>
          <Badge variant="outline" className="bg-black/20 backdrop-blur-sm text-white border-white/30 font-medium px-3 py-1.5">
            {facility.area}
          </Badge>
        </div>

        {/* Facility Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {facility.name}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Location */}
        <div className="flex items-center gap-2 mb-4 text-gray-600 hover:text-blue-600 transition-colors group/location">
          <MapPin className="h-4 w-4 text-gray-400 group-hover/location:text-blue-500" />
          <span 
            className="text-sm font-medium line-clamp-1 cursor-pointer"
            onClick={(e) => onAddressClick(e, facility)}
          >
            {facility.address}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
          {facility.description}
        </p>

        {/* Capacity and Amenities Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{facility.capacity} personer</span>
          </div>
          
          <div className="flex gap-1">
            {getAmenityIcons().map((icon, index) => (
              <span key={index} className="text-lg" title={facility.equipment[index]}>
                {icon}
              </span>
            ))}
          </div>
        </div>

        {/* Suitable For Tags */}
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {facility.suitableFor.slice(0, 2).map((activity, index) => (
              <Badge
                key={index}
                className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1 text-xs hover:bg-blue-100 transition-colors"
              >
                {activity}
              </Badge>
            ))}
            {facility.suitableFor.length > 2 && (
              <Badge 
                variant="outline" 
                className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-3 py-1 text-xs"
              >
                +{facility.suitableFor.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/facilities/${facility.id}`);
          }}
        >
          <span>Se detaljer</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
        </Button>
      </CardContent>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-xl border-2 border-blue-400 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </Card>
  );
}
