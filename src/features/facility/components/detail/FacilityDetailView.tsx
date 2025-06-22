import React, { useState } from 'react';
import { FacilityDetailHeader } from './FacilityDetailHeader';
import { FacilityDetailInfo } from './FacilityDetailInfo';
import { Facility } from '@/features/facility/types/facility';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/**
 * FacilityDetailViewProps Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityDetailViewProps {
  facilityId: string | number;
  facility?: Facility;
  isLoading: boolean;
  error?: string;
  notFound?: boolean;
}

/**
 * FacilityDetailView Component
 * 
 * Responsible for displaying a complete facility detail view
 * Following Single Responsibility Principle by focusing only on facility detail rendering
 * and orchestrating the detail sub-components
 */
export function FacilityDetailView({ 
  facilityId,
  facility, 
  isLoading, 
  error, 
  notFound 
}: FacilityDetailViewProps) {
  const { translate } = useLocalization();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  // Handlers - Following Open/Closed Principle by extending behavior through props
  const handleFavoriteToggle = () => {
    setIsFavorited(prev => !prev);
    // In a real application, this would call a service to update the user's favorites
  };

  // Helper function to get localized text - following DRY principle by extracting reusable functionality
  const getLocalizedText = (localizedText?: Record<string, string>) => {
    if (!localizedText) return '';
    const { language } = useLocalization();
    return localizedText[language] || localizedText.EN || '';
  };

  const handleShare = () => {
    if (facility) {
      // This would be expanded in a real application to show a share modal
      // For now just use the Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: getLocalizedText(facility.name),
          text: getLocalizedText(facility.description),
          url: window.location.href,
        }).catch(err => console.error('Error sharing:', err));
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href)
          .then(() => alert(translate('facility.linkCopied')))
          .catch(err => console.error('Error copying link:', err));
      }
    }
  };

  // Loading state
  if (isLoading) {
    return <FacilityDetailSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{translate('facility.errorLoading')}</h2>
        <p className="text-gray-600 mb-6">{translate('facility.pleaseTryAgain')}</p>
        <Button onClick={() => navigate('/facilities')}>
          {translate('facility.backToFacilities')}
        </Button>
      </div>
    );
  }

  // Not found state
  if (notFound || !facility) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{translate('facility.facilityNotFound')}</h2>
        <p className="text-gray-600 mb-6">{translate('facility.facilityMayNotExist')}</p>
        <Button onClick={() => navigate('/facilities')}>
          {translate('facility.backToFacilities')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto pb-10">
      {/* Breadcrumb would go here */}
      
      {/* Header with image, title and actions */}
      <FacilityDetailHeader
        facility={facility}
        isFavorited={isFavorited}
        onFavoriteToggle={handleFavoriteToggle}
        onShare={handleShare}
      />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          {/* Facility information */}
          <FacilityDetailInfo facility={facility} />
          
          {/* Additional sections like reviews would go here */}
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          {/* Booking components would go here */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{translate('facility.checkAvailability')}</h2>
            {/* Placeholder for booking form */}
            <p className="text-gray-500 mb-4">{translate('facility.selectDateAndTime')}</p>
            <Button className="w-full">
              {translate('facility.checkAvailability')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * FacilityDetailSkeleton Component
 * 
 * Following Single Responsibility Principle by focusing only on loading state UI
 */
function FacilityDetailSkeleton() {
  return (
    <div className="container max-w-7xl mx-auto pb-10">
      {/* Skeleton for hero image */}
      <Skeleton className="w-full h-64 md:h-80 rounded-none mb-6" />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
            
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="flex flex-wrap gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-10 w-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
