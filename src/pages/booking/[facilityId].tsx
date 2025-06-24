
import React from 'react';
import { useParams } from 'react-router-dom';
import { BookingForm } from '@/components/booking/BookingForm';
import { useFacility } from '@/hooks/useFacility';
import { useZones } from '@/hooks/useZones';
import { convertZoneToBookingZone } from '@/utils/zoneConverter';

export default function BookingPage() {
  const { facilityId } = useParams();
  const facilityIdNum = facilityId ? parseInt(facilityId, 10) : 0;
  const { facility, isLoading, error } = useFacility(facilityIdNum);
  const { data: zones = [], isLoading: zonesLoading } = useZones(facilityId);

  const isLoadingAny = isLoading || zonesLoading;

  if (isLoadingAny) {
    return <div>Laster...</div>;
  }

  if (error || !facility) {
    return <div>Fant ikke Lokalen</div>;
  }

  // Convert zones to booking zones format
  const bookingZones = zones.map(convertZoneToBookingZone);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Book {facility.name}</h1>
      <BookingForm
        selectedSlots={[]}
        facilityId={facilityId!}
        facilityName={facility.name}
        zones={bookingZones}
      />
    </div>
  );
}
