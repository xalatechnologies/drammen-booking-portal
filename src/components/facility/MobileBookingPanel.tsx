
import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersistentBookingSidebar } from "./PersistentBookingSidebar";

interface MobileBookingPanelProps {
  facilityName: string;
  facilityId: string;
  capacity: number;
  area: string;
  openingHours: string;
}

export function MobileBookingPanel({
  facilityName,
  facilityId,
  capacity,
  area,
  openingHours
}: MobileBookingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      {/* Collapsed Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left p-0 h-auto"
        >
          <div>
            <h3 className="font-semibold text-gray-900">{facilityName}</h3>
            <p className="text-sm text-gray-600">Se booking alternativer</p>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </Button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="max-h-[70vh] overflow-y-auto border-t bg-gray-50">
          <div className="p-4">
            <PersistentBookingSidebar
              facilityName={facilityName}
              facilityId={facilityId}
              capacity={capacity}
              area={area}
              openingHours={openingHours}
            />
          </div>
        </div>
      )}
    </div>
  );
}
