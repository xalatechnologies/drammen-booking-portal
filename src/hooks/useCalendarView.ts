
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFacilities } from '@/hooks/useFacilities';
import { transformFacilityForUI } from '@/utils/facilityTransforms';

interface UseCalendarViewProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: [number, number];
}

export const useCalendarView = (props: UseCalendarViewProps = {}) => {
  const navigate = useNavigate();
  const { data: rawFacilities = [], isLoading, error } = useFacilities();

  const facilitiesWithZones = useMemo(() => {
    // Ensure rawFacilities is an array
    const facilitiesArray = Array.isArray(rawFacilities) ? rawFacilities : [];
    return facilitiesArray.map(transformFacilityForUI);
  }, [rawFacilities]);

  const allZones = useMemo(() => {
    return facilitiesWithZones.flatMap(facility => facility.zones || []);
  }, [facilitiesWithZones]);

  return {
    facilities: Array.isArray(rawFacilities) ? rawFacilities : [],
    facilitiesWithZones,
    isLoading,
    error,
    allZones,
    navigate,
    selectedFacility: null,
    selectedFacilityId: 0,
    setSelectedFacilityId: () => {},
    selectedWeek: new Date(),
    setSelectedWeek: () => {},
    selectedDate: new Date(),
    setSelectedDate: () => {}
  };
};
