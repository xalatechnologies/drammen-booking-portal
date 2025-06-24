
import { useSimpleQuery } from './useSimpleQuery';

export function useBlackoutPeriods(facilityId?: string) {
  return useSimpleQuery('app_availability_rules', facilityId);
}
