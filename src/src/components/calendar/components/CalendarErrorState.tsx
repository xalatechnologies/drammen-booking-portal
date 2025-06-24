
import React from "react";
import ViewHeader from "../../search/ViewHeader";

interface CalendarErrorStateProps {
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
}

export const CalendarErrorState: React.FC<CalendarErrorStateProps> = ({
  viewMode,
  setViewMode
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 my-[12px]">
      <ViewHeader 
        facilityCount={0}
        isLoading={false}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-xl font-medium mb-2 text-red-800">Kunne ikke laste kalenderen</h3>
        <p className="text-red-600">Prøv igjen senere.</p>
      </div>
    </div>
  );
};
