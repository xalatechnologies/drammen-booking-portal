
import React from 'react';
import { Repeat, Trash2, ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ZoneInfoHeaderProps {
  zone: Zone;
  selectedSlots: SelectedTimeSlot[];
  onPatternBuilderOpen: () => void;
  onClearSelection: () => void;
  onBookingDrawerOpen: () => void;
  zones?: Zone[];
}

export function ZoneInfoHeader({ 
  zone, 
  selectedSlots, 
  onPatternBuilderOpen, 
  onClearSelection, 
  onBookingDrawerOpen,
  zones = []
}: ZoneInfoHeaderProps) {
  
  // Helper function to get zone name from zoneId
  const getZoneName = (zoneId: string) => {
    const foundZone = zones.find(z => z.id === zoneId);
    return foundZone ? foundZone.name : zone.name;
  };

  return (
    <>
      {/* Recurring Booking Info and Button */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Info className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-xl">Gjentakende booking</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Opprett ukentlige eller månedlige bookinger enkelt. <br />
              Velg dager, tidspunkt og hvor ofte det skal gjentas.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onPatternBuilderOpen}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-medium px-5 py-3 shrink-0 text-lg"
        >
          <Repeat className="h-5 w-5" />
          Opprett mønster
        </Button>
      </div>

      {/* Enhanced Selected Slots Display */}
      {selectedSlots.length > 0 && (
        <div className="mb-6">
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xl">Valgte tidspunkt</h4>
                    <p className="text-slate-200 text-lg">{selectedSlots.length} timer valgt</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30 text-lg">
                    {selectedSlots.length} timer
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="space-y-3 max-h-40 overflow-auto">
                {selectedSlots.slice(0, 6).map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          {getZoneName(slot.zoneId)}
                        </p>
                        <p className="text-base text-gray-500">
                          {format(slot.date, 'EEEE dd. MMMM', { locale: nb })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 text-lg">
                      {slot.timeSlot}
                    </Badge>
                  </div>
                ))}
                {selectedSlots.length > 6 && (
                  <div className="text-center py-2">
                    <p className="text-lg text-gray-500 bg-gray-100 rounded-lg py-2 px-3">
                      + {selectedSlots.length - 6} flere tidspunkt
                    </p>
                  </div>
                )}
              </div>

              {/* Book Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={onBookingDrawerOpen}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xl"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Book {selectedSlots.length} tidspunkt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
