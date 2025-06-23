import { createGenericStore } from './createGenericStore';
import { ZoneApi } from './api/zoneApi';
import { Zone, ZoneFilter, ZoneCreateInput, ZoneUpdateInput } from '../types/models';

// Create an instance of the zone API
const zoneApi = new ZoneApi();

// Create and export the zone store
export const useZoneStore = createGenericStore<
  Zone, 
  ZoneFilter, 
  ZoneCreateInput, 
  ZoneUpdateInput
>(zoneApi);
