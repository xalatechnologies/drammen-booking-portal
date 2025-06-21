
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function BookingTypeSelector({ selectedType, onTypeChange }: BookingTypeSelectorProps) {
  const types = [
    { id: 'engangs', label: 'Enkelt booking', description: 'Én gang booking' },
    { id: 'fast', label: 'Fast tid', description: 'Gjentakende booking' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookingtype</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {types.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? 'default' : 'outline'}
              onClick={() => onTypeChange(type.id)}
              className="h-auto p-4 flex flex-col items-center"
            >
              <span className="font-medium">{type.label}</span>
              <span className="text-sm text-muted-foreground">{type.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
