
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Heart, Share2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface FacilityListItemProps {
  facility: Facility;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
}

const FacilityListItem: React.FC<FacilityListItemProps> = ({
  facility,
  facilityType,
  location,
  accessibility,
  capacity
}) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddressClick = (e: React.MouseEvent) => {
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
    
    return facility.equipment.slice(0, 6).map(item => 
      amenityMap[item.toLowerCase()] || '⚡'
    );
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:translate-y-[-4px] border border-slate-200/60 shadow-lg bg-white cursor-pointer mb-6"
      onClick={() => navigate(`/facilities/${facility.id}`)}
    >
      <CardContent className="p-0">
        <div className="flex h-80">
          {/* Enhanced Image Section */}
          <div className="w-80 flex-shrink-0 relative overflow-hidden">
            <img 
              src={facility.image} 
              alt={facility.name} 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
                target.onerror = null;
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Type Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/95 backdrop-blur-sm text-slate-700 border-0 font-semibold text-sm px-3 py-1.5 shadow-lg">
                {facility.type}
              </Badge>
            </div>

            {/* Area Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-slate-700 border-slate-200 font-medium px-3 py-1.5 shadow-sm">
                {facility.area}
              </Badge>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-8 flex flex-col">
            {/* Header with Actions */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {facility.name}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer mb-3" onClick={handleAddressClick}>
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium line-clamp-1">{facility.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
                  onClick={handleFavorite}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-4 line-clamp-2 flex-grow">
              {facility.description}
            </p>

            {/* Capacity and Amenities */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span className="font-medium">{facility.capacity} personer</span>
              </div>
              
              <div className="flex gap-1">
                {getAmenityIcons().map((icon, index) => (
                  <span key={index} className="text-xl" title={facility.equipment[index]}>
                    {icon}
                  </span>
                ))}
              </div>
            </div>

            {/* Suitable For Tags */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {facility.suitableFor.slice(0, 3).map((activity, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1.5 text-sm hover:bg-blue-100 transition-colors"
                  >
                    {activity}
                  </Badge>
                ))}
                {facility.suitableFor.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-3 py-1.5 text-sm"
                  >
                    +{facility.suitableFor.length - 3} flere
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/facilities/${facility.id}`);
              }}
            >
              <span>Se detaljer og book</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityListItem;
