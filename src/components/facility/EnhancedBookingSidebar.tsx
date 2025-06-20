
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SelectedSlotsSection } from "./sidebar/SelectedSlotsSection";
import { BookingDetailsSection } from "./sidebar/BookingDetailsSection";
import { ReservationCartSection } from "./sidebar/ReservationCartSection";
import { BookingPriceCalculation } from "./sidebar/BookingPriceCalculation";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Clock, CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ActorType } from "@/types/pricing";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";

interface EnhancedBookingSidebarProps {
  facilityId: string;
  facilityName: string;
  selectedSlots: SelectedTimeSlot[];
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
  const { items, removeFromCart, getTotalPrice, getItemCount } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [actorType, setActorType] = useState<ActorType>('private-person');
  
  // Transform selectedSlots to match SelectedSlotsSection expected format
  const transformedSlotsByDate = selectedSlots.reduce((acc, slot) => {
    const dateKey = format(slot.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    // Create a unique ID for the slot that matches what we'll use for removal
    const slotId = `${slot.zoneId}-${dateKey}-${slot.timeSlot}`;
    
    // Parse timeSlot to get start and end times
    const [startTime, endTime] = slot.timeSlot.includes('-') 
      ? slot.timeSlot.split('-').map(t => t.trim())
      : [slot.timeSlot, slot.timeSlot];
    
    acc[dateKey].push({
      id: slotId,
      date: format(slot.date, 'yyyy-MM-dd'),
      startTime,
      endTime,
      zone: slot.zoneId,
      price: undefined // Price will be calculated separately
    });
    
    return acc;
  }, {} as Record<string, Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    zone?: string;
    price?: number;
  }>>);

  const totalDuration = selectedSlots.length; // Assuming each slot is 1 hour

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  // Updated handleSlotRemove to match the ID generation logic
  const handleSlotRemove = (slotId: string) => {
    console.log('Removing slot with ID:', slotId);
    onSlotRemove(slotId);
  };

  if (selectedSlots.length === 0 && items.length === 0) {
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
              <span>{Object.keys(transformedSlotsByDate).length} dag(er)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{totalDuration} time(r)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Time Slots */}
      {selectedSlots.length > 0 && (
        <SelectedSlotsSection 
          slotsByDate={transformedSlotsByDate}
          onSlotRemove={handleSlotRemove}
        />
      )}

      {/* Price Calculation */}
      {selectedSlots.length > 0 && (
        <BookingPriceCalculation
          selectedSlots={selectedSlots}
          facilityId={facilityId}
          actorType={actorType}
          onActorTypeChange={setActorType}
        />
      )}

      {/* Booking Details Form */}
      {selectedSlots.length > 0 && (
        <BookingDetailsSection 
          isOpen={isBookingDetailsOpen}
          onToggle={setIsBookingDetailsOpen}
          formData={{
            customerType: 'private',
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            organization: '',
            purpose: ''
          }}
          validationErrors={{}}
          bookingErrors={[]}
          onFormFieldChange={() => {}}
          onContinueBooking={() => {}}
          onResetBooking={() => {}}
          isBookingInProgress={false}
          canProceed={false}
          requiresApproval={false}
          isFormValid={false}
        />
      )}

      {/* Reservation Cart */}
      <ReservationCartSection 
        isOpen={isCartOpen}
        onToggle={setIsCartOpen}
        cartItems={items}
        itemCount={getItemCount()}
        totalPrice={getTotalPrice()}
        onRemoveItem={removeFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
}
