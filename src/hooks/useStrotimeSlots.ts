
import { useSimpleQuery } from './useSimpleQuery';

export function useStrotimeSlots(facilityId?: string) {
  return useSimpleQuery('app_bookings', facilityId);
}
