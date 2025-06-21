
import { AdditionalService } from '@/types/additionalServices';

export const localizedMockServiceData: Record<string, AdditionalService[]> = {
  'NO': [
    {
      id: "1",
      name: "Catering tjeneste",
      description: "Profesjonell catering for arrangementer",
      category: "catering",
      basePrice: 150,
      unit: "per person",
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
      basePrice: 150,
      unit: "per person",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};
