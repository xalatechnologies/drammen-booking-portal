
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFacility } from '@/hooks/useFacility';
import FacilityDetails from '@/components/facility/FacilityDetails';

export default function FacilityPage() {
  const { id } = useParams();
  const facilityId = id ? parseInt(id, 10) : 0;
  const { facility, isLoading, error } = useFacility(facilityId);

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (error || !facility) {
    return <div className="container mx-auto py-8">Facility not found</div>;
  }

  return <FacilityDetails facility={facility} />;
}
