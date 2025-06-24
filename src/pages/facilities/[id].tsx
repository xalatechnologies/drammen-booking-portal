
import React from 'react';
import { useParams } from 'react-router-dom';
import { FacilityDetailLayout } from '@/components/facility/detail/FacilityDetailLayout';
import { useFacility } from '@/hooks/useFacility';
import { useZones } from '@/hooks/useZones';
import { convertDatabaseZoneToBookingZone } from '@/utils/zoneConverter';

export default function FacilityDetailPage() {
  const { id } = useParams();
  const { facility, isLoading, error } = useFacility(Number(id));
  const { data: zones = [], isLoading: zonesLoading } = useZones(id);

  if (isLoading || zonesLoading) {
    return <div>Loading...</div>;
  }

  if (error || !facility) {
    return <div>Facility not found</div>;
  }

  // Convert database zones to booking zones format
  const bookingZones = zones.map(convertDatabaseZoneToBookingZone);

  return (
    <FacilityDetailLayout 
      facility={facility} 
      zones={bookingZones} 
    />
  );
}
