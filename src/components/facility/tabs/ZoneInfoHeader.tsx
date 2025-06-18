
import React from 'react';
import { Users, DollarSign, Repeat, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

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
      {/* Zone Info Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 font-inter">{zone.name}</h4>
          <p className="text-sm text-gray-600 font-inter">Klikk på ledige timer for å velge tidsrom</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border text-sm font-inter">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{zone.capacity}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border text-sm font-inter">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">{zone.pricePerHour} kr/t</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
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
          
          {selectedSlots.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-inter"
            >
              <Trash2 className="h-4 w-4" />
              Tøm valg ({selectedSlots.length})
            </Button>
          )}
        </div>

        {selectedSlots.length > 0 && (
          <Button
            onClick={onBookingDrawerOpen}
            className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] font-inter"
          >
            <ShoppingCart className="h-4 w-4" />
            Book {selectedSlots.length} tidspunkt
          </Button>
        )}
      </div>
    </>
  );
}
