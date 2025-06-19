
import React from "react";
import { MapPin, Users, Trophy, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FacilityListItemHeader } from "./FacilityListItemHeader";

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
    return <IconComponent className="h-3 w-3" />;
  };

  return (
    <div className="flex-1 p-6 flex flex-col h-full">
      {/* Header Section */}
      <FacilityListItemHeader
        facilityName={facility.name}
        isFavorited={isFavorited}
        onFavorite={onFavorite}
        onShare={onShare}
      />
      
      {/* Address */}
      <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer mb-3" onClick={onAddressClick}>
        <MapPin className="h-4 w-4" />
        <span className="text-sm font-medium line-clamp-1">{facility.address}</span>
      </div>

      {/* Description */}
      <div className="mb-4 flex-grow">
        <p className="text-gray-700 leading-relaxed text-sm line-clamp-2">
          {facility.description}
        </p>
      </div>

      {/* Capacity */}
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <Users className="h-4 w-4" />
        <span className="font-medium text-sm">{facility.capacity} personer</span>
      </div>

      {/* Suitable For - Without Title */}
      <div className="flex flex-wrap gap-1.5">
        {facility.suitableFor.slice(0, 4).map((activity, index) => (
          <Badge 
            key={index} 
            className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-2 py-1 text-xs hover:bg-blue-100 transition-colors flex items-center gap-1"
          >
            {getSuitableForIcon(activity)}
            {activity}
          </Badge>
        ))}
        {facility.suitableFor.length > 4 && (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-2 py-1 text-xs">
            +{facility.suitableFor.length - 4}
          </Badge>
        )}
      </div>
    </div>
  );
}
