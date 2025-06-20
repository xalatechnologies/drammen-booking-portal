
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface ZoneInfoHeaderProps {
  zone: Zone;
  selectedSlots: SelectedTimeSlot[];
  onPatternBuilderOpen: () => void;
  onClearSelection: () => void;
  onBookingDrawerOpen: () => void;
  zones: Zone[];
}

export function ZoneInfoHeader({ 
  zone, 
  selectedSlots
}: ZoneInfoHeaderProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{zone.name}</h2>
            <p className="text-gray-600 mt-1">{zone.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">
                Kapasitet: {zone.capacity} personer
              </Badge>
              <Badge variant="outline">
                {zone.pricePerHour} kr/time
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
