
import React from 'react';
import { addDays } from 'date-fns';
import { NavigationButton } from './navigation/NavigationButton';
import { WeekDisplay } from './navigation/WeekDisplay';

interface WeekNavigationProps {
  currentWeekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
  canGoPrevious: boolean;
}

export function WeekNavigation({ currentWeekStart, onWeekChange, canGoPrevious }: WeekNavigationProps) {
  const handlePreviousWeek = () => {
    onWeekChange(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    onWeekChange(addDays(currentWeekStart, 7));
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <NavigationButton
        direction="previous"
        onClick={handlePreviousWeek}
        disabled={!canGoPrevious}
      />
      
      <WeekDisplay currentWeekStart={currentWeekStart} />
      
      <NavigationButton
        direction="next"
        onClick={handleNextWeek}
      />
    </div>
  );
}
