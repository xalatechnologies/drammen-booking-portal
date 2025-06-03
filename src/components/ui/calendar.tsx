
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
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
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
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Day: ({ date, ...dayProps }) => {
          const unavailableCheck = isDateUnavailable(date);
          const holidayCheck = isNorwegianHoliday(date);
          
          let dayClass = "";
          let title = "";
          let isDisabled = false;
          
          if (unavailableCheck.isUnavailable) {
            switch (unavailableCheck.reason) {
              case 'past':
                dayClass = "text-gray-500 bg-gray-100 line-through opacity-60 cursor-not-allowed";
                title = "Fortid - ikke tilgjengelig";
                isDisabled = true;
                break;
              case 'weekend':
                dayClass = "text-amber-800 bg-amber-100 border-2 border-amber-300 font-semibold hover:bg-amber-200";
                title = "Helg - begrenset tilgang";
                break;
              case 'holiday':
                dayClass = "text-red-800 bg-red-200 border-2 border-red-400 font-bold cursor-not-allowed";
                title = `Helligdag: ${unavailableCheck.details} - ikke tilgjengelig`;
                isDisabled = true;
                break;
              case 'maintenance':
                dayClass = "text-yellow-800 bg-yellow-200 border-2 border-yellow-400 font-semibold cursor-not-allowed";
                title = "Vedlikehold - ikke tilgjengelig";
                isDisabled = true;
                break;
            }
          } else {
            dayClass = "text-green-800 bg-green-100 hover:bg-green-200 border border-green-300";
            title = "Tilgjengelig for booking";
          }
          
          return (
            <button
              {...dayProps}
              title={title}
              disabled={isDisabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative rounded-md transition-colors",
                dayClass,
                isDisabled && "pointer-events-none"
              )}
            >
              {date.getDate()}
              {holidayCheck.isHoliday && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-sm"></div>
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
