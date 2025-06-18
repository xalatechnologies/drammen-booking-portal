
import React from "react";
import { format, addDays } from "date-fns";
import { Clock } from "lucide-react";
import { nb } from "date-fns/locale";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";
import { Facility } from "./types";

interface CalendarTimeGridProps {
  facility: Facility;
  days: Date[];
  timeSlots: string[];
  isTimeSlotBooked: (facilityId: number, day: Date, hour: number) => boolean;
}

export const CalendarTimeGrid: React.FC<CalendarTimeGridProps> = ({
  facility,
  days,
  timeSlots,
  isTimeSlotBooked,
}) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Day Headers */}
        <div className="grid grid-cols-8 border-b bg-white">
          <div className="p-3 border-r bg-gray-50 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium text-gray-700">Tid</span>
          </div>
          {days.map((day, i) => {
            const unavailableCheck = isDateUnavailable(day);
            const holidayCheck = isNorwegianHoliday(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            let headerClass = "p-3 border-r text-center ";
            if (isToday) {
              headerClass += "bg-blue-100 border-l-4 border-l-blue-500";
            } else if (unavailableCheck.isUnavailable) {
              switch (unavailableCheck.reason) {
                case 'weekend':
                  headerClass += "bg-amber-50";
                  break;
                case 'holiday':
                  headerClass += "bg-red-50";
                  break;
                default:
                  headerClass += "bg-gray-50";
              }
            } else {
              headerClass += "bg-green-50";
            }
            
            return (
              <div key={i} className={headerClass}>
                <div className={`font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                  {format(day, "EEE", { locale: nb })}
                </div>
                <div className={`text-sm font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                  {format(day, "dd.MM", { locale: nb })}
                </div>
                {holidayCheck.isHoliday && (
                  <div className="text-xs text-red-600 mt-1" title={holidayCheck.name}>
                    {holidayCheck.name?.substring(0, 6)}...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Slot Rows */}
        {timeSlots.map((timeSlot, timeIndex) => (
          <div key={timeSlot} className="grid grid-cols-8 border-b hover:bg-gray-50/50">
            <div className="p-3 border-r bg-gray-50 font-medium text-gray-700 flex items-center">
              {timeSlot}
            </div>
            {days.map((day, dayIndex) => {
              const unavailableCheck = isDateUnavailable(new Date(day));
              const isBooked = isTimeSlotBooked(facility.id, new Date(day), parseInt(timeSlot.split(':')[0]));
              
              let cellClass = "p-3 border-r text-center relative h-12 ";
              let clickHandler = null;

              if (unavailableCheck.isUnavailable) {
                switch (unavailableCheck.reason) {
                  case 'past':
                    cellClass += "bg-gray-200";
                    break;
                  case 'weekend':
                    cellClass += "bg-amber-100";
                    break;
                  case 'holiday':
                    cellClass += "bg-red-200";
                    break;
                  default:
                    cellClass += "bg-gray-100";
                }
              } else if (isBooked) {
                cellClass += "bg-red-300";
              } else {
                cellClass += "bg-green-200 hover:bg-green-300 cursor-pointer transition-colors";
                clickHandler = () => window.location.href = `/facilities/${facility.id}?date=${format(day, 'yyyy-MM-dd')}&time=${timeSlot}`;
              }
              
              return (
                <div 
                  key={dayIndex} 
                  className={cellClass}
                  onClick={clickHandler}
                  title={unavailableCheck.isUnavailable ? unavailableCheck.details : 
                         isBooked ? 'Opptatt' : 'Ledig - klikk for å booke'}
                >
                  {/* Empty cell - only color coding */}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
