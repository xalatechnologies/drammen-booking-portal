
// Mock FacilityTranslationService to resolve import errors
export class FacilityTranslationService {
  static async setFacilityContentKey(facilityId: string, contentType: string, contentKey: string): Promise<boolean> {
    // Mock implementation - always return success
    console.log(`Setting facility content key: ${facilityId} -> ${contentType} -> ${contentKey}`);
    return true;
  }
}

export const facilityTranslationService = new FacilityTranslationService();
