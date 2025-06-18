
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedCustomerTypeSelector } from '@/components/booking/EnhancedCustomerTypeSelector';
import { ActorType } from '@/types/pricing';

interface CustomerTypeSectionProps {
  value: ActorType;
  onChange: (type: ActorType) => void;
}

export function CustomerTypeSection({ value, onChange }: CustomerTypeSectionProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <EnhancedCustomerTypeSelector
          value={value}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
}
