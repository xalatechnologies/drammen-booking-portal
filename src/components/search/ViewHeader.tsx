
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
        return "Rutenett visning";
      case "list":
        return "Liste visning";
      case "map":
        return "Kart";
      case "calendar":
        return "Kalender";
      default:
        return "Rutenett visning";
    }
  };

  return (
    <div className="mb-8 flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-end justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-gray-900">
            {isLoading ? "..." : facilityCount}
          </span>
          <span className="text-xl font-semibold text-gray-700">lokaler</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg px-6 py-3 font-medium text-gray-600 bg-gray-100 rounded-full">
            {isLoading ? "Laster..." : getViewLabel()}
          </div>
        </div>
      </div>
      
      {/* View mode toggle aligned with the results label */}
      <div className="flex-shrink-0">
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  );
};

export default ViewHeader;
