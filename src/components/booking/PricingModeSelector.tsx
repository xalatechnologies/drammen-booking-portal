
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Package } from 'lucide-react';
import { PricingMode } from '@/types/pricingModes';

interface PricingModeSelectorProps {
  value: PricingMode;
  onChange: (mode: PricingMode) => void;
  availableModes: PricingMode[];
  className?: string;
}

const pricingModeOptions = [
  {
    value: 'hourly' as PricingMode,
    label: 'Per time',
    description: 'Betaling basert på antall timer',
    icon: Clock
  },
  {
    value: 'daily' as PricingMode,
    label: 'Per dag',
    description: 'Fast pris per dag uansett varighet',
    icon: Calendar
  },
  {
    value: 'fixed' as PricingMode,
    label: 'Fastpris/Pakke',
    description: 'Fast beløp for definert periode',
    icon: Package
  }
];

export function PricingModeSelector({
  value,
  onChange,
  availableModes,
  className = ''
}: PricingModeSelectorProps) {
  const filteredOptions = pricingModeOptions.filter(option => 
    availableModes.includes(option.value)
  );

  if (filteredOptions.length <= 1) {
    return null; // Don't show selector if only one mode available
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <Label className="text-base font-medium mb-3 block">
          Prisingsmodell
        </Label>
        <RadioGroup value={value} onValueChange={onChange}>
          <div className="space-y-3">
            {filteredOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <Icon className="h-4 w-4 text-gray-600" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
