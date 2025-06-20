
import React from "react";
import { Grid3X3, List, Map, Calendar } from "lucide-react";
import ViewModeToggle from "./ViewModeToggle";

interface ViewHeaderProps {
  facilityCount: number;
  isLoading: boolean;
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

const ViewHeader: React.FC<ViewHeaderProps> = ({
  facilityCount,
  isLoading,
  viewMode,
  setViewMode
}) => {
  const getViewLabel = () => {
    switch (viewMode) {
      case "grid":
        return "Rutenett";
      case "list":
        return "Liste visning";
      case "map":
        return "Kart";
      case "calendar":
        return "Kalender";
      default:
        return "Rutenett";
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left side: Facility count and view type - matching list/grid view style */}
      <div className="flex items-center gap-2">
        <span className="text-4xl font-bold text-gray-900">
          {isLoading ? "..." : facilityCount}
        </span>
        <span className="text-lg font-medium text-gray-600">
          {isLoading ? "Laster lokaler..." : `lokaler ${getViewLabel()}`}
        </span>
      </div>

      {/* Right side: View mode toggle */}
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
};

export default ViewHeader;
