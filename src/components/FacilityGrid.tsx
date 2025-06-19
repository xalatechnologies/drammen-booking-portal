
import React from "react";
import { useNavigate } from "react-router-dom";
import { FacilityCard } from "./facility/FacilityCard";
import { useOptimizedFacilities } from "@/hooks/useOptimizedFacilities";
import { FacilityFilters } from "@/types/facility";
import { PaginationParams } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";

interface FacilityGridProps {
  pagination: PaginationParams;
  filters: FacilityFilters;
}

const FacilityGrid: React.FC<FacilityGridProps> = ({
  pagination,
  filters
}) => {
  const navigate = useNavigate();
  
  const { facilities, isLoading, error } = useOptimizedFacilities({
    pagination,
    filters
  });

  console.log("FacilityGrid - Facilities:", facilities.length);
  console.log("FacilityGrid - Filters:", filters);
  console.log("FacilityGrid - Pagination:", pagination);
  
  // Function to handle address click - navigate to map view with filters
  const handleAddressClick = (e: React.MouseEvent, facility: any) => {
    e.stopPropagation();
    const searchParams = new URLSearchParams();
    if (filters.facilityType) searchParams.set('facilityType', filters.facilityType);
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.accessibility) searchParams.set('accessibility', filters.accessibility);
    if (filters.capacity && Array.isArray(filters.capacity)) {
      searchParams.set('capacity', filters.capacity.join(','));
    }
    if (filters.searchTerm) searchParams.set('searchTerm', filters.searchTerm);
    searchParams.set('viewMode', 'map');
    searchParams.set('focusFacility', facility.id.toString());
    
    navigate(`/?${searchParams.toString()}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
        {Array.from({ length: pagination.limit }).map((_, index) => (
          <div key={index} className="space-y-4 animate-pulse">
            <Skeleton className="h-48 w-full rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
              <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
              <div className="grid grid-cols-2 gap-4 pt-3">
                <Skeleton className="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-lg" />
                <Skeleton className="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-lg" />
              </div>
              <Skeleton className="h-10 w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200 animate-fade-in">
        <h3 className="text-xl font-medium mb-2 text-red-800">Noe gikk galt</h3>
        <p className="text-red-600">Kunne ikke laste inn lokaler. Prøv igjen senere.</p>
      </div>
    );
  }

  if (facilities.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg animate-fade-in">
        <h3 className="text-xl font-medium mb-2">Ingen lokaler funnet</h3>
        <p className="text-gray-500">Prøv å endre søkekriteriene dine</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
      {facilities.map((facility, index) => (
        <div 
          key={facility.id} 
          className="animate-scale-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <FacilityCard 
            facility={facility} 
            onAddressClick={handleAddressClick}
          />
        </div>
      ))}
    </div>
  );
};

export default FacilityGrid;
