
import React from 'react';
import { format, addDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface WeekDisplayProps {
  currentWeekStart: Date;
}

export function WeekDisplay({ currentWeekStart }: WeekDisplayProps) {
  return (
    <div className="flex items-center gap-2 text-base font-medium bg-white px-4 py-2 rounded-lg border shadow-sm">
      <Calendar className="h-4 w-4" />
      {format(currentWeekStart, "dd.MM", { locale: nb })} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy", { locale: nb })}
    </div>
  );
}
