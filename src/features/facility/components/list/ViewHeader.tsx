import React from "react";
import { Grid3X3, List, Map, Calendar } from "lucide-react";
import { ViewModeToggle } from "./ViewModeToggle";
import { useLocalization } from "@/core/localization/hooks/useLocalization";

/**
 * ViewHeader Props Interface
 * Following Interface Segregation Principle with focused props interface
 */
interface ViewHeaderProps {
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode?: (mode: "grid" | "map" | "calendar" | "list") => void;
  totalCount: number;
  filterCount?: number;
}

/**
 * ViewHeader Component
 * 
 * Responsible for displaying view controls and result counts
 * Following Single Responsibility Principle by focusing only on header display
 */
export function ViewHeader({
  viewMode,
  setViewMode,
  totalCount,
  filterCount = 0
}: ViewHeaderProps) {
  const { translate } = useLocalization();

  // View mode label translation keys
  const viewModeLabels = {
    grid: 'facility.view.grid',
    list: 'facility.view.list',
    map: 'facility.view.map',
    calendar: 'facility.view.calendar'
  };

  return (
    <div className="mb-8 flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-end justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-gray-900">
            {totalCount}
          </span>
          <span className="text-xl font-semibold text-gray-700">
            {translate('facility.facilitiesCount')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg px-6 py-3 font-medium text-gray-600 bg-gray-100 rounded-full">
            {translate(viewModeLabels[viewMode])}
          </div>
          {filterCount > 0 && (
            <div className="text-sm px-3 py-1 font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-100">
              {filterCount} {translate('facility.filtersApplied')}
            </div>
          )}
        </div>
      </div>
      
      {/* View mode toggles */}
      {setViewMode && (
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
          <ViewModeToggle 
            icon={<Grid3X3 className="h-5 w-5" />}
            isActive={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            label={translate('facility.view.grid')}
          />
          <ViewModeToggle 
            icon={<List className="h-5 w-5" />}
            isActive={viewMode === "list"}
            onClick={() => setViewMode("list")}
            label={translate('facility.view.list')}
          />
          <ViewModeToggle 
            icon={<Map className="h-5 w-5" />}
            isActive={viewMode === "map"}
            onClick={() => setViewMode("map")}
            label={translate('facility.view.map')}
          />
          <ViewModeToggle 
            icon={<Calendar className="h-5 w-5" />}
            isActive={viewMode === "calendar"}
            onClick={() => setViewMode("calendar")}
            label={translate('facility.view.calendar')}
          />
        </div>
      )}
    </div>
  );
}
