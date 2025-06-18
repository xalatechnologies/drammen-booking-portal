
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface BookingOverviewCardProps {
  selectedSlots: SelectedTimeSlot[];
  facilityName: string;
  zones: Zone[];
}

export function BookingOverviewCard({ selectedSlots, facilityName, zones }: BookingOverviewCardProps) {
  // Helper function to get zone name from zoneId
  const getZoneName = (zoneId: string) => {
    const foundZone = zones.find((z: any) => z.id === zoneId);
    return foundZone ? foundZone.name : 'Ukjent sone';
  };

  // Group slots by zone for better display
  const slotsByZone = selectedSlots.reduce((acc, slot) => {
    const zoneName = getZoneName(slot.zoneId);
    if (!acc[zoneName]) {
      acc[zoneName] = [];
    }
    acc[zoneName].push(slot);
    return acc;
  }, {} as Record<string, SelectedTimeSlot[]>);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Booking oversikt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium text-lg flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            {facilityName}
          </p>
          <p className="text-base text-gray-600">{selectedSlots.length} tidspunkt valgt</p>
        </div>
        
        {/* Display slots grouped by zone */}
        <div className="space-y-3 max-h-40 overflow-auto">
          {Object.entries(slotsByZone).map(([zoneName, slots]) => (
            <div key={zoneName} className="border-l-2 border-blue-200 pl-3">
              <h5 className="text-base font-medium text-blue-900 mb-2">{zoneName}</h5>
              <div className="space-y-2">
                {slots.slice(0, 3).map((slot, index) => (
                  <div key={index} className="flex items-center justify-between text-base">
                    <span>{format(slot.date, 'EEE dd.MM', { locale: nb })}</span>
                    <Badge variant="outline" className="text-sm">
                      {slot.timeSlot}
                    </Badge>
                  </div>
                ))}
                {slots.length > 3 && (
                  <p className="text-sm text-gray-500">
                    + {slots.length - 3} flere tidspunkt i denne sonen
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
