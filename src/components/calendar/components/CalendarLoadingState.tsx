
import React from "react";
import ViewHeader from "../../search/ViewHeader";

interface CalendarLoadingStateProps {
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

export const CalendarLoadingState: React.FC<CalendarLoadingStateProps> = ({
  viewMode,
  setViewMode
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 my-[12px]">
      <ViewHeader 
        facilityCount={0}
        isLoading={true}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
};
