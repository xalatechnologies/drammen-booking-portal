
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFacilities } from '@/hooks/useFacilities';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
}

export const CalendarView: React.FC = () => {
  const { data: facilities = [], isLoading, error } = useFacilities();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock events for demonstration
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Football Training',
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 12, 0),
    },
    {
      id: '2',
      title: 'Basketball Game',
      start: new Date(2024, 0, 16, 14, 0),
      end: new Date(2024, 0, 16, 16, 0),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error loading calendar data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event) => console.log('Selected event:', event)}
            onSelectSlot={(slotInfo) => console.log('Selected slot:', slotInfo)}
            selectable
            views={['month', 'week', 'day']}
            defaultView="month"
          />
        </div>
      </CardContent>
    </Card>
  );
};
