
import React from "react";
import { Grid3X3, List, Table, Map } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type DisplayMode = 'grid' | 'list' | 'table' | 'map';

interface FacilityViewToggleProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

export const FacilityViewToggle: React.FC<FacilityViewToggleProps> = ({
  displayMode,
  setDisplayMode
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={displayMode} 
      onValueChange={(value) => value && setDisplayMode(value as DisplayMode)}
      className="border border-gray-300 rounded-lg"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <Grid3X3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="table" aria-label="Table view">
        <Table className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="map" aria-label="Map view">
        <Map className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
