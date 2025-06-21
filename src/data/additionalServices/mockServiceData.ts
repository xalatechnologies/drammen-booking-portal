
import { AdditionalService } from '@/types/additionalServices';

export const mockServiceData: AdditionalService[] = [
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
];
