
import { AdditionalService } from '@/types/additionalServices';

export const mockServiceData: AdditionalService[] = [
  {
    id: "1",
    name: "Catering Service",
    description: "Professional catering for events",
    category: "catering",
    unit: "per person",
    is_active: true,
    createdAt: new Date(), // Changed from created_at
    updatedAt: new Date(), // Changed from updated_at
    
    // Required fields for compatibility
    facilityIds: [],
    pricing: {
      basePrice: 150,
      currency: "NOK",
      pricingType: "per-person",
      actorTypeMultipliers: {
        'private-person': 1,
        'lag-foreninger': 0.8,
        'paraply': 0.7,
        'private-firma': 1.2,
        'kommunale-enheter': 0.9
      }
    },
    availability: {
      isAlwaysAvailable: true,
      leadTimeHours: 24,
      maxAdvanceBookingDays: 365,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: [],
      equipmentRequired: []
    },
    metadata: {
      tags: []
    },
    isActive: true
  }
];
