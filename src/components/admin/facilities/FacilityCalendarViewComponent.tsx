import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facility } from '@/types/facility';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';
import { ArrowLeft, Calendar } from 'lucide-react';

interface FacilityCalendarViewComponentProps {
  facility: Facility;
  onBack: () => void;
}

const FacilityCalendarViewComponent: React.FC<FacilityCalendarViewComponentProps> = ({
  facility,
  onBack
}) => {
  const { tSync } = useJsonTranslation();
  const currentMonth = new Date().toLocaleString('no-NO', { month: 'long', year: 'numeric' });
  
  // Mock days for the current month
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  
  // Generate some mock bookings
  const mockBookings = [
    { day: 5, time: '10:00 - 12:00', organization: 'Drammen Idrettslag' },
    { day: 12, time: '14:00 - 16:00', organization: 'Konnerud Skole' },
    { day: 18, time: '18:00 - 20:00', organization: 'Drammen Kommune' },
    { day: 25, time: '09:00 - 11:00', organization: 'Strømsø IL' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {tSync('admin.common.back')}
        </Button>
        <h2 className="text-2xl font-bold">{facility.name}</h2>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {tSync('admin.facilities.calendar.title')} - {currentMonth}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              {tSync('admin.facilities.calendar.previous')}
            </Button>
            <Button variant="outline" size="sm">
              {tSync('admin.facilities.calendar.today')}
            </Button>
            <Button variant="outline" size="sm">
              {tSync('admin.facilities.calendar.next')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map(day => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map(day => {
              const hasBooking = mockBookings.some(booking => booking.day === day);
              const booking = mockBookings.find(booking => booking.day === day);
              
              return (
                <div 
                  key={day}
                  className={`
                    border rounded-md p-2 min-h-[80px] 
                    ${hasBooking ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'} 
                    cursor-pointer transition-colors
                  `}
                >
                  <div className="text-right text-sm font-medium">{day}</div>
                  {hasBooking && (
                    <div className="mt-1 text-xs">
                      <div className="bg-blue-100 text-blue-800 p-1 rounded">
                        {booking?.time}
                      </div>
                      <div className="mt-1 text-gray-600 truncate">
                        {booking?.organization}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 text-center mt-4">
        {tSync('admin.facilities.calendar.disclaimer')}
      </div>
    </div>
  );
};

export default FacilityCalendarViewComponent;
