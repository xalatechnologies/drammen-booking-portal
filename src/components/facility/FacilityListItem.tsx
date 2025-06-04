
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import FacilityImage from "./FacilityImage";
import FacilityMainInfo from "./FacilityMainInfo";
import FacilityDetails from "./FacilityDetails";

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

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/facilities/${facility.id}`);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:translate-y-[-2px] group border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/50 cursor-pointer"
      onClick={() => navigate(`/facilities/${facility.id}`)}
    >
      <CardContent className="p-0">
        <div className="flex h-52">
          <FacilityImage 
            image={facility.image}
            name={facility.name}
            type={facility.type}
          />
          
          <FacilityMainInfo 
            name={facility.name}
            address={facility.address}
            suitableFor={facility.suitableFor}
            area={facility.area}
            description={facility.description}
            onAddressClick={handleAddressClick}
          />
          
          <FacilityDetails 
            capacity={facility.capacity}
            nextAvailable={facility.nextAvailable}
            openingHours={facility.openingHours}
            equipment={facility.equipment}
            onDetailsClick={handleDetailsClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityListItem;
