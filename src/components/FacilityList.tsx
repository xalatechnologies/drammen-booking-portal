
import React from "react";
import FacilityListItem from "@/components/facility/FacilityListItem";
import { mockFacilities } from "@/data/mockFacilities";

interface FacilityListProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
}

const FacilityList: React.FC<FacilityListProps> = ({
  date,
  facilityType,
  location,
  accessibility,
  capacity
}) => {
  // Use centralized mock data
  const facilities = mockFacilities;

  // Filtering logic - same as FacilityGrid
  const filteredFacilities = facilities.filter(facility => {
    const hasActiveFilters = 
      (facilityType && facilityType !== "") ||
      (location && location !== "") ||
      (accessibility && accessibility !== "") ||
      (capacity && Array.isArray(capacity) && capacity[0] > 0);
    
    if (!hasActiveFilters) return true;
    
    let matchesCriteria = true;
    
    if (facilityType && facilityType !== "") {
      matchesCriteria = matchesCriteria && 
        facility.type.toLowerCase().includes(facilityType.toLowerCase().replace("-", " "));
    }
    
    if (location && location !== "") {
      matchesCriteria = matchesCriteria && 
        facility.address.toLowerCase().includes(location.toLowerCase().replace("-", " "));
    }
    
    if (accessibility && accessibility !== "") {
      matchesCriteria = matchesCriteria && 
        facility.accessibility.includes(accessibility);
    }
    
    if (capacity && Array.isArray(capacity) && capacity.length === 2 && capacity[0] > 0) {
      matchesCriteria = matchesCriteria && 
        (facility.capacity >= capacity[0] && facility.capacity <= capacity[1]);
    }
    
    return matchesCriteria;
  });

  const facilitiesToDisplay = filteredFacilities;

  return (
    <div className="mb-8">
      {facilitiesToDisplay.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Ingen lokaler funnet</h3>
          <p className="text-gray-500">Prøv å endre søkekriteriene dine</p>
        </div>
      ) : (
        <div className="space-y-4">
          {facilitiesToDisplay.map(facility => (
            <FacilityListItem
              key={facility.id}
              facility={facility}
              facilityType={facilityType}
              location={location}
              accessibility={accessibility}
              capacity={capacity}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityList;
