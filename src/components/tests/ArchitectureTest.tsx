import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/booking/BookingForm.new';
import { useBookingStore } from '@/stores/useBookingStore';
import { useFacilityAdmin } from '@/hooks/useFacilityAdmin.new';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Architecture Test Component
 * 
 * This component is used to test the new Zustand architecture with both
 * the facility admin and booking form components.
 */
export function ArchitectureTest() {
  const { tSync } = useTranslation();
  const [activeTab, setActiveTab] = useState('booking');
  
  // Test data for booking form
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([
    {
      zoneId: 'zone-1',
      date: new Date(),
      timeSlot: '14:00',
      duration: 2,
      available: true
    }
  ]);
  
  // Get booking store state and actions
  const { 
    items: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
    fetchList: fetchBookings
  } = useBookingStore();
  
  // Get facility admin state and actions
  const {
    facilities,
    isLoading: facilitiesLoading,
    error: facilitiesError,
    fetchFacilities
  } = useFacilityAdmin();
  
  // Load data on mount
  useEffect(() => {
    fetchBookings();
    fetchFacilities();
  }, [fetchBookings, fetchFacilities]);
  
  // Handle adding a test time slot
  const handleAddTimeSlot = () => {
    const newSlot: SelectedTimeSlot = {
      zoneId: 'zone-1',
      date: new Date(),
      timeSlot: '16:00',
      duration: 1,
      available: true
    };
    
    setSelectedSlots(prev => [...prev, newSlot]);
  };
  
  // Handle removing a time slot
  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    setSelectedSlots(prev => 
      prev.filter(slot => 
        slot.zoneId !== zoneId || 
        slot.date.getTime() !== date.getTime() || 
        slot.timeSlot !== timeSlot
      )
    );
  };
  
  // Handle clearing all slots
  const handleClearSlots = () => {
    setSelectedSlots([]);
  };
  
  // Handle add to cart callback
  const handleAddToCart = (bookingData: any) => {
    console.log('Added to cart:', bookingData);
  };
  
  // Handle complete booking callback
  const handleCompleteBooking = (bookingData: any) => {
    console.log('Completed booking:', bookingData);
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Zustand Architecture Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This component tests the new Zustand architecture with both the facility admin and booking form components.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Booking Store Status:</h3>
              <p>Loading: {bookingsLoading ? 'Yes' : 'No'}</p>
              <p>Error: {bookingsError ? bookingsError.message : 'None'}</p>
              <p>Bookings: {bookings.length}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Facility Store Status:</h3>
              <p>Loading: {facilitiesLoading ? 'Yes' : 'No'}</p>
              <p>Error: {facilitiesError ? String(facilitiesError) : 'None'}</p>
              <p>Facilities: {facilities.length}</p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="booking">Booking Form Test</TabsTrigger>
              <TabsTrigger value="facilities">Facilities Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="booking" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button onClick={handleAddTimeSlot}>Add Test Time Slot</Button>
                <Button variant="outline" onClick={handleClearSlots}>Clear All Slots</Button>
              </div>
              
              <BookingForm
                selectedSlots={selectedSlots}
                facilityId="facility-1"
                facilityName="Test Facility"
                zones={[
                  { id: 'zone-1', name: 'Main Hall', capacity: 100 },
                  { id: 'zone-2', name: 'Meeting Room', capacity: 20 }
                ]}
                onAddToCart={handleAddToCart}
                onCompleteBooking={handleCompleteBooking}
                onSlotsCleared={handleClearSlots}
                onRemoveSlot={handleRemoveSlot}
              />
            </TabsContent>
            
            <TabsContent value="facilities" className="space-y-4">
              <Button onClick={fetchFacilities}>Refresh Facilities</Button>
              
              {facilitiesLoading ? (
                <p>Loading facilities...</p>
              ) : facilitiesError ? (
                <p className="text-red-500">Error: {String(facilitiesError)}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {facilities.map(facility => (
                    <Card key={facility.id}>
                      <CardHeader>
                        <CardTitle>{facility.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{facility.description}</p>
                        <p className="mt-2">
                          <span className="font-medium">Type:</span> {facility.facilityType}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span> {facility.status}
                        </p>
                        <p>
                          <span className="font-medium">Capacity:</span> {facility.capacity}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {facilities.length === 0 && !facilitiesLoading && !facilitiesError && (
                <p>No facilities found. Try refreshing the data.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
