
import React from 'react';
import { useParams } from 'react-router-dom';
import { BookingForm } from '@/components/booking/BookingForm';
import { useFacilityData } from '@/hooks/useFacilityData';

export default function BookingPage() {
  const { facilityId } = useParams();
  const { facility, zones, isLoading } = useFacilityData(facilityId);

  if (isLoading) {
    return <div>Laster...</div>;
  }

  if (!facility) {
    return <div>Fant ikke fasiliteten</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Book {facility.name}</h1>
      <BookingForm
        selectedSlots={[]}
        facilityId={facilityId!}
        facilityName={facility.name}
        zones={zones}
      />
    </div>
  );
}
