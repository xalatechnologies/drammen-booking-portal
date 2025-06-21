
import React from "react";
import { MapPin, Users, Trophy, Target, Zap, Heart, Share2 } from "lucide-react";
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

interface FacilityListItemContentProps {
  facility: Facility;
  isFavorited: boolean;
  onAddressClick: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

export function FacilityListItemContent({
  facility,
  isFavorited,
  onAddressClick,
  onFavorite,
  onShare
}: FacilityListItemContentProps) {
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

  // Derive suitable activities from facility data if suitableFor is empty
  const getSuitableActivities = () => {
    if (facility.suitableFor && facility.suitableFor.length > 0) {
      return facility.suitableFor;
    }

    // Derive from facility type and area - using actual values that match the image
    const activities = [];
    
    if (facility.type) {
      switch (facility.type.toLowerCase()) {
        case 'fotballhall':
        case 'idrettshall':
        case 'gymsal':
          activities.push('Fotballhall');
          break;
        case 'svømmehall':
          activities.push('Svømming');
          break;
        case 'aktivitetshall':
          activities.push('Basketball', 'Volleyball');
          break;
        case 'auditorium':
          activities.push('Presentasjoner');
          break;
        case 'konferanserom':
        case 'møterom':
          activities.push('Møter');
          break;
        case 'klasserom':
          activities.push('Undervisning');
          break;
        default:
          activities.push('Sport');
      }
    }

    // Add area-based activities
    if (facility.area) {
      activities.push(facility.area);
    }

    return activities.length > 0 ? activities : ['Aktiviteter'];
  };

  const suitableActivities = getSuitableActivities();
  const maxVisibleTags = 2;

  console.log('FacilityListItemContent - Facility:', facility.name, 'SuitableFor:', facility.suitableFor, 'Type:', facility.type, 'Area:', facility.area, 'Derived activities:', suitableActivities);

  return (
    <div className="flex-1 p-6 flex flex-col h-full">
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
        {facility.name}
      </h3>
      
      {/* Address - directly under title */}
      <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer mb-4" onClick={onAddressClick}>
        <MapPin className="h-5 w-5" />
        <span className="text-base font-medium line-clamp-1">{facility.address}</span>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed text-base line-clamp-2">
          {facility.description}
        </p>
      </div>

      {/* Suitable For - under description */}
      {suitableActivities.length > 0 && (
        <div className="flex gap-2 items-center mb-4 flex-wrap">
          {suitableActivities.slice(0, maxVisibleTags).map((activity, index) => (
            <Badge 
              key={index} 
              className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1 text-sm hover:bg-blue-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              {getSuitableForIcon(activity)}
              {activity}
            </Badge>
          ))}
          {suitableActivities.length > maxVisibleTags && (
            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-3 py-1 text-sm whitespace-nowrap">
              +{suitableActivities.length - maxVisibleTags} more
            </Badge>
          )}
        </div>
      )}

      {/* Bottom section with Capacity and Action Buttons */}
      <div className="flex items-center justify-between mt-auto">
        {/* Capacity */}
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-5 w-5" />
          <span className="font-medium text-base">{facility.capacity} personer</span>
        </div>

        {/* Action Buttons - aligned to the right */}
        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
            onClick={onFavorite} 
            aria-label={isFavorited ? "Fjern fra favoritter" : "Legg til favoritter"}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
            onClick={onShare} 
            aria-label="Del lokale"
          >
            <Share2 className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
