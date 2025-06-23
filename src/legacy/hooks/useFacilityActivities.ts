
import { useQuery } from '@tanstack/react-query';
import { FacilityActivityService } from '@/services/facilityActivityService';
import { useLanguage } from '@/contexts/LanguageContext';

export function useFacilityActivities(facilityId: number) {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['facility-activities', facilityId, language],
    queryFn: () => FacilityActivityService.getFacilitySuitableActivities(facilityId, language),
    enabled: !!facilityId && facilityId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
