
import React from 'react';
import { addDays, startOfDay, endOfWeek, startOfWeek } from 'date-fns';
import { NavigationButton } from './navigation/NavigationButton';
import { WeekDisplay } from './navigation/WeekDisplay';

interface WeekNavigationProps {
  currentWeekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
  canGoPrevious: boolean;
}

export function WeekNavigation({ currentWeekStart, onWeekChange, canGoPrevious }: WeekNavigationProps) {
  const handlePreviousWeek = () => {
    const newWeekStart = addDays(currentWeekStart, -7);
    onWeekChange(newWeekStart);
  };

  const handleNextWeek = () => {
    onWeekChange(addDays(currentWeekStart, 7));
  };

  // Calculate if we can actually go to previous week
  // Allow going back if the previous week contains today's date
  const today = startOfDay(new Date());
  const previousWeekStart = addDays(currentWeekStart, -7);
  const previousWeekEnd = endOfWeek(previousWeekStart, { weekStartsOn: 1 });
  const previousWeekStartDate = startOfWeek(previousWeekStart, { weekStartsOn: 1 });
  
  // Can go to previous week if today falls within that week's range
  const actualCanGoPrevious = today >= previousWeekStartDate && today <= previousWeekEnd;

  return (
    <div className="flex items-center justify-between mb-4">
      <NavigationButton
        direction="previous"
        onClick={handlePreviousWeek}
        disabled={!actualCanGoPrevious}
      />
      
      <WeekDisplay currentWeekStart={currentWeekStart} />
      
      <NavigationButton
        direction="next"
        onClick={handleNextWeek}
      />
    </div>
  );
}
