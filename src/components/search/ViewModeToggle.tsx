
import React from "react";
import { Grid3X3, Map, Calendar as CalendarView, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ViewModeToggleProps {
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  setViewMode,
}) => {
  const viewModeLabels = {
    grid: "Rutenettoversikt",
    list: "Listeoversikt", 
    map: "Kartoversikt",
    calendar: "Kalenderoversikt"
  };

  return (
    <fieldset className="border border-gray-200 bg-gray-50 rounded-lg p-1">
      <legend className="sr-only">Velg visningstype for lokaler</legend>
      <ToggleGroup 
        type="single" 
        value={viewMode} 
        onValueChange={(value) => value && setViewMode(value as "grid" | "map" | "calendar" | "list")}
        className="gap-1"
        role="radiogroup"
        aria-label="Visningstype for søkeresultater"
      >
        <ToggleGroupItem 
          value="grid" 
          className="h-8 w-8 p-0 rounded-md"
          aria-label={`${viewModeLabels.grid}${viewMode === 'grid' ? ' (valgt)' : ''}`}
          role="radio"
          aria-checked={viewMode === 'grid'}
        >
          <Grid3X3 className="h-4 w-4" aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="list" 
          className="h-8 w-8 p-0 rounded-md"
          aria-label={`${viewModeLabels.list}${viewMode === 'list' ? ' (valgt)' : ''}`}
          role="radio"
          aria-checked={viewMode === 'list'}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="map" 
          className="h-8 w-8 p-0 rounded-md"
          aria-label={`${viewModeLabels.map}${viewMode === 'map' ? ' (valgt)' : ''}`}
          role="radio"
          aria-checked={viewMode === 'map'}
        >
          <Map className="h-4 w-4" aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="calendar" 
          className="h-8 w-8 p-0 rounded-md"
          aria-label={`${viewModeLabels.calendar}${viewMode === 'calendar' ? ' (valgt)' : ''}`}
          role="radio"
          aria-checked={viewMode === 'calendar'}
        >
          <CalendarView className="h-4 w-4" aria-hidden="true" />
        </ToggleGroupItem>
      </ToggleGroup>
    </fieldset>
  );
};

export default ViewModeToggle;
