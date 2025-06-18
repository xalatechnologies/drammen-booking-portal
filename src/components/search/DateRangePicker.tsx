
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  setDateRange,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-14 justify-start text-left font-normal border-2 border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-blue-100 text-lg shadow-sm transition-all duration-200 px-4 bg-white placeholder:text-gray-400"
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd.MM", { locale: nb })} -{" "}
                {format(dateRange.to, "dd.MM.yy", { locale: nb })}
              </>
            ) : (
              format(dateRange.from, "dd.MM.yyyy", { locale: nb })
            )
          ) : (
            <span className="text-gray-400 font-normal">Når vil du booke?</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50 shadow-xl border-gray-200 bg-white" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          weekStartsOn={1}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
