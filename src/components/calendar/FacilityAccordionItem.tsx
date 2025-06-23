
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Calendar, Star } from 'lucide-react';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';

interface FacilityAccordionItemProps {
  facility: Facility;
  onBookNow: (facility: Facility) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const FacilityAccordionItem: React.FC<FacilityAccordionItemProps> = ({
  facility,
  onBookNow,
  isExpanded = false,
  onToggle
}) => {
  const { tSync } = useJsonTranslation();

  const handleBookingClick = () => {
    onBookNow(facility);
  };

  return (
    <Card className={`transition-all duration-200 ${isExpanded ? 'shadow-lg' : 'shadow-sm'}`}>
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {facility.name}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{facility.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{facility.capacity} people</span>
              </div>
              {facility.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{facility.rating}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={facility.status === 'active' ? 'default' : 'secondary'}>
              {facility.status}
            </Badge>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleBookingClick();
              }}
              className="whitespace-nowrap"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {tSync('facility.bookNow', 'Book Now')}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {tSync('facility.details', 'Details')}
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{tSync('facility.nextAvailable', 'Next available')}: {facility.nextAvailable}</span>
                </div>
                <div>
                  <span className="font-medium">{tSync('facility.type', 'Type')}: </span>
                  {facility.type}
                </div>
                <div>
                  <span className="font-medium">{tSync('facility.pricePerHour', 'Price per hour')}: </span>
                  {facility.pricePerHour} NOK
                </div>
              </div>
            </div>
            
            {facility.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {tSync('facility.description', 'Description')}
                </h4>
                <p className="text-sm text-gray-600">
                  {facility.description}
                </p>
              </div>
            )}

            {facility.amenities && facility.amenities.length > 0 && (
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-900 mb-2">
                  {tSync('facility.amenities', 'Amenities')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {facility.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              size="sm"
              onClick={handleBookingClick}
              className="w-full md:w-auto"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {tSync('facility.bookNow', 'Book Now')}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

