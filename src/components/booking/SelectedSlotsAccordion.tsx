
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

  const totalHours = selectedSlots.length;

  return (
    <div className="bg-navy-50/50 rounded-lg border border-navy-200/60 overflow-hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value="selected-times" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline bg-navy-100/30 hover:bg-navy-100/50 transition-colors">
            <div className="flex items-center gap-3 text-navy-900">
              <Clock className="h-5 w-5" />
              <span className="font-medium">
                {selectedSlots.length === 0 
                  ? 'Ingen tidspunkt valgt' 
                  : `${totalHours} ${totalHours === 1 ? 'time' : 'timer'} valgt`}
              </span>
              {selectedSlots.length > 0 && (
                <span className="text-sm text-navy-600 ml-2">
                  Klikk for detaljer
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedSlots.map((slot, index) => (
                <div key={`${slot.zoneId}-${slot.date.toISOString()}-${slot.timeSlot}`} 
                     className="flex items-center justify-between p-3 bg-white rounded border border-navy-200/60 shadow-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-navy-900 font-medium text-sm">
                      <Calendar className="h-4 w-4" />
                      {format(slot.date, 'EEE d. MMM', { locale: nb })}
                    </div>
                    <div className="flex items-center gap-4 text-navy-700 text-sm mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {slot.timeSlot}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {getZoneName(slot.zoneId)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSlot(slot)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
