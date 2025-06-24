
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
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Prismodell</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {modes.map((mode) => (
            <Button
              key={mode.id}
              variant={selectedMode === mode.id ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange(mode.id)}
              className="flex flex-col items-center p-3 h-auto"
            >
              <span className="font-medium">{mode.label}</span>
              <span className="text-xs opacity-70">{mode.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
