
import React from 'react';
import { format, addDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeekNavigationProps {
  currentWeekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
  canGoPrevious: boolean;
}

export function WeekNavigation({ currentWeekStart, onWeekChange, canGoPrevious }: WeekNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onWeekChange(addDays(currentWeekStart, -7))}
        className="flex items-center gap-2 h-9 px-4 text-sm"
        disabled={!canGoPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
        Forrige
      </Button>
      
      <div className="flex items-center gap-2 text-base font-medium bg-white px-4 py-2 rounded-lg border shadow-sm">
        <Calendar className="h-4 w-4" />
        {format(currentWeekStart, "dd.MM", { locale: nb })} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy", { locale: nb })}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onWeekChange(addDays(currentWeekStart, 7))}
        className="flex items-center gap-2 h-9 px-4 text-sm"
      >
        Neste
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
