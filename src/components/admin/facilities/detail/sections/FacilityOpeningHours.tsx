
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';

interface OpeningHours {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface FacilityOpeningHoursProps {
  facility: {
    id: number;
    openingHours?: OpeningHours[];
  };
}

export function FacilityOpeningHours({ facility }: FacilityOpeningHoursProps) {
  const handleAddHours = () => {
    console.log('Add opening hours for facility:', facility.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Opening Hours
          </div>
          <Button onClick={handleAddHours} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Hours
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!facility.openingHours || facility.openingHours.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No opening hours configured</p>
            <p className="text-sm text-gray-400">
              Add opening hours to define when the facility is available
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {facility.openingHours.map((hours) => (
              <div key={hours.id} className="p-3 border rounded-lg">
                Day {hours.dayOfWeek}: {hours.openTime} - {hours.closeTime}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
