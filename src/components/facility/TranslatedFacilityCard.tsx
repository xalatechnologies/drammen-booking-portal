
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FacilityView } from '@/types/translation';
import { MapPin, Users, Clock } from 'lucide-react';

interface TranslatedFacilityCardProps {
  facility: FacilityView;
  onClick?: () => void;
}

export const TranslatedFacilityCard: React.FC<TranslatedFacilityCardProps> = ({
  facility,
  onClick
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{facility.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {facility.address}
            </div>
          </div>
          <Badge variant="secondary">{facility.type}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {facility.image_url && (
          <img 
            src={facility.image_url} 
            alt={facility.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {facility.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {facility.capacity} personer
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {facility.timeSlotDuration}h slots
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold text-lg">
              {formatPrice(facility.pricePerHour)}/time
            </span>
            {facility.hasAutoApproval && (
              <Badge variant="outline" className="text-green-600">
                Auto-godkjenning
              </Badge>
            )}
          </div>
          
          {facility.suitableFor.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {facility.suitableFor.slice(0, 3).map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
              {facility.suitableFor.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{facility.suitableFor.length - 3} mer
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
