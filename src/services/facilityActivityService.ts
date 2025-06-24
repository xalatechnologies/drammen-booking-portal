
// Mock service for facility activities since the table doesn't exist in database
export interface FacilityActivity {
  id: string;
  facility_id: string;
  activity_name: string;
  category: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const facilityActivityService = {
  async getFacilityActivities(facilityId: string): Promise<FacilityActivity[]> {
    // Mock implementation - return empty array since table doesn't exist
    console.log('Mock: Getting facility activities for facility', facilityId);
    return [];
  },

  async addFacilityActivity(facilityId: string, activityName: string, category: string): Promise<FacilityActivity> {
    // Mock implementation
    const mockActivity: FacilityActivity = {
      id: `mock-${Date.now()}`,
      facility_id: facilityId,
      activity_name: activityName,
      category,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Mock: Adding facility activity', mockActivity);
    return mockActivity;
  },

  async removeFacilityActivity(facilityId: string, activityId: string): Promise<void> {
    console.log('Mock: Removing facility activity', facilityId, activityId);
  }
};
