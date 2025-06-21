
import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone } from "@/components/booking/types";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { CalendarWithBooking } from "@/components/shared/CalendarWithBooking";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

// Helper function to ensure date is a Date object
const ensureDate = (date: Date | string): Date => {
  return date instanceof Date ? date : new Date(date);
};

export const FacilityDetailCalendar: React.FC<FacilityDetailCalendarProps> = ({
  zones,
  selectedSlots,
  onSlotClick,
  onBulkSlotSelection,
  onClearSlots,
  onRemoveSlot,
  facilityId,
  facilityName,
  timeSlotDuration = 1
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock availability function - replace with real implementation
  const getAvailabilityStatus = useCallback((zoneId: string, date: Date, timeSlot: string) => {
    const now = new Date();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(timeHour, 0, 0, 0);
    
    if (slotDateTime < now) {
      return { status: 'unavailable', conflict: null };
    }

    // Mock random availability
    const isBooked = Math.random() > 0.8;
    return { 
      status: isBooked ? 'busy' : 'available', 
      conflict: isBooked ? { type: 'existing-booking', details: 'Allerede booket' } : null 
    };
  }, []);

  const isSlotSelected = useCallback((zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => {
      // Ensure slot.date is a Date object by converting if it's a string
      const slotDate = ensureDate(slot.date);
      return slot.zoneId === zoneId &&
        slotDate.toDateString() === date.toDateString() &&
        slot.timeSlot === timeSlot;
    });
  }, [selectedSlots]);

  const handleContinueBooking = useCallback(() => {
    // Navigate to booking form or show booking modal
    console.log('Continue with booking:', selectedSlots);
    navigate('/checkout');
  }, [selectedSlots, navigate]);

  const handleAddToCart = useCallback((bookingData: any) => {
    // Add each selected slot to cart
    bookingData.selectedSlots.forEach((slot: SelectedTimeSlot) => {
      const zone = zones.find(z => z.id === slot.zoneId);
      const duration = slot.duration || 1;
      const pricePerHour = zone?.pricePerHour || 450;
      
      addToCart({
        facilityId: bookingData.facilityId,
        facilityName: bookingData.facilityName,
        date: slot.date,
        timeSlot: slot.timeSlot,
        zoneId: slot.zoneId,
        pricePerHour,
        duration,
        organizationType: bookingData.formData.actorType as any,
        purpose: bookingData.formData.purpose,
        expectedAttendees: bookingData.formData.attendees,
        additionalServices: [],
        timeSlots: [{
          date: slot.date,
          timeSlot: slot.timeSlot,
          zoneId: slot.zoneId,
          duration
        }],
        pricing: {
          baseFacilityPrice: pricePerHour * duration,
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: pricePerHour * duration
        },
        customerInfo: {
          name: '',
          email: '',
          phone: ''
        }
      });
    });

    toast({
      title: "Lagt til i handlekurv",
      description: `${bookingData.selectedSlots.length} tidspunkt lagt til`,
    });

    // Clear selections after adding to cart
    onClearSlots();
  }, [zones, addToCart, toast, onClearSlots]);

  const handleCompleteBooking = useCallback((bookingData: any) => {
    // Add to cart first, then navigate to checkout
    handleAddToCart(bookingData);
    
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  }, [handleAddToCart, navigate]);

  return (
    <div className="container mx-auto mt-8 px-4 lg:px-0">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Tilgjengelighet og booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarWithBooking
            facilityName={facilityName}
            facilityId={facilityId}
            zones={zones}
            selectedSlots={selectedSlots}
            onSlotClick={onSlotClick}
            onBulkSlotSelection={onBulkSlotSelection}
            onRemoveSlot={onRemoveSlot}
            onClearSlots={onClearSlots}
            onContinueBooking={handleContinueBooking}
            onAddToCart={handleAddToCart}
            onCompleteBooking={handleCompleteBooking}
            getAvailabilityStatus={getAvailabilityStatus}
            isSlotSelected={isSlotSelected}
            timeSlotDuration={timeSlotDuration}
            layout="horizontal"
            compact={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};
