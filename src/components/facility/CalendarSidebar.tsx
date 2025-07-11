
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Repeat, Calendar, ShoppingCart, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { SimpleRecurrenceDrawer } from './recurrence/SimpleRecurrenceDrawer';
import { BookingStepsAccordion } from './sidebar/BookingStepsAccordion';

interface CalendarSidebarProps {
  selectedSlots: SelectedTimeSlot[];
  onClearSlots: () => void;
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  currentPattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onPatternApply: (pattern: RecurrencePattern) => void;
}

export function CalendarSidebar({
  selectedSlots,
  onClearSlots,
  onRemoveSlot,
  facilityId,
  facilityName,
  zones,
  currentPattern,
  onPatternChange,
  onPatternApply
}: CalendarSidebarProps) {
  const [showRecurrenceDrawer, setShowRecurrenceDrawer] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string[]>(['selected-slots']);

  const getZoneName = (zoneId: string) => {
    return zones.find(z => z.id === zoneId)?.name || zoneId;
  };

  const groupedSlots = selectedSlots.reduce((acc, slot) => {
    const dateKey = format(slot.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, SelectedTimeSlot[]>);

  const handleBookingClick = () => {
    setOpenAccordion(['booking-steps']);
  };

  return (
    <div className="space-y-4 h-full text-base">
      <Card className="sticky top-4">
        <CardContent className="p-4">
          {/* Simple Recurrence Button */}
          <div className="mb-4">
            <Button
              onClick={() => setShowRecurrenceDrawer(true)}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-base"
              variant="outline"
            >
              <Repeat className="h-4 w-4 mr-2" />
              Opprett gjentakende reservasjon
            </Button>
          </div>

          <Accordion 
            type="multiple" 
            value={openAccordion} 
            onValueChange={setOpenAccordion}
            className="space-y-2"
          >
            {/* Selected Slots Section */}
            <AccordionItem value="selected-slots" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-base">Valgte tidspunkt</div>
                    <div className="text-sm text-gray-600">
                      {selectedSlots.length} {selectedSlots.length === 1 ? 'tidspunkt' : 'tidspunkt'} valgt
                    </div>
                  </div>
                  {selectedSlots.length > 0 && (
                    <Badge variant="secondary" className="ml-auto text-sm">
                      {selectedSlots.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {selectedSlots.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-base">Ingen tidspunkt valgt</p>
                    <p className="text-sm mt-1">Klikk på kalenderen for å velge tidspunkt</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">Valgte tidspunkt:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearSlots}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Fjern alle
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {Object.entries(groupedSlots).map(([dateKey, daySlots]) => (
                        <div key={dateKey} className="space-y-1">
                          <div className="text-base font-medium text-gray-700">
                            {format(new Date(dateKey), 'EEEE dd. MMMM', { locale: nb })}
                          </div>
                          {daySlots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                              <div className="flex-1">
                                <div className="text-base font-medium">{slot.timeSlot}</div>
                                <div className="text-sm text-gray-600">{getZoneName(slot.zoneId)}</div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Book Button inside selected slots accordion */}
                    <div className="mt-4 pt-3 border-t">
                      <Button
                        onClick={handleBookingClick}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base"
                        size="lg"
                      >
                        Book {selectedSlots.length} tidspunkt
                      </Button>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Booking Steps Section */}
            {selectedSlots.length > 0 && (
              <AccordionItem value="booking-steps" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base">Fullfør booking</div>
                      <div className="text-sm text-gray-600">Legg til detaljer og bekreft</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <BookingStepsAccordion
                    selectedSlots={selectedSlots}
                    facilityId={facilityId}
                    facilityName={facilityName}
                    zones={zones}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>

      {/* Recurrence Drawer */}
      <SimpleRecurrenceDrawer
        isOpen={showRecurrenceDrawer}
        onClose={() => setShowRecurrenceDrawer(false)}
        pattern={currentPattern}
        onPatternChange={onPatternChange}
        onApplyPattern={(pattern) => {
          onPatternApply(pattern);
          setShowRecurrenceDrawer(false);
        }}
      />
    </div>
  );
}
