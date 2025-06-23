import { Facility } from './facility';

export interface OpeningHours {
  id: string;
  facility_id: number;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  opens: string;
  closes: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
  
  // Computed/derived fields for backwards compatibility
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Alias for day_of_week
  facility?: Facility;
}
