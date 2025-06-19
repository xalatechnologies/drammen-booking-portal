
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
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  setDateRange,
}) => {
  const { t, language } = useTranslation();
  const locale = language === 'NO' ? nb : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-14 justify-start text-left font-medium border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white text-lg rounded-xl transition-all duration-300"
          aria-label={t('search.labels.selectPeriod')}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd.MM", { locale })} -{" "}
                {format(dateRange.to, "dd.MM.yy", { locale })}
              </>
            ) : (
              format(dateRange.from, "dd.MM.yyyy", { locale })
            )
          ) : (
            <span className="text-gray-500 text-base">{t('search.placeholders.selectPeriod')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
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
