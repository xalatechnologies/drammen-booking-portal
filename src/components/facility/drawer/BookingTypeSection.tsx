
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookingTypeSelector } from '@/components/booking/BookingTypeSelector';
import { BookingType } from '@/types/pricing';

interface BookingTypeSectionProps {
  value: string;
  onChange: (type: string) => void;
}

export function BookingTypeSection({ value, onChange }: BookingTypeSectionProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <BookingTypeSelector
          selectedType={value}
          onTypeChange={onChange}
        />
      </CardContent>
    </Card>
  );
}
