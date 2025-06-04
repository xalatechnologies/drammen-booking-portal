
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
  return (
    <ToggleGroup 
      type="single" 
      value={viewMode} 
      onValueChange={(value) => value && setViewMode(value as "grid" | "map" | "calendar" | "list")}
      className="border border-gray-200 bg-gray-50 rounded-lg p-1 gap-1"
    >
      <ToggleGroupItem value="grid" className="h-8 w-8 p-0 rounded-md">
        <Grid3X3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" className="h-8 w-8 p-0 rounded-md">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="map" className="h-8 w-8 p-0 rounded-md">
        <Map className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="calendar" className="h-8 w-8 p-0 rounded-md">
        <CalendarView className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewModeToggle;
