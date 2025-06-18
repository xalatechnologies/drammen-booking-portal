
import React from "react";
import { MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarTimeGrid } from "./CalendarTimeGrid";
import { Facility } from "./types";

interface FacilityCalendarCardProps {
  facility: Facility;
  facilityIndex: number;
  days: Date[];
  timeSlots: string[];
  isTimeSlotBooked: (facilityId: number, day: Date, hour: number) => boolean;
}

export const FacilityCalendarCard: React.FC<FacilityCalendarCardProps> = ({
  facility,
  facilityIndex,
  days,
  timeSlots,
  isTimeSlotBooked,
}) => {
  return (
    <div className={`${facilityIndex !== 0 ? 'border-t-2 border-gray-100' : ''}`}>
      {/* Facility Header */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{facility.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{facility.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{facility.capacity} personer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {facility.suitableFor.slice(0, 3).map((activity, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
                >
                  {activity}
                </Badge>
              ))}
              {facility.accessibility.includes("wheelchair") && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  Rullestol
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => window.location.href = `/facilities/${facility.id}`}
          >
            Se detaljer
          </Button>
        </div>
      </div>

      {/* Time Slots Grid */}
      <CalendarTimeGrid
        facility={facility}
        days={days}
        timeSlots={timeSlots}
        isTimeSlotBooked={isTimeSlotBooked}
      />
    </div>
  );
};
