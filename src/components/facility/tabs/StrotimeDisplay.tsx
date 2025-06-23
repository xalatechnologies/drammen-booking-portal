
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CalendarDays } from 'lucide-react';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';

interface StrotimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSpots: number;
  maxSpots: number;
}

interface StrotimeDisplayProps {
  facilityId: number;
  onBookSlot?: (slotId: string) => void;
}

// Mock data for strotime slots
const mockStrotimeSlots: StrotimeSlot[] = [
  {
    id: '1',
    date: '2025-06-24',
    startTime: '09:00',
    endTime: '10:00',
    price: 150,
    availableSpots: 3,
    maxSpots: 5
  },
  {
    id: '2',
    date: '2025-06-24',
    startTime: '10:00',
    endTime: '11:00',
    price: 150,
    availableSpots: 1,
    maxSpots: 5
  },
  {
    id: '3',
    date: '2025-06-24',
    startTime: '18:00',
    endTime: '19:00',
    price: 200,
    availableSpots: 4,
    maxSpots: 6
  },
  {
    id: '4',
    date: '2025-06-25',
    startTime: '09:00',
    endTime: '10:00',
    price: 150,
    availableSpots: 0,
    maxSpots: 5
  }
];

export const StrotimeDisplay: React.FC<StrotimeDisplayProps> = ({
  facilityId,
  onBookSlot
}) => {
  const { tSync } = useJsonTranslation();

  const handleBookSlot = (slotId: string) => {
    if (onBookSlot) {
      onBookSlot(slotId);
    } else {
      console.log('Booking slot:', slotId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailabilityStatus = (slot: StrotimeSlot) => {
    if (slot.availableSpots === 0) return 'full';
    if (slot.availableSpots <= 2) return 'limited';
    return 'available';
  };

  const getAvailability = (slot: StrotimeSlot) => {
    const status = getAvailabilityStatus(slot);
    switch (status) {
      case 'full':
        return { color: 'destructive', text: tSync('strotime.full', 'Full') };
      case 'limited':
        return { color: 'secondary', text: `${slot.availableSpots} ${tSync('strotime.spotsLeft', 'spots left')}` };
      default:
        return { color: 'default', text: `${slot.availableSpots} ${tSync('strotime.available', 'available')}` };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {tSync('strotime.title', 'Drop-in Slots (Strøtimer)')}
        </h3>
        <p className="text-gray-600">
          {tSync('strotime.description', 'Book individual time slots released from regular bookings')}
        </p>
      </div>

      {mockStrotimeSlots.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CalendarDays className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">
              {tSync('strotime.noSlots', 'No Drop-in Slots Available')}
            </h4>
            <p className="text-gray-500">
              {tSync('strotime.checkBack', 'Check back later for available time slots')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mockStrotimeSlots.map((slot) => {
            const availability = getAvailability(slot);
            const isBookable = slot.availableSpots > 0;
            
            return (
              <Card key={slot.id} className={`transition-all ${isBookable ? 'hover:shadow-md' : 'opacity-75'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-semibold text-lg text-gray-900">
                          {formatDate(slot.date)}
                        </h4>
                        <Badge variant={availability.color as any}>
                          {availability.text}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{slot.maxSpots} {tSync('strotime.maxParticipants', 'max participants')}</span>
                        </div>
                        <div className="font-medium text-gray-900">
                          {slot.price} NOK
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleBookSlot(slot.id)}
                        disabled={!isBookable}
                        className="whitespace-nowrap"
                      >
                        {isBookable 
                          ? tSync('strotime.bookSlot', 'Book Slot')
                          : tSync('strotime.full', 'Full')
                        }
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

