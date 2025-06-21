
import React from 'react';
import { Zone } from '@/components/booking/types';
import { CalendarWithBooking } from '@/components/shared/CalendarWithBooking';
import { getStableAvailabilityStatus } from '@/utils/availabilityUtils';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface FacilityDetailCalendarProps {
  zones: Zone[];
  facilityId: string;
  facilityName: string;
  timeSlotDuration?: number;
  currentPattern?: any;
  onPatternChange?: (pattern: any) => void;
  onPatternApply?: (pattern: any) => void;
  // Removed slot management props since we're not managing state
}

export function FacilityDetailCalendar({
  zones,
  facilityId,
  facilityName,
  timeSlotDuration = 1,
  currentPattern,
  onPatternChange,
  onPatternApply
}: FacilityDetailCalendarProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Direct slot booking without state management
  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    console.log('FacilityDetailCalendar: Direct slot booking:', { zoneId, date, timeSlot, availability });
    
    if (availability !== 'available') {
      console.log('FacilityDetailCalendar: Slot not available');
      return;
    }

    // Directly create booking and add to cart
    const zone = zones.find(z => z.id === zoneId);
    const pricePerHour = zone?.pricePerHour || 450;
    const duration = 2; // Default 2 hours

    addToCart({
      facilityId,
      facilityName,
      zoneId,
      date,
      timeSlot,
      duration,
      pricePerHour,
      purpose: 'Direct booking',
      expectedAttendees: 1,
      organizationType: 'private',
      additionalServices: [],
      timeSlots: [{
        zoneId,
        date,
        timeSlot,
        duration
      }],
      customerInfo: {
        name: '',
        email: '',
        phone: ''
      },
      pricing: {
        baseFacilityPrice: pricePerHour * duration,
        servicesPrice: 0,
        discounts: 0,
        vatAmount: 0,
        totalPrice: pricePerHour * duration
      }
    });
  };

  const handleBulkSlotSelection = (slots: any[]) => {
    console.log('FacilityDetailCalendar: Bulk booking:', slots);
    
    // Add each slot directly to cart
    slots.forEach(slot => {
      const zone = zones.find(z => z.id === slot.zoneId);
      const pricePerHour = zone?.pricePerHour || 450;
      const duration = slot.duration || 2;

      addToCart({
        facilityId,
        facilityName,
        zoneId: slot.zoneId,
        date: slot.date,
        timeSlot: slot.timeSlot,
        duration,
        pricePerHour,
        purpose: 'Bulk booking',
        expectedAttendees: 1,
        organizationType: 'private',
        additionalServices: [],
        timeSlots: [slot],
        customerInfo: {
          name: '',
          email: '',
          phone: ''
        },
        pricing: {
          baseFacilityPrice: pricePerHour * duration,
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: pricePerHour * duration
        }
      });
    });
  };

  const handleContinueBooking = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Velg tidspunkt
            </h2>
            <p className="text-gray-600 mt-1">
              Klikk på ledige tidspunkt for å legge dem direkte i handlekurven
            </p>
          </div>
          
          <div className="p-6">
            <CalendarWithBooking
              facilityName={facilityName}
              facilityId={facilityId}
              zones={zones}
              selectedSlots={[]} // No selected slots state
              onSlotClick={handleSlotClick}
              onBulkSlotSelection={handleBulkSlotSelection}
              onRemoveSlot={() => {}} // No removal needed
              onClearSlots={() => {}} // No clearing needed
              onContinueBooking={handleContinueBooking}
              getAvailabilityStatus={getStableAvailabilityStatus}
              isSlotSelected={() => false} // Never selected in state
              timeSlotDuration={timeSlotDuration}
              layout="horizontal"
              compact={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
