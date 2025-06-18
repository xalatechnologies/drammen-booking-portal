import React from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
interface SelectedSlotsDisplayProps {
  selectedSlots: SelectedTimeSlot[];
}
export function SelectedSlotsDisplay({
  selectedSlots
}: SelectedSlotsDisplayProps) {
  if (selectedSlots.length === 0) return null;
  return <Card className="bg-blue-50 border-blue-200">
      
    </Card>;
}