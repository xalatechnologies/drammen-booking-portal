
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
          
          if (unavailableCheck.isUnavailable) {
            switch (unavailableCheck.reason) {
              case 'past':
                dayClass = "text-gray-400 line-through opacity-50";
                title = "Fortid - ikke tilgjengelig";
                break;
              case 'weekend':
                dayClass = "text-orange-700 bg-orange-100 border border-orange-300 font-semibold";
                title = "Helg - begrenset tilgang";
                break;
              case 'holiday':
                dayClass = "text-red-700 bg-red-100 border border-red-300 font-semibold";
                title = `Helligdag: ${unavailableCheck.details}`;
                break;
              case 'maintenance':
                dayClass = "text-yellow-700 bg-yellow-100 border border-yellow-300 font-semibold";
                title = "Vedlikehold - ikke tilgjengelig";
                break;
            }
          } else {
            dayClass = "text-green-700 bg-green-50 hover:bg-green-100";
            title = "Tilgjengelig for booking";
          }
          
          return (
            <button
              {...dayProps}
              title={title}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative rounded-md",
                dayClass
              )}
            >
              {date.getDate()}
              {holidayCheck.isHoliday && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border border-white"></div>
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
