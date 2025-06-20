
import React from 'react';
import { AirBnbStyleGallery } from '@/components/facility/AirBnbStyleGallery';
import { FacilityHeader } from '@/components/facility/FacilityHeader';
import { FacilityInfoTabs } from '@/components/facility/FacilityInfoTabs';
import { FacilityContactInfo } from '@/components/facility/FacilityContactInfo';
import { Zone } from '@/components/booking/types';
import { OptimizedLocalizedFacility } from '@/types/facility';

interface FacilityDetailLayoutProps {
  facility: OptimizedLocalizedFacility;
  zones: Zone[];
  onShare: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

export function FacilityDetailLayout({
  facility,
  zones,
  onShare,
  isFavorited,
  onToggleFavorite
}: FacilityDetailLayoutProps) {
  const images = [
    facility.image,
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop"
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Full Width Gallery Section */}
      <div className="w-full mb-8">
        <AirBnbStyleGallery images={images} facilityName={facility.name} />
      </div>

      {/* Facility Header - Title, Tags, Address */}
      <div className="mb-8">
        <FacilityHeader 
          name={facility.name} 
          address={facility.address} 
          onShare={onShare} 
          isFavorited={isFavorited} 
          onToggleFavorite={onToggleFavorite} 
        />
      </div>

      {/* Main Content Layout - 70% / 30% */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-12">
        {/* Left Column - Tabs Content (70%) */}
        <div className="lg:col-span-7 space-y-6">
          <FacilityInfoTabs 
            description={facility.description} 
            capacity={facility.capacity} 
            equipment={facility.equipment || []} 
            zones={zones} 
            amenities={facility.amenities || []} 
            address={facility.address} 
            area={facility.area} 
            suitableFor={facility.suitableFor || []} 
            facilityId={facility.id.toString()} 
            facilityName={facility.name} 
          />
        </div>

        {/* Right Column - Contact Info Sidebar (30%) */}
        <div className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-6">
            <FacilityContactInfo 
              facilityName={facility.name} 
              address={facility.address} 
              openingHours={facility.openingHours} 
              capacity={facility.capacity} 
              area={facility.area} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
