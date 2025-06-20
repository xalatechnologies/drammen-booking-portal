
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
        return "Liste";
      case "map":
        return "Kart";
      case "calendar":
        return "Kalender";
      default:
        return "Rutenett";
    }
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case "grid":
        return Grid3X3;
      case "list":
        return List;
      case "map":
        return Map;
      case "calendar":
        return Calendar;
      default:
        return Grid3X3;
    }
  };

  const Icon = getViewIcon();

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left side: Facility count and view type */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-medium text-gray-900">{getViewLabel()}</span>
        </div>
        <div className="text-sm text-gray-600">
          {isLoading ? (
            <span>Laster lokaler...</span>
          ) : (
            <span>{facilityCount} {facilityCount === 1 ? 'lokale' : 'lokaler'} funnet</span>
          )}
        </div>
      </div>

      {/* Right side: View mode toggle */}
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
};

export default ViewHeader;
