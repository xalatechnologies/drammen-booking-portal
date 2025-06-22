import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { Facility } from '@/features/facility/types/facility';

/**
 * FacilityDetailHeaderProps Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityDetailHeaderProps {
  facility: Facility;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  onShare: () => void;
}

/**
 * FacilityDetailHeader Component
 * 
 * Responsible for displaying the facility name, image, and action buttons
 * Following Single Responsibility Principle by focusing only on header rendering
 */
export function FacilityDetailHeader({
  facility,
  isFavorited,
  onFavoriteToggle,
  onShare
}: FacilityDetailHeaderProps) {
  // Get localization utilities
  const { translate, language } = useLocalization();

  // Find featured image or use the first one if available
  const featuredImage = facility.images?.find(img => img.is_featured) || facility.images?.[0];
  
  // Helper function to get localized text
  const getLocalizedText = (localizedText?: Record<string, string>) => {
    if (!localizedText) return '';
    return localizedText[language] || localizedText.EN || '';
  };
  
  return (
    <div className="relative w-full">
      {/* Hero image */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        {featuredImage?.image_url ? (
          <img
            src={featuredImage.image_url}
            alt={featuredImage.alt_text || getLocalizedText(facility.name)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">{translate('facility.noImageAvailable')}</p>
          </div>
        )}
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{getLocalizedText(facility.name)}</h1>
            {facility.address && (
              <p className="text-sm md:text-base opacity-90">
                {`${facility.address.street}, ${facility.address.postalCode} ${facility.address.city}`}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
              onClick={onFavoriteToggle}
              title={isFavorited ? translate('facility.removeFromFavorites') : translate('facility.addToFavorites')}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
              onClick={onShare}
              title={translate('facility.share')}
            >
              <Share2 className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
