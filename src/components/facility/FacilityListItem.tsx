import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Heart, Share2, Projector, Volume2, FileText, ChefHat, Car, Wifi, Snowflake, Accessibility, Trophy, Target, Zap } from "lucide-react";
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
        url: window.location.href
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
    const amenityMap: {
      [key: string]: React.ElementType;
    } = {
      'projektor': Projector,
      'lydanlegg': Volume2,
      'whiteboard': FileText,
      'kjøkken': ChefHat,
      'parkering': Car,
      'wifi': Wifi,
      'klimaanlegg': Snowflake,
      'rullestolvennlig': Accessibility
    };
    return facility.equipment.slice(0, 4).map((item, index) => {
      const IconComponent = amenityMap[item.toLowerCase()] || FileText;
      return <div key={index} className="flex items-center gap-1">
          <IconComponent className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600">{item}</span>
        </div>;
    });
  };
  const getSuitableForIcon = (activity: string) => {
    const activityMap: {
      [key: string]: React.ElementType;
    } = {
      'football': Trophy,
      'fotball': Trophy,
      'futsal': Target,
      'floorball': Zap,
      'basketball': Trophy,
      'volleyball': Trophy,
      'handball': Trophy,
      'tennis': Trophy,
      'badminton': Trophy,
      'yoga': Users,
      'dans': Users,
      'møter': Users,
      'konferanse': Users,
      'seminar': Users,
      'kurs': Users,
      'trening': Trophy,
      'sport': Trophy
    };
    const IconComponent = activityMap[activity.toLowerCase()] || Trophy;
    return <IconComponent className="h-4 w-4" />;
  };
  return <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:translate-y-[-4px] border border-slate-200/60 shadow-lg bg-white cursor-pointer mb-6 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50" onClick={() => navigate(`/facilities/${facility.id}`)} role="button" tabIndex={0} aria-label={`Se detaljer for ${facility.name} på ${facility.address}`} onKeyDown={e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/facilities/${facility.id}`);
    }
  }}>
      <CardContent className="p-0">
        <div className="flex" style={{
        height: '350px'
      }}>
          {/* Enhanced Image Section */}
          <div className="w-80 flex-shrink-0 relative overflow-hidden">
            <img src={facility.image} alt={`Bilde av ${facility.name}`} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
            target.onerror = null;
          }} />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Type Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/95 backdrop-blur-sm text-slate-700 border-0 font-semibold text-base px-4 py-2 shadow-lg">
                {facility.type}
              </Badge>
            </div>

            {/* Area Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-slate-700 border-slate-200 font-medium px-4 py-2 text-base shadow-sm">
                {facility.area}
              </Badge>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-8 flex flex-col">
            {/* Header with Actions */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {facility.name}
                </h3>
                
                <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer mb-4" onClick={handleAddressClick}>
                  <MapPin className="h-5 w-5" />
                  <span className="text-base font-medium line-clamp-1">{facility.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <Button variant="ghost" size="sm" className="h-12 w-12 p-0 hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={handleFavorite} aria-label={isFavorited ? "Fjern fra favoritter" : "Legg til favoritter"}>
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-12 w-12 p-0 hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={handleShare} aria-label="Del lokale">
                  <Share2 className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 flex-grow">
              <p className="text-gray-700 leading-relaxed text-base line-clamp-3">
                {facility.description}
              </p>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-3 text-gray-600 mb-6">
              <Users className="h-6 w-6" />
              <span className="font-medium text-lg">{facility.capacity} personer</span>
            </div>

            {/* Equipment and Suitable For aligned */}
            <div className="space-y-4">
              {/* Equipment */}
              {facility.equipment.length > 0}

              {/* Suitable For */}
              <div className="space-y-2">
                <div className="flex items-center text-slate-700">
                  <span className="font-semibold text-base">Egnet for</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-0">
                  {facility.suitableFor.slice(0, 3).map((activity, index) => <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-4 py-2 text-base hover:bg-blue-100 transition-colors flex items-center gap-2">
                      {getSuitableForIcon(activity)}
                      {activity}
                    </Badge>)}
                  {facility.suitableFor.length > 3 && <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-4 py-2 text-base">
                      +{facility.suitableFor.length - 3} flere
                    </Badge>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default FacilityListItem;