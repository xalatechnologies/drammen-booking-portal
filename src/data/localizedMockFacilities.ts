
import { LocalizedFacility } from '@/types/localization';
import { sportsFacilities } from './facilities/sportsFacilities';
import { swimmingFacilities } from './facilities/swimmingFacilities';
import { culturalFacilities } from './facilities/culturalFacilities';
import { meetingFacilities } from './facilities/meetingFacilities';

export const localizedMockFacilities: LocalizedFacility[] = [
  ...sportsFacilities,
  ...swimmingFacilities,
  ...culturalFacilities,
  ...meetingFacilities
];

// Helper function to get facility by ID
export const getLocalizedFacilityById = (id: number): LocalizedFacility | undefined => {
  return localizedMockFacilities.find(facility => facility.id === id);
};

// Helper function to get facilities for map (with lat/lng)
export const getLocalizedFacilitiesForMap = () => {
  return localizedMockFacilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    address: facility.address,
    lat: facility.lat,
    lng: facility.lng
  }));
};
