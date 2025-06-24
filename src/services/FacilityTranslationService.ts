
// Mock service for facility translations
export const facilityTranslationService = {
  async setFacilityContentKey(facilityId: string, contentType: string, contentKey: string): Promise<void> {
    console.log('Mock: Setting facility content key', facilityId, contentType, contentKey);
  },

  async getFacilityContentKey(facilityId: string, contentType: string): Promise<string | null> {
    console.log('Mock: Getting facility content key', facilityId, contentType);
    return `facility.${facilityId}.${contentType}`;
  },

  async deleteFacilityContentKey(facilityId: string, contentType: string): Promise<void> {
    console.log('Mock: Deleting facility content key', facilityId, contentType);
  }
};
