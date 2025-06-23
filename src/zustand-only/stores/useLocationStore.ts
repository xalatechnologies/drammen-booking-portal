import { createGenericStore } from './createGenericStore';
import { LocationApi } from './api/locationApi';
import { Location, LocationFilter, LocationCreateInput, LocationUpdateInput } from '../types/models';

// Create an instance of the location API
const locationApi = new LocationApi();

// Create and export the location store
export const useLocationStore = createGenericStore<
  Location, 
  LocationFilter, 
  LocationCreateInput, 
  LocationUpdateInput
>(locationApi);
