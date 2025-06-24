
import React from "react";
import { format, addDays, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nb } from "date-fns/locale";

interface WeekNavigationProps {
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  canGoPrevious: boolean;
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeekStart,
  setCurrentWeekStart,
  canGoPrevious,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
      <Button 
        variant="outline" 
        onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
        disabled={!canGoPrevious}
        className="flex items-center gap-2 h-10 px-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Forrige
      </Button>
      
      <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
        <Calendar className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-blue-900">
          {format(currentWeekStart, "dd.MM", { locale: nb })} - {format(addDays(currentWeekStart, 6), "dd.MM.yyyy", { locale: nb })}
        </span>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
        className="flex items-center gap-2 h-10 px-4"
      >
        Neste
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
