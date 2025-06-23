
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type PricingMode = 'hourly' | 'package';

interface PricingModeSelectorProps {
  selectedMode: PricingMode;
  onModeChange: (mode: PricingMode) => void;
  availableModes?: PricingMode[];
}

export function PricingModeSelector({
  selectedMode,
  onModeChange,
  availableModes = ['hourly', 'package']
}: PricingModeSelectorProps) {
  const modes = [{
    id: 'hourly' as PricingMode,
    label: 'Per time',
    description: 'Betaling per time'
  }, {
    id: 'package' as PricingMode,
    label: 'Pakke',
    description: 'Fast pakke pris'
  }].filter(mode => availableModes.includes(mode.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pristype</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {modes.map((mode) => (
            <Button
              key={mode.id}
              variant={selectedMode === mode.id ? 'default' : 'outline'}
              onClick={() => onModeChange(mode.id)}
              className="h-auto p-4 flex flex-col items-center"
            >
              <span className="font-medium">{mode.label}</span>
              <span className="text-sm text-muted-foreground">{mode.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
