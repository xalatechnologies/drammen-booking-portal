
import { AdditionalService } from '@/types/additionalServices';

export const mockServiceData: AdditionalService[] = [
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
];
