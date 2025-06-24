
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Star } from 'lucide-react';
import { useFacilityActivities } from '@/hooks/useFacilityActivities';

interface FacilityListItemContentProps {
  facility: {
    id: number;
    name: string;
    type: string;
    address: string;
    capacity: number;
    pricePerHour: number;
    rating?: number;
    nextAvailable?: string;
  };
}

export function FacilityListItemContent({ facility }: FacilityListItemContentProps) {
  const { activities, isLoading } = useFacilityActivities(facility.id);

  return (
    <div className="flex-1 space-y-2">
      <div>
        <h3 className="font-semibold text-lg">{facility.name}</h3>
        <p className="text-sm text-gray-600">{facility.type}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MapPin className="h-4 w-4" />
        <span>{facility.address}</span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{facility.capacity} personer</span>
        </div>
        {facility.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{facility.rating}</span>
          </div>
        )}
      </div>

      {!isLoading && activities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activities.slice(0, 4).map((activity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {activity}
            </Badge>
          ))}
          {activities.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{activities.length - 4} more
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="text-lg font-bold text-blue-600">
          {facility.pricePerHour} kr/time
        </div>
        {facility.nextAvailable && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Clock className="h-3 w-3" />
            <span>{facility.nextAvailable}</span>
          </div>
        )}
      </div>
    </div>
  );
}
