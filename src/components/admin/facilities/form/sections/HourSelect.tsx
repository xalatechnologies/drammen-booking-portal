import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HourSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export const HourSelect: React.FC<HourSelectProps> = ({ value, onChange, disabled }) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full h-11 text-base">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {hours.map((hour) => (
          <SelectItem key={hour} value={hour}>
            {hour}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 