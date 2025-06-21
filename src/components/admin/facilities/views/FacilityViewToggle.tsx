
import React from "react";
import { Grid3X3, List, Table, Map } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type DisplayMode = 'table' | 'grid' | 'list' | 'map';

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
      className="border border-gray-300 rounded-lg h-12"
    >
      <ToggleGroupItem value="table" aria-label="Table view" className="h-12 px-4 text-base">
        <Table className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view" className="h-12 px-4 text-base">
        <Grid3X3 className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view" className="h-12 px-4 text-base">
        <List className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="map" aria-label="Map view" className="h-12 px-4 text-base">
        <Map className="h-5 w-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
