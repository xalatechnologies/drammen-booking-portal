
import React from "react";
import { useFacilities } from "@/hooks/useFacilities";
import { FacilityGrid } from "./FacilityGrid";
import { transformFacilitiesForUI } from "@/utils/facilityTransforms";

interface FacilityListProps {
  filters?: any;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

const FacilityList: React.FC<FacilityListProps> = ({
  filters,
  viewMode,
  setViewMode
}) => {
  const { data: rawFacilities = [], isLoading } = useFacilities();
  
  if (isLoading) {
    return <div className="text-center py-8">Loading facilities...</div>;
  }

  const facilities = transformFacilitiesForUI(rawFacilities);

  return (
    <FacilityGrid facilities={facilities} />
  );
};

export default FacilityList;
