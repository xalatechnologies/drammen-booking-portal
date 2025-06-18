
import React from 'react';
import { Repeat, Trash2, ShoppingCart } from 'lucide-react';
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
}

export function ZoneInfoHeader({ 
  zone, 
  selectedSlots, 
  onPatternBuilderOpen, 
  onClearSelection, 
  onBookingDrawerOpen 
}: ZoneInfoHeaderProps) {
  return (
    <>
      {/* Zone Title */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900 font-inter">{zone.name}</h4>
        <p className="text-sm text-gray-600 font-inter">Klikk på ledige timer for å velge tidsrom</p>
      </div>

      {/* Actions and Selected Slots */}
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Left side - Recurrence button */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPatternBuilderOpen}
            className="flex items-center gap-2 font-inter"
          >
            <Repeat className="h-4 w-4" />
            Gjentakende booking
          </Button>
        </div>

        {/* Right side - Selected slots and booking button */}
        <div className="flex flex-col items-end gap-3">
          {/* Selected slots display */}
          {selectedSlots.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Valgte tidspunkt ({selectedSlots.length})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-1 max-h-32 overflow-auto">
                {selectedSlots.slice(0, 5).map((slot, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-blue-800">
                      {slot.zoneName} - {format(slot.date, 'EEE dd.MM', { locale: nb })}
                    </span>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {slot.timeSlot}
                    </Badge>
                  </div>
                ))}
                {selectedSlots.length > 5 && (
                  <p className="text-xs text-blue-600 pt-1">
                    + {selectedSlots.length - 5} flere tidspunkt
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Book button */}
          {selectedSlots.length > 0 && (
            <Button
              onClick={onBookingDrawerOpen}
              className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] font-inter"
              size="lg"
            >
              <ShoppingCart className="h-4 w-4" />
              Book {selectedSlots.length} tidspunkt
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
