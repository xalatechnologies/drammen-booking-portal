
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FacilityListItemImage } from "./FacilityListItemImage";
import { FacilityListItemContent } from "./FacilityListItemContent";
import { FacilityListItemMap } from "./FacilityListItemMap";

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

interface FacilityListItemProps {
  facility: Facility;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
}

const FacilityListItem: React.FC<FacilityListItemProps> = ({
  facility,
  facilityType,
  location,
  accessibility,
  capacity
}) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const searchParams = new URLSearchParams();
    if (facilityType) searchParams.set('facilityType', facilityType);
    if (location) searchParams.set('location', location);
    if (accessibility) searchParams.set('accessibility', accessibility);
    if (capacity && Array.isArray(capacity)) {
      searchParams.set('capacity', capacity.join(','));
    }
    searchParams.set('viewMode', 'map');
    searchParams.set('focusFacility', facility.id.toString());
    navigate(`/?${searchParams.toString()}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="w-full max-w-none">
      <Card 
        className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:translate-y-[-2px] border border-slate-200/60 shadow-md bg-white cursor-pointer mb-3 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-full" 
        onClick={() => navigate(`/facilities/${facility.id}`)} 
        role="button" 
        tabIndex={0} 
        aria-label={`Se detaljer for ${facility.name} på ${facility.address}`} 
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/facilities/${facility.id}`);
          }
        }}
      >
        <CardContent className="p-0">
          <div className="grid grid-cols-12 min-h-[280px] w-full">
            {/* Image Section - 3 columns */}
            <div className="col-span-3 min-w-0">
              <FacilityListItemImage
                image={facility.image}
                facilityName={facility.name}
                facilityType={facility.type}
                area={facility.area}
              />
            </div>
            
            {/* Main Content - 6 columns */}
            <div className="col-span-6 min-w-0">
              <FacilityListItemContent
                facility={facility}
                isFavorited={isFavorited}
                onAddressClick={handleAddressClick}
                onFavorite={handleFavorite}
                onShare={handleShare}
              />
            </div>

            {/* Map Section - 3 columns */}
            <div className="col-span-3 min-w-0">
              <FacilityListItemMap 
                address={facility.address} 
                facilityName={facility.name} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityListItem;
