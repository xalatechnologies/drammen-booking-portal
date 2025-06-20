
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface SelectedSlotsAccordionProps {
  selectedSlots: SelectedTimeSlot[];
  zones: Zone[];
  onRemoveSlot: (slot: SelectedTimeSlot) => void;
}

export function SelectedSlotsAccordion({
  selectedSlots,
  zones,
  onRemoveSlot
}: SelectedSlotsAccordionProps) {
  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone?.name || 'Ukjent sone';
  };

  return (
    <Accordion type="single" collapsible defaultValue="selected-times">
      <AccordionItem value="selected-times">
        <AccordionTrigger className="text-lg font-medium">
          Oversikt av valgte tider ({selectedSlots.length})
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {selectedSlots.map((slot, index) => (
              <div key={`${slot.zoneId}-${slot.date.toISOString()}-${slot.timeSlot}`} 
                   className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-blue-900 font-medium">
                    <Calendar className="h-4 w-4" />
                    {format(slot.date, 'EEEE d. MMMM yyyy', { locale: nb })}
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 text-sm mt-1">
                    <Clock className="h-4 w-4" />
                    {slot.timeSlot}
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 text-sm mt-1">
                    <MapPin className="h-4 w-4" />
                    {getZoneName(slot.zoneId)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSlot(slot)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
