
import { AdditionalService } from '@/types/additionalServices';

export const localizedMockServiceData: Record<string, AdditionalService[]> = {
  'NO': [
    {
      id: "1",
      name: "Catering tjeneste",
      description: "Profesjonell catering for arrangementer",
      category: "catering",
      base_price: 150,
      unit: "per person",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
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
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  'EN': [
    {
      id: "1", 
      name: "Catering Service",
      description: "Professional catering for events",
      category: "catering",
      base_price: 150,
      unit: "per person",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
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
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};
