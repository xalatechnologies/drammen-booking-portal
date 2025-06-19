
import React from 'react';
import { addDays, startOfDay, endOfWeek } from 'date-fns';
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
    
    // Allow going back if the week contains any date from today onwards
    const today = startOfDay(new Date());
    const weekEnd = endOfWeek(newWeekStart, { weekStartsOn: 1 });
    
    if (weekEnd >= today) {
      onWeekChange(newWeekStart);
    }
  };

  const handleNextWeek = () => {
    onWeekChange(addDays(currentWeekStart, 7));
  };

  // Calculate if we can actually go to previous week
  const today = startOfDay(new Date());
  const previousWeekStart = addDays(currentWeekStart, -7);
  const previousWeekEnd = endOfWeek(previousWeekStart, { weekStartsOn: 1 });
  const actualCanGoPrevious = previousWeekEnd >= today;

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
