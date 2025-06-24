
import React from 'react';
import { useParams } from 'react-router-dom';
import { BookingForm } from '@/components/booking/BookingForm';
import { useFacility } from '@/hooks/useFacility';
import { useZones } from '@/hooks/useZones';
import { convertDatabaseZoneToBookingZone } from '@/utils/zoneConverter';

export default function BookingPage() {
  const { facilityId } = useParams();
  const { facility, isLoading, error } = useFacility(Number(facilityId));
  const { data: zones = [], isLoading: zonesLoading } = useZones(facilityId);

  const isLoadingAny = isLoading || zonesLoading;

  if (isLoadingAny) {
    return <div>Laster...</div>;
  }

  if (error || !facility) {
    return <div>Fant ikke fasiliteten</div>;
  }

  // Convert database zones to booking zones format
  const bookingZones = zones.map(convertDatabaseZoneToBookingZone);

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
