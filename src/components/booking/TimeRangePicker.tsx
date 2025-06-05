
import React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimeRangePickerProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  timeRange,
  setTimeRange,
}) => {
  const timeOptions = [
    "08:00-10:00", "08:00-12:00", "08:00-16:00",
    "09:00-11:00", "09:00-13:00", "09:00-17:00",
    "10:00-12:00", "10:00-14:00", "10:00-18:00",
    "12:00-14:00", "12:00-16:00", "12:00-20:00",
    "14:00-16:00", "14:00-18:00", "14:00-22:00",
    "16:00-18:00", "16:00-20:00", "16:00-22:00",
    "18:00-20:00", "18:00-22:00", "20:00-22:00"
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-11 justify-start text-left font-normal border-gray-200 hover:border-slate-700"
        >
          <Clock className="mr-2 h-4 w-4 text-gray-500" />
          {timeRange ? (
            timeRange
          ) : (
            <span className="text-gray-500">Velg tidsperiode</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 z-50" align="start">
        <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
          {timeOptions.map((time) => (
            <Button
              key={time}
              variant={timeRange === time ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(time)}
              className="justify-start text-sm"
            >
              {time}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimeRangePicker;
