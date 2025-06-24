
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface SelectedTimeSlot {
  zoneId: string;
  date: Date;
  timeSlot: string;
  duration: number;
}

interface Zone {
  id: string;
  name: string;
  area?: string;
}

interface BookingStepsAccordionProps {
  selectedSlots: SelectedTimeSlot[];
  zones: Zone[];
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  onClearAll: () => void;
  facilityId: string;
  facilityName: string;
}

export function BookingStepsAccordion({
  selectedSlots,
  zones,
  onRemoveSlot,
  onClearAll,
  facilityId,
  facilityName
}: BookingStepsAccordionProps) {
  // Group slots by date
  const slotsByDate = selectedSlots.reduce((acc, slot) => {
    const dateKey = format(slot.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, SelectedTimeSlot[]>);

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone?.name || `Zone ${zoneId}`;
  };

  const calculateTotalPrice = () => {
    return selectedSlots.length * 450; // 450 kr per slot
  };

  if (selectedSlots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            Valgte tidspunkter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Ingen tidspunkter valgt ennå
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            Valgte tidspunkter ({selectedSlots.length})
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700"
          >
            Fjern alle
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" className="w-full">
          {Object.entries(slotsByDate).map(([dateKey, slots]) => (
            <AccordionItem key={dateKey} value={dateKey}>
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(dateKey), 'EEEE dd. MMMM', { locale: nb })}
                  <Badge variant="secondary" className="ml-2">
                    {slots.length} timer
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {slots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{slot.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{getZoneName(slot.zoneId)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span>Totalt antall timer:</span>
            <span className="font-medium">{selectedSlots.length}</span>
          </div>
          <div className="flex justify-between items-center text-base font-bold">
            <span>Total pris:</span>
            <span className="text-blue-600">{calculateTotalPrice()} kr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
