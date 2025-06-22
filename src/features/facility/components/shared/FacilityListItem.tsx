import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalization } from "@/core/localization/hooks/useLocalization";
import { FacilityListItemImage } from "./FacilityListItemImage";
import { FacilityListItemContent } from "./FacilityListItemContent";
import { Facility } from "@/features/facility/types/facility";

/**
 * FacilityListItem Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface FacilityListItemProps {
  facility: Facility;
  highlightFilters?: {
    type?: string;
    location?: string;
    accessibility?: string[];
    capacity?: number[];
  };
}

/**
 * FacilityListItem Component
 * 
 * Responsible for rendering a facility in list view format
 * Following Single Responsibility Principle by delegating specific rendering
 * tasks to specialized sub-components
 */
export function FacilityListItem({
  facility,
  highlightFilters
}: FacilityListItemProps) {
  const navigate = useNavigate();
  const { translate } = useLocalization();
  
  // Handler for navigating to the facility detail page
  const handleCardClick = () => {
    navigate(`/facilities/${facility.id}`);
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardContent className="p-0 flex flex-col md:flex-row">
        {/* Image section */}
        <FacilityListItemImage 
          facility={facility}
        />

        {/* Content section with details */}
        <FacilityListItemContent 
          facility={facility}
          highlightFilters={highlightFilters}
        />
      </CardContent>
    </Card>
  );
}
