
import { LocalizedFacility } from '@/types/localization';

export const localizedMockFacilities: Record<string, LocalizedFacility[]> = {
  'NO': [
    {
      id: 1,
      name: { NO: "Idrettshall Nord", EN: "Sports Hall North" },
      address: { NO: "Nordveien 123, Oslo", EN: "North Road 123, Oslo" },
      description: { NO: "Moderne idrettshall", EN: "Modern sports hall" },
      equipment: { NO: ["Basketballstativ", "Volleyballnett"], EN: ["Basketball hoop", "Volleyball net"] },
      amenities: { NO: ["Garderober", "Dusjer"], EN: ["Lockers", "Showers"] },
      type: "sports",
      area: "Nord",
      capacity: 50,
      price_per_hour: 450,
      has_auto_approval: true,
      time_slot_duration: 1,
      status: "active",
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      accessibility: ["wheelchair"],
      suitableFor: ["sports"],
      hasAutoApproval: true,
      nextAvailable: "Available",
      openingHours: [],
      zones: [],
      timeSlotDuration: 1 as 1,
      season: { from: "2024-01-01", to: "2024-12-31" }
    }
  ],
  'EN': [
    {
      id: 1,
      name: { NO: "Idrettshall Nord", EN: "Sports Hall North" },
      address: { NO: "Nordveien 123, Oslo", EN: "North Road 123, Oslo" },
      description: { NO: "Moderne idrettshall", EN: "Modern sports hall" },
      equipment: { NO: ["Basketballstativ", "Volleyballnett"], EN: ["Basketball hoop", "Volleyball net"] },
      amenities: { NO: ["Garderober", "Dusjer"], EN: ["Lockers", "Showers"] },
      type: "sports",
      area: "North",
      capacity: 50,
      price_per_hour: 450,
      has_auto_approval: true,
      time_slot_duration: 1,
      status: "active",
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      accessibility: ["wheelchair"],
      suitableFor: ["sports"],
      hasAutoApproval: true,
      nextAvailable: "Available",
      openingHours: [],
      zones: [],
      timeSlotDuration: 1 as 1,
      season: { from: "2024-01-01", to: "2024-12-31" }
    }
  ]
};
