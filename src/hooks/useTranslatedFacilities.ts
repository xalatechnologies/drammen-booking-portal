
import { useSimpleQuery } from './useSimpleQuery';

export function useTranslatedFacilities() {
  return useSimpleQuery('app_locations');
}
