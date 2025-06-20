
import React from "react";
import { InfiniteScrollFacilities } from "./InfiniteScrollFacilities";
import { FacilityFilters } from "@/types/facility";

interface FacilityListProps {
  filters: FacilityFilters;
  viewMode: "grid" | "list";
}

const FacilityList: React.FC<FacilityListProps> = ({
  filters,
  viewMode
}) => {
  return (
    <InfiniteScrollFacilities 
      filters={filters} 
      viewMode={viewMode} 
    />
  );
};

export default FacilityList;
