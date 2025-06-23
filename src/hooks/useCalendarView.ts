
import { useState, useMemo } from 'react';
import { useFacilities } from '@/hooks/useFacilities';
import { transformFacilitiesForUI } from '@/utils/facilityTransforms';

export const useCalendarView = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  
  const { data: rawFacilities = [], isLoading } = useFacilities();
  
  const facilities = useMemo(() => {
    return transformFacilitiesForUI(rawFacilities);
  }, [rawFacilities]);

  const selectedFacility = useMemo(() => {
    return selectedFacilityId ? facilities.find(f => f.id === selectedFacilityId) : null;
  }, [facilities, selectedFacilityId]);

  const weekStart = useMemo(() => {
    const start = new Date(selectedWeek);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    start.setHours(0, 0, 0, 0);
    return start;
  }, [selectedWeek]);

  const weekEnd = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6); // Sunday
    end.setHours(23, 59, 59, 999);
    return end;
  }, [weekStart]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newWeek);
  };

  return {
    facilities,
    selectedFacility,
    selectedFacilityId,
    setSelectedFacilityId,
    selectedWeek,
    setSelectedWeek,
    weekStart,
    weekEnd,
    navigateWeek,
    isLoading
  };
};
