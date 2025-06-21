
import React from "react";
import { MapPin, Users, Trophy, Target, Zap, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";

interface Facility {
  id: number;
  name: string;
  address: string;
  description: string;
  capacity: number;
  equipment: string[];
  suitableFor: string[];
  type?: string;
  amenities?: string[];
}

interface FacilityCardContentProps {
  facility: Facility;
  onAddressClick: (e: React.MouseEvent, facility: Facility) => void;
}

export function FacilityCardContent({
  facility,
  onAddressClick
}: FacilityCardContentProps) {
  const { t } = useTranslation();

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

    // Derive from facility type and equipment - using actual database values
    const activities = [];
    
    if (facility.type) {
      switch (facility.type.toLowerCase()) {
        case 'fotballhall':
        case 'idrettshall':
        case 'gymsal':
          activities.push('Football', 'Sports', 'Training');
          break;
        case 'svømmehall':
          activities.push('Swimming', 'Water sports', 'Training');
          break;
        case 'aktivitetshall':
          activities.push('Basketball', 'Volleyball', 'Badminton');
          break;
        case 'auditorium':
          activities.push('Presentations', 'Events', 'Lectures');
          break;
        case 'konferanserom':
        case 'møterom':
          activities.push('Meetings', 'Conferences');
          break;
        case 'klasserom':
          activities.push('Teaching', 'Workshops');
          break;
        default:
          activities.push('Various activities');
      }
    }

    return activities;
  };

  const suitableActivities = getSuitableActivities();
  const maxVisibleTags = 3;

  return (
    <div className="p-6">
      {/* Facility Name */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
        {facility.name}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-3 mb-5 text-gray-600 hover:text-blue-600 transition-colors group/location">
        <MapPin className="h-5 w-5 text-gray-400 group-hover/location:text-blue-500" />
        <span className="text-base font-medium line-clamp-1 cursor-pointer" onClick={e => onAddressClick(e, facility)}>
          {facility.address}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-2">
        {facility.description}
      </p>

      {/* Suitable For Tags - under description with icons */}
      {suitableActivities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {suitableActivities.slice(0, maxVisibleTags).map((activity, index) => (
            <Badge 
              key={index}
              className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1 text-sm hover:bg-blue-100 transition-colors flex items-center gap-1.5"
            >
              {getSuitableForIcon(activity)}
              {activity}
            </Badge>
          ))}
          {suitableActivities.length > maxVisibleTags && (
            <Badge 
              variant="outline"
              className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-3 py-1 text-sm"
            >
              +{suitableActivities.length - maxVisibleTags} more
            </Badge>
          )}
        </div>
      )}

      {/* Capacity */}
      <div className="flex items-center gap-3 text-gray-600">
        <Users className="h-5 w-5" />
        <span className="text-base font-medium">{t('facility.details.capacity')}: {facility.capacity}</span>
      </div>
    </div>
  );
}
