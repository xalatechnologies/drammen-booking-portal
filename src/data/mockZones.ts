
import { Zone } from '@/types/zone';

export const mockZones: Zone[] = [
  {
    id: "1",
    name: "Hele lokalet",
    facilityId: "1", // Changed from facility_id
    type: "room",
    capacity: 30,
    description: "Complete facility with all equipment",
    is_main_zone: true,
    parent_zone_id: null,
    bookable_independently: true,
    area_sqm: 120,
    floor: "1",
    coordinates_x: 0,
    coordinates_y: 0,
    coordinates_width: 120,
    coordinates_height: 80,
    equipment: ["Projektor", "Lydanlegg", "Whiteboard"],
    accessibility_features: ["wheelchair", "hearing-loop"],
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
