
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { isDateUnavailable, isNorwegianHoliday } from "@/utils/holidaysAndAvailability";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      role="application"
      aria-label="Kalender for å velge dato"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-bold border-2 border-blue-600",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" aria-hidden="true" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" aria-hidden="true" />,
        Day: ({ date, ...dayProps }) => {
          const unavailableCheck = isDateUnavailable(date);
          const holidayCheck = isNorwegianHoliday(date);
          
          let dayClass = "";
          let ariaLabel = "";
          let isDisabled = false;
          
          // Base aria label with date
          const dateString = date.toLocaleDateString('nb-NO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          
          if (unavailableCheck.isUnavailable) {
            switch (unavailableCheck.reason) {
              case 'past':
                dayClass = "text-gray-700 bg-gray-200 line-through opacity-80 cursor-not-allowed border-2 border-gray-400";
                ariaLabel = `${dateString} - Fortid, ikke tilgjengelig for booking`;
                isDisabled = true;
                break;
              case 'weekend':
                dayClass = "text-amber-900 bg-amber-200 border-2 border-amber-500 font-semibold hover:bg-amber-300 focus:bg-amber-300";
                ariaLabel = `${dateString} - Helg, begrenset tilgang for booking`;
                break;
              case 'holiday':
                dayClass = "text-red-900 bg-red-300 border-2 border-red-600 font-bold cursor-not-allowed";
                ariaLabel = `${dateString} - Helligdag: ${unavailableCheck.details}, ikke tilgjengelig for booking`;
                isDisabled = true;
                break;
              case 'maintenance':
                dayClass = "text-yellow-900 bg-yellow-300 border-2 border-yellow-600 font-semibold cursor-not-allowed";
                ariaLabel = `${dateString} - Vedlikehold, ikke tilgjengelig for booking`;
                isDisabled = true;
                break;
            }
          } else {
            dayClass = "text-green-900 bg-green-200 hover:bg-green-300 focus:bg-green-300 border-2 border-green-500";
            ariaLabel = `${dateString} - Tilgjengelig for booking`;
          }
          
          // Add holiday information to aria label if applicable
          if (holidayCheck.isHoliday && !unavailableCheck.isUnavailable) {
            ariaLabel += `. Helligdag: ${holidayCheck.name}`;
          }
          
          return (
            <button
              {...dayProps}
              aria-label={ariaLabel}
              aria-describedby={holidayCheck.isHoliday ? `holiday-${date.getDate()}` : undefined}
              disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                dayClass,
                isDisabled && "pointer-events-none"
              )}
            >
              <span className="sr-only">{ariaLabel}</span>
              <span aria-hidden="true">{date.getDate()}</span>
              {holidayCheck.isHoliday && (
                <>
                  <div 
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-700 rounded-full border-2 border-white shadow-sm"
                    aria-hidden="true"
                  ></div>
                  <div 
                    id={`holiday-${date.getDate()}`} 
                    className="sr-only"
                  >
                    Helligdag: {holidayCheck.name}
                  </div>
                </>
              )}
            </button>
          );
        }
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
