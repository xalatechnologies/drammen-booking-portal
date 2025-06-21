
import { Zone } from '@/types/zone';

export const mockZones: Zone[] = [
  {
    id: "1",
    name: "Hele lokalet",
    facilityId: 1,
    capacity: 30,
    pricePerHour: 450,
    equipment: ["Projektor", "Lydanlegg", "Whiteboard"],
    area: "120 m²",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
