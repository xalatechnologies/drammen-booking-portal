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
  return;
}