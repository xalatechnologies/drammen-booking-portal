import React, { useState } from "react";
import { FacilityFilters } from "@/features/facility/types/facility";
import { InfiniteScrollFacilities } from "./InfiniteScrollFacilities";
import { useLocalization } from "@/core/localization/hooks/useLocalization";

/**
 * FacilityList Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityListProps {
  filters: FacilityFilters;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

/**
 * FacilityList Component
 * 
 * Responsible for displaying facilities in a list or grid view
 * Following Single Responsibility Principle by delegating actual facility rendering
 * to specialized components
 */
export function FacilityList({ filters, viewMode, setViewMode }: FacilityListProps) {
  const { translate } = useLocalization();
  
  return (
    <div className="facility-list-container">
      <h2 className="sr-only">{translate('facility.list')}</h2>
      <InfiniteScrollFacilities 
        filters={filters} 
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
}
