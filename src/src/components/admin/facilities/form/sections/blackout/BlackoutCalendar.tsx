
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { format, isSameDay, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon, Info } from "lucide-react";

interface BlackoutPeriod {
  id: string;
  type: 'maintenance' | 'renovation' | 'event' | 'weather' | 'other';
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
  isRecurring: boolean;
  recurrencePattern?: string;
}

interface BlackoutCalendarProps {
  blackoutPeriods: BlackoutPeriod[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export const BlackoutCalendar: React.FC<BlackoutCalendarProps> = ({
  blackoutPeriods,
  onDateSelect,
  selectedDate
}) => {
  const { tSync } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getTypeColor = (type: string) => {
    const colors = {
      maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
      renovation: 'bg-purple-100 text-purple-800 border-purple-200',
      event: 'bg-blue-100 text-blue-800 border-blue-200',
      weather: 'bg-gray-100 text-gray-800 border-gray-200',
      other: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      maintenance: '🔧',
      renovation: '🏗️',
      event: '🎉',
      weather: '⛈️',
      other: '📋'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getBlackoutPeriodsForDate = (date: Date) => {
    return blackoutPeriods.filter(period => {
      if (isSameDay(period.startDate, period.endDate)) {
        return isSameDay(date, period.startDate);
      }
      return isWithinInterval(date, { start: period.startDate, end: period.endDate });
    });
  };

  const isBlackoutDate = (date: Date) => {
    return getBlackoutPeriodsForDate(date).length > 0;
  };

  const getDatePeriodsForSelectedDate = () => {
    if (!selectedDate) return [];
    return getBlackoutPeriodsForDate(selectedDate);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {tSync("admin.facilities.form.blackout.calendar", "Blackout Calendar")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            modifiers={{
              blackout: (date) => isBlackoutDate(date)
            }}
            modifiersStyles={{
              blackout: {
                backgroundColor: 'rgb(254, 215, 215)',
                color: 'rgb(153, 27, 27)',
                fontWeight: 'bold'
              }
            }}
            className="rounded-md border"
          />
          
          {/* Legend */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">Legend:</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                <span>Blackout periods</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Selected date</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {selectedDate 
              ? format(selectedDate, 'MMMM dd, yyyy')
              : tSync("admin.facilities.form.blackout.selectDate", "Select a date")
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div className="space-y-3">
              {getDatePeriodsForSelectedDate().length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="text-sm">
                    {tSync("admin.facilities.form.blackout.noPeriodsDate", "No blackout periods on this date")}
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {/* Handle add blackout for this date */}}
                  >
                    Add Blackout Period
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {getDatePeriodsForSelectedDate().map((period) => (
                    <div key={period.id} className="p-3 border rounded-lg bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getTypeIcon(period.type)}</span>
                        <Badge className={getTypeColor(period.type)}>
                          {period.type}
                        </Badge>
                        {period.isRecurring && (
                          <Badge variant="outline">Recurring</Badge>
                        )}
                      </div>
                      
                      <h4 className="font-medium mb-1">{period.reason}</h4>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          📅 {format(period.startDate, 'MMM dd')} - {format(period.endDate, 'MMM dd, yyyy')}
                        </div>
                        {(period.startTime || period.endTime) && (
                          <div>
                            🕐 {period.startTime || '00:00'} - {period.endTime || '23:59'}
                          </div>
                        )}
                        {period.recurrencePattern && (
                          <div>
                            🔄 {period.recurrencePattern}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <div className="text-sm">
                {tSync("admin.facilities.form.blackout.clickDate", "Click on a date to view blackout periods")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
