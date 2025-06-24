
import { FacilityFormData } from "./FacilityFormSchema";

// Export the main form data type from the schema
export type { FacilityFormData };

// Additional interface for backward compatibility if needed
export interface LegacyFacilityFormData {
  name: string;
  type: string;
  area: string;
  description: string;
  capacity: number;
  area_sqm: number;
  status: string;
  has_auto_approval: boolean;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}
