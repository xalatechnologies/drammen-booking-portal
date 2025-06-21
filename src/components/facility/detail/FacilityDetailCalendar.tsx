
import React, { useState } from 'react';
import { Zone } from '@/components/booking/types';
import { CalendarWithBooking } from '@/components/shared/CalendarWithBooking';
import { getStableAvailabilityStatus } from '@/utils/availabilityUtils';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Clock } from 'lucide-react';

interface FacilityDetailCalendarProps {
  zones: Zone[];
  facilityId: string;
  facilityName: string;
  timeSlotDuration?: number;
  currentPattern?: any;
  onPatternChange?: (pattern: any) => void;
  onPatternApply?: (pattern: any) => void;
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
  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones[0] || null);

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

  // If only one zone, show simple layout without tabs
  if (zones.length <= 1) {
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
                selectedSlots={[]}
                onSlotClick={handleSlotClick}
                onBulkSlotSelection={handleBulkSlotSelection}
                onRemoveSlot={() => {}}
                onClearSlots={() => {}}
                onContinueBooking={handleContinueBooking}
                getAvailabilityStatus={getStableAvailabilityStatus}
                isSlotSelected={() => false}
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

  // Multiple zones - show with tabs
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
            <Tabs value={selectedZone?.id} onValueChange={(zoneId) => {
              const zone = zones.find(z => z.id === zoneId);
              setSelectedZone(zone || null);
            }}>
              <div className="mb-6">
                <TabsList className="grid w-full grid-cols-auto mb-4">
                  {zones.map((zone) => (
                    <TabsTrigger key={zone.id} value={zone.id} className="text-sm">
                      {zone.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Zone info for selected zone */}
                {selectedZone && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{selectedZone.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{selectedZone.description}</p>
                        {selectedZone.isMainZone && (
                          <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
                            Hovedsone
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {selectedZone.pricePerHour} kr
                        </div>
                        <div className="text-sm text-gray-500">per time</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{selectedZone.capacity} plasser</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{selectedZone.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          Min {selectedZone.bookingRules?.minBookingDuration || 1}t booking
                        </span>
                      </div>
                    </div>

                    {/* Equipment */}
                    {selectedZone.equipment && selectedZone.equipment.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Utstyr inkludert
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedZone.equipment.slice(0, 6).map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {zones.map((zone) => (
                <TabsContent key={zone.id} value={zone.id}>
                  <CalendarWithBooking
                    facilityName={facilityName}
                    facilityId={facilityId}
                    zones={[zone]} // Only show selected zone
                    selectedSlots={[]}
                    onSlotClick={handleSlotClick}
                    onBulkSlotSelection={handleBulkSlotSelection}
                    onRemoveSlot={() => {}}
                    onClearSlots={() => {}}
                    onContinueBooking={handleContinueBooking}
                    getAvailabilityStatus={getStableAvailabilityStatus}
                    isSlotSelected={() => false}
                    timeSlotDuration={timeSlotDuration}
                    layout="horizontal"
                    compact={false}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
