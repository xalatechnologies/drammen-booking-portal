
import React from 'react';
import { Calendar, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface DateRangeStepProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
}

export function DateRangeStep({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangeStepProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    onStartDateChange(range?.from);
    onEndDateChange(range?.to);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Velg periode
        </h3>
        <p className="text-gray-600">
          Angi når den gjentakende reservasjonen skal starte og slutte
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Velg tidsperiode
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-auto py-3",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                {dateRange?.from ? (
                  <>
                    <span className="text-sm font-medium">
                      {format(dateRange.from, 'dd.MM.yyyy', { locale: nb })}
                      {dateRange.to && (
                        <> - {format(dateRange.to, 'dd.MM.yyyy', { locale: nb })}</>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {dateRange.to ? 'Periode valgt' : 'Velg sluttdato'}
                    </span>
                  </>
                ) : (
                  <span>Velg startdato og sluttdato</span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              numberOfMonths={2}
              initialFocus
              disabled={(date) => date < new Date()}
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      </div>

      {dateRange?.from && dateRange?.to && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">Valgt periode:</span>
          </div>
          <p className="text-blue-700 mt-1">
            Fra {format(dateRange.from, 'dd.MM.yyyy', { locale: nb })} til {format(dateRange.to, 'dd.MM.yyyy', { locale: nb })}
          </p>
          <p className="text-blue-600 text-sm mt-1">
            {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} dager
          </p>
        </div>
      )}
    </div>
  );
}
