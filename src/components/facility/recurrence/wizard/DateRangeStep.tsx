
import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

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
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      console.log('Start date selected:', date);
      onStartDateChange(date);
    } else {
      onStartDateChange(undefined);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      console.log('End date selected:', date);
      onEndDateChange(date);
    } else {
      onEndDateChange(undefined);
    }
  };

  // Format dates for input fields (YYYY-MM-DD)
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  // Get today's date for min attribute
  const today = format(new Date(), 'yyyy-MM-dd');

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
        <div className="space-y-2">
          <Label htmlFor="start-date" className="text-sm font-medium text-gray-700">
            Startdato
          </Label>
          <Input
            id="start-date"
            type="date"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            min={today}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date" className="text-sm font-medium text-gray-700">
            Sluttdato
          </Label>
          <Input
            id="end-date"
            type="date"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            min={formatDateForInput(startDate) || today}
            className="w-full"
          />
        </div>
      </div>

      {startDate && endDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Valgt periode:</span>
          </div>
          <p className="text-blue-700 mt-1">
            Fra {format(startDate, 'dd.MM.yyyy', { locale: nb })} til {format(endDate, 'dd.MM.yyyy', { locale: nb })}
          </p>
          <p className="text-blue-600 text-sm mt-1">
            {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} dager
          </p>
        </div>
      )}
    </div>
  );
}
