
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnumSelectProps {
  enumType: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function EnumSelect({ enumType, value, onValueChange, placeholder }: EnumSelectProps) {
  // Simplified enum options - would need to be expanded based on actual enums
  const getEnumOptions = (type: string) => {
    switch (type) {
      case 'booking_status':
        return [
          { key: 'draft', label: 'Draft' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'cancelled', label: 'Cancelled' }
        ];
      case 'actor_type':
        return [
          { key: 'private-person', label: 'Privatperson' },
          { key: 'lag-foreninger', label: 'Lag og foreninger' },
          { key: 'private-firma', label: 'Privat firma' }
        ];
      default:
        return [];
    }
  };

  const options = getEnumOptions(enumType);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
