import React, { useState, useCallback } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zone } from "@/components/booking/types";
import { SelectedTimeSlot, RecurrencePattern, recurrenceEngine } from "@/utils/recurrenceEngine";
import { useAvailabilityStatus } from "../tabs/useAvailabilityStatus";
import { BookingForm } from '@/components/booking/BookingForm';

interface FacilityDetailCalendarProps {
  zones: Zone[];
  selectedSlots: SelectedTimeSlot[];
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection: (slots: SelectedTimeSlot[]) => void;
  onClearSlots: () => void;
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  facilityId: string;
  facilityName: string;
  currentPattern?: any;
  onPatternChange?: (pattern: any) => void;
  onPatternApply?: (pattern: any) => void;
  timeSlotDuration?: number;
}

export const FacilityDetailCalendar: React.FC<FacilityDetailCalendarProps> = ({
  zones,
  selectedSlots,
  onSlotClick,
  onBulkSlotSelection,
  onClearSlots,
  onRemoveSlot,
  facilityId,
  facilityName,
  currentPattern,
  onPatternChange,
  onPatternApply,
  timeSlotDuration = 1
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  return (
    <div className="container mx-auto mt-8 px-4 lg:px-0">
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Tilgjengelighet
          </CardTitle>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Forrige
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              Neste
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Calendar Section */}
            <div className="lg:col-span-3 p-4">
              {/* Calendar Component Here */}
              <p>Kalender kommer her...</p>
            </div>

            {/* Booking Form Section */}
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <BookingForm
                  selectedSlots={selectedSlots}
                  facilityId={facilityId}
                  facilityName={facilityName}
                  zones={zones}
                  onAddToCart={(bookingData) => {
                    console.log('FacilityDetailCalendar: Booking added to cart:', bookingData);
                  }}
                  onCompleteBooking={(bookingData) => {
                    console.log('FacilityDetailCalendar: Booking completed:', bookingData);
                  }}
                  onSlotsCleared={onClearSlots}
                  onRemoveSlot={onRemoveSlot}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
