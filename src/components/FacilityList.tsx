
import React from "react";
import FacilityGrid from "./FacilityGrid";
import FacilityListItem from "./facility/FacilityListItem";
import PaginationControls from "./PaginationControls";
import { useFacilities, useFacilitiesPagination } from "@/hooks/useFacilities";
import { FacilityFilters } from "@/types/facility";

interface FacilityListProps {
  filters: FacilityFilters;
  viewMode: "grid" | "list";
}

const FacilityList: React.FC<FacilityListProps> = ({
  filters,
  viewMode
}) => {
  const { pagination, goToPage } = useFacilitiesPagination(1, 9);
  const { facilities, pagination: paginationInfo, isLoading, error } = useFacilities({
    pagination,
    filters
  });

  return (
    <div className="space-y-6">
      {viewMode === "grid" ? (
        <FacilityGrid pagination={pagination} filters={filters} />
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading facilities</div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">Ingen lokaler funnet</h3>
              <p className="text-gray-500">Prøv å endre søkekriteriene dine</p>
            </div>
          ) : (
            facilities.map(facility => (
              <FacilityListItem 
                key={facility.id} 
                facility={facility}
                facilityType={filters.facilityType}
                location={filters.location}
                accessibility={filters.accessibility}
                capacity={filters.capacity}
              />
            ))
          )}
        </div>
      )}

      {paginationInfo && paginationInfo.totalPages > 1 && (
        <PaginationControls 
          pagination={paginationInfo}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default FacilityList;
