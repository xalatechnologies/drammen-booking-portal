
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFacility } from '@/hooks/useFacility';
import { FacilityDetails } from '@/components/facility/FacilityDetails';
import { PageLayout } from '@/components/layouts';

export default function FacilityPage() {
  const { id } = useParams();
  const facilityId = id ? parseInt(id, 10) : 0;
  const { facility, isLoading, error } = useFacility(facilityId);

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
      <FacilityDetails facility={facility} />
    </PageLayout>
  );
}
