
import { FacilityFilters } from "@/types/facility";
import { useFacilities } from "@/hooks/useFacilities";
import { useNavigate } from "react-router-dom";
import { transformFacilitiesToCalendarFormat } from "@/components/calendar/utils/facilityTransformer";
import { getStableAvailabilityStatus } from "@/utils/availabilityUtils";

interface UseCalendarViewProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: [number, number];
}

export function useCalendarView({
  date,
  facilityType,
  location,
  accessibility,
  capacity
}: UseCalendarViewProps) {
  const navigate = useNavigate();
  
  // Create filters from props
  const filters: FacilityFilters = {
    facilityType: facilityType !== "all" ? facilityType : undefined,
    location: location !== "all" ? location : undefined,
    accessibility: accessibility !== "all" ? accessibility : undefined,
    capacity: capacity && (capacity[0] > 0 || capacity[1] < 200) ? capacity : undefined,
    date: date || undefined,
  };

  const { facilities, isLoading, error } = useFacilities({
    pagination: { page: 1, limit: 50 },
    filters
  });

  const facilitiesWithZones = transformFacilitiesToCalendarFormat(facilities);
  const displayFacility = facilitiesWithZones[0];
  const allZones = facilitiesWithZones.flatMap(f => f.zones);

  return {
    facilitiesWithZones,
    isLoading,
    error,
    getAvailabilityStatus: getStableAvailabilityStatus,
    displayFacility,
    allZones,
    navigate
  };
}
