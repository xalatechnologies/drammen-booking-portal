import React from "react";
import { useNavigate } from "react-router-dom";
import { FacilityCard } from "./facility/FacilityCard";
import { mockFacilities } from "@/data/mockFacilities";

// Define the facility type
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

interface FacilityGridProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
}

const FacilityGrid: React.FC<FacilityGridProps> = ({
  date,
  facilityType,
  location,
  accessibility,
  capacity
}) => {
  const navigate = useNavigate();
  
  // Use centralized mock data
  const facilities = mockFacilities;

  // Debug all facilities to make sure they exist
  console.log("All facilities:", facilities);
  
  // Simplified filtering logic - don't filter if values are empty/undefined
  const filteredFacilities = facilities.filter(facility => {
    // Don't filter at all if all filter criteria are empty or default
    const hasActiveFilters = 
      (facilityType && facilityType !== "") ||
      (location && location !== "") ||
      (accessibility && accessibility !== "") ||
      (capacity && Array.isArray(capacity) && capacity[0] > 0);
    
    // If no active filters, show all facilities
    if (!hasActiveFilters) return true;
    
    // Otherwise apply filters when criteria is provided
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

  console.log("Filtered facilities:", filteredFacilities.length, "out of", facilities.length);
  console.log("Filter values:", { facilityType, location, accessibility, capacity });
  
  // Show all facilities if there are no active filters
  const facilitiesToDisplay = filteredFacilities;
  
  // Function to handle address click - navigate to map view with filters
  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation(); // Prevent card click from triggering
    // Navigate to map view with current filters and focus on this facility
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
  
  return (
    <div className="mb-8">
      {facilitiesToDisplay.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Ingen lokaler funnet</h3>
          <p className="text-gray-500">Prøv å endre søkekriteriene dine</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {facilitiesToDisplay.map(facility => (
            <FacilityCard 
              key={facility.id} 
              facility={facility} 
              onAddressClick={handleAddressClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityGrid;
