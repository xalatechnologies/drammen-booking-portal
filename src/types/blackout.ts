import { Facility } from './facility';

export type BlackoutType = 'maintenance' | 'holiday' | 'event' | 'other';

export interface Blackout {
  id: string;
  facility_id: number;
  start_date: string;
  end_date: string;
  type: BlackoutType;
  reason: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  facility?: Facility;
}
