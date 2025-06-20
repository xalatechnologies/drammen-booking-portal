
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SelectedSlotsSection } from "./sidebar/SelectedSlotsSection";
import { BookingDetailsSection } from "./sidebar/BookingDetailsSection";
import { ReservationCartSection } from "./sidebar/ReservationCartSection";
import { useCart } from "@/contexts/CartContext";
import { Clock, CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface EnhancedBookingSidebarProps {
  facilityId: number;
  facilityName: string;
  selectedSlots: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    zone?: string;
    price?: number;
  }>;
  onSlotRemove: (slotId: string) => void;
  onBookingComplete?: () => void;
}

export function EnhancedBookingSidebar({
  facilityId,
  facilityName,
  selectedSlots,
  onSlotRemove,
  onBookingComplete
}: EnhancedBookingSidebarProps) {
  const { reservations } = useCart();
  
  // Group slots by date for better organization
  const slotsByDate = selectedSlots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, typeof selectedSlots>);

  const totalPrice = selectedSlots.reduce((sum, slot) => sum + (slot.price || 0), 0);
  const totalDuration = selectedSlots.length; // Assuming each slot is 1 hour

  if (selectedSlots.length === 0 && reservations.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Ingen valgte tider
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            Velg tidspunkter i kalenderen for å starte booking-prosessen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Facility Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            {facilityName}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{Object.keys(slotsByDate).length} dag(er)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{totalDuration} time(r)</span>
            </div>
          </div>
          
          {totalPrice > 0 && (
            <>
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <span className="font-medium">Total pris:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {totalPrice.toLocaleString('nb-NO')} kr
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Selected Time Slots */}
      {selectedSlots.length > 0 && (
        <SelectedSlotsSection 
          slotsByDate={slotsByDate}
          onSlotRemove={onSlotRemove}
        />
      )}

      {/* Booking Details Form */}
      {selectedSlots.length > 0 && (
        <BookingDetailsSection 
          facilityId={facilityId}
          selectedSlots={selectedSlots}
          onBookingComplete={onBookingComplete}
        />
      )}

      {/* Reservation Cart */}
      <ReservationCartSection />
    </div>
  );
}
