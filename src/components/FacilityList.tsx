
import React from "react";
import { InfiniteScrollFacilities } from "./InfiniteScrollFacilities";
import { FacilityFilters } from "@/types/facility";

interface FacilityListProps {
  filters: FacilityFilters;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

const FacilityList: React.FC<FacilityListProps> = ({
  filters,
  viewMode,
  setViewMode
}) => {
  return (
    <InfiniteScrollFacilities 
      filters={filters} 
      viewMode={viewMode}
    />
  );
};

export default FacilityList;
