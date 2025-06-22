import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Home, MapPin, Tag } from 'lucide-react';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { Facility } from '@/features/facility/types/facility';

/**
 * FacilityDetailInfoProps Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityDetailInfoProps {
  facility: Facility;
  showBookingSection?: boolean;
}

/**
 * FacilityDetailInfo Component
 * 
 * Responsible for displaying the facility details and information
 * Following Single Responsibility Principle by focusing only on displaying facility information
 */
export function FacilityDetailInfo({ facility }: FacilityDetailInfoProps) {
  const { translate, language } = useLocalization();
  
  // Helper function to get localized text - following DRY principle
  const getLocalizedText = (localizedText?: Record<string, string> | string) => {
    if (!localizedText) return '';
    // Handle case when input is already a string
    if (typeof localizedText === 'string') return localizedText;
    // Handle case when input is a localized text object
    return localizedText[language] || localizedText.EN || '';
  };
  
  // Format address for display
  const formatAddress = (address?: { street: string; city: string; postalCode: string; country: string }) => {
    if (!address) return '';
    return `${address.street}, ${address.postalCode} ${address.city}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{translate('facility.aboutThisFacility')}</h2>
      
      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700">{getLocalizedText(facility.description)}</p>
      </div>
      
      {/* Key details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InfoItem 
          icon={<Clock className="h-5 w-5 text-gray-500" />}
          label={translate('facility.capacity')}
          value={`${facility.capacity} ${translate('facility.people')}`}
        />
        
        <InfoItem 
          icon={<Users className="h-5 w-5 text-gray-500" />}
          label={translate('facility.type')}
          value={getLocalizedText(facility.type)}
        />
        
        <InfoItem 
          icon={<Home className="h-5 w-5 text-gray-500" />}
          label={translate('facility.area')}
          value={`${facility.area} m²`}
        />
        
        <InfoItem 
          icon={<MapPin className="h-5 w-5 text-gray-500" />}
          label={translate('facility.location')}
          value={formatAddress(facility.address)}
        />
        
        {facility.pricePerHour && (
          <InfoItem 
            icon={<Tag className="h-5 w-5 text-gray-500" />}
            label={translate('facility.pricePerHour')}
            value={`${facility.pricePerHour} kr`}
          />
        )}
      </div>
      
      {/* Amenities */}
      {facility.amenities && facility.amenities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">{translate('facility.amenities')}</h3>
          <div className="flex flex-wrap gap-2">
            {facility.amenities.map((amenity, index) => {
              // Handle both string and localized text amenities
              const amenityName = typeof amenity === 'string' 
                ? amenity 
                : getLocalizedText(amenity);
              const translationKey = `facility.amenities.${String(amenityName).toLowerCase()}`;
                
              return (
                <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700">
                  {translate(translationKey) || amenityName}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Equipment */}
      {facility.equipment && facility.equipment.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">{translate('facility.equipment')}</h3>
          <div className="flex flex-wrap gap-2">
            {facility.equipment.map((item, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700">
                {translate(`facility.equipment.${item.toLowerCase()}`) || item}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Accessibility features */}
      {facility.accessibility && facility.accessibility.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">{translate('facility.accessibility')}</h3>
          <div className="flex flex-wrap gap-2">
            {facility.accessibility.map((item, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700">
                {translate(`facility.accessibility.${item.toLowerCase()}`) || item}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * InfoItem Component
 * 
 * Following Single Responsibility Principle as a presentation component
 * for displaying individual facility information items
 */
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center">
      <div className="mr-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
