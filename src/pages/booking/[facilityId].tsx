
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFacility } from '@/hooks/useFacility';
import { PageLayout } from '@/components/layouts';

export default function BookingPage() {
  const { facilityId } = useParams();
  const facilityIdNumber = facilityId ? parseInt(facilityId, 10) : 0;
  const { facility, isLoading, error } = useFacility(facilityIdNumber);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">Loading facility...</div>
        </div>
      </PageLayout>
    );
  }

  if (error || !facility) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center text-red-600">
            Facility not found
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Book {facility.name}</h1>
        <p className="text-gray-600">Select your preferred time slots to make a booking.</p>
      </div>
    </PageLayout>
  );
}
