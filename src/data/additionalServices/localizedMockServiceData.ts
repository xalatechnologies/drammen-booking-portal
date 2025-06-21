
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
      updated_at: new Date().toISOString()
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
      updated_at: new Date().toISOString()
    }
  ]
};
