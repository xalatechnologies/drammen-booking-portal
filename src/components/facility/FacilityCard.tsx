
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, MapPin, Users, Clock, Euro } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Facility } from '@/types/facility';
import { FacilityCardImage } from './FacilityCardImage';

interface FacilityCardProps {
  facility: Facility;
  className?: string;
}

export function FacilityCard({ facility, className = '' }: FacilityCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/facilities/${facility.id}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        text: facility.description || 'Check out this facility',
        url: window.location.origin + `/facilities/${facility.id}`
      });
    }
  };

  return (
    <Card className={`group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden ${className}`} onClick={handleCardClick}>
      <div className="relative">
        <FacilityCardImage 
          facility={facility}
          className="aspect-[4/3]"
        />
        
        {/* Action buttons overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Status badge */}
        {facility.status && (
          <div className="absolute top-3 left-3">
            <Badge variant={facility.status === 'active' ? 'default' : 'secondary'}>
              {facility.status}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and type */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {facility.name}
            </h3>
            <p className="text-sm text-gray-600">{facility.type}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{facility.address_street}, {facility.address_city}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{facility.capacity}</span>
              </div>
              {facility.area_sqm && (
                <div className="flex items-center gap-1">
                  <span>{facility.area_sqm} m²</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 font-medium text-gray-900">
              <Euro className="h-4 w-4" />
              <span>{facility.price_per_hour} kr/t</span>
            </div>
          </div>

          {/* Description */}
          {facility.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {facility.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
