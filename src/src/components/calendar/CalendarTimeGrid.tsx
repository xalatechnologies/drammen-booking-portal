
import React from "react";
import { format, addDays } from "date-fns";
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
        <div className="grid grid-cols-8 mb-4">
          <div className="p-4 bg-gray-50 flex items-center justify-center rounded-l-lg">
            <span className="font-medium text-gray-700 text-base">Tidspunkter</span>
          </div>
          {days.map((day, i) => {
            const unavailableCheck = isDateUnavailable(day);
            const holidayCheck = isNorwegianHoliday(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            let headerClass = "p-4 text-center rounded-lg ";
            if (isToday) {
              headerClass += "bg-blue-100 border-2 border-blue-300";
            } else if (unavailableCheck.isUnavailable) {
              switch (unavailableCheck.reason) {
                case 'weekend':
                  headerClass += "bg-amber-50 border border-amber-200";
                  break;
                case 'holiday':
                  headerClass += "bg-red-50 border border-red-200";
                  break;
                default:
                  headerClass += "bg-gray-50 border border-gray-200";
              }
            } else {
              headerClass += "bg-green-50 border border-green-200";
            }
            
            return (
              <div key={i} className={headerClass}>
                <div className={`font-medium text-base ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                  {format(day, "EEE", { locale: nb })}
                </div>
                <div className={`text-lg font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
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
        <div className="space-y-2">
          {timeSlots.map((timeSlot, timeIndex) => (
            <div key={timeSlot} className="grid grid-cols-8 gap-2">
              <div className="p-4 bg-gray-50 font-medium text-gray-700 flex items-center justify-center rounded-lg text-base">
                {timeSlot}
              </div>
              {days.map((day, dayIndex) => {
                const unavailableCheck = isDateUnavailable(new Date(day));
                const isBooked = isTimeSlotBooked(facility.id, new Date(day), parseInt(timeSlot.split(':')[0]));
                
                let cellClass = "p-4 text-center relative h-14 rounded-lg transition-all duration-200 ";
                let clickHandler = null;
                let cellContent = timeSlot.split('-')[0]; // Show start time

                if (unavailableCheck.isUnavailable) {
                  switch (unavailableCheck.reason) {
                    case 'past':
                      cellClass += "bg-gray-200 text-gray-400 line-through cursor-not-allowed";
                      break;
                    case 'weekend':
                      cellClass += "bg-amber-100 text-amber-800 border border-amber-300";
                      break;
                    case 'holiday':
                      cellClass += "bg-red-200 text-red-800 line-through cursor-not-allowed";
                      break;
                    default:
                      cellClass += "bg-gray-100 text-gray-400 line-through cursor-not-allowed";
                  }
                } else if (isBooked) {
                  cellClass += "bg-red-100 border border-red-300 text-red-700 line-through cursor-not-allowed";
                } else {
                  cellClass += "bg-green-100 hover:bg-green-200 border border-green-300 text-gray-800 cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105";
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
                    <div className="flex items-center justify-center h-full">
                      <span className="text-base font-medium">{cellContent}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
