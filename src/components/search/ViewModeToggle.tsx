
import React from "react";
import { Grid3X3, Map, Calendar as CalendarView } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewModeToggleProps {
  viewMode: "grid" | "map" | "calendar";
  setViewMode: (mode: "grid" | "map" | "calendar") => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("grid")}
        className="flex-1 h-8 rounded-md"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "map" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("map")}
        className="flex-1 h-8 rounded-md"
      >
        <Map className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "calendar" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("calendar")}
        className="flex-1 h-8 rounded-md"
      >
        <CalendarView className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewModeToggle;
