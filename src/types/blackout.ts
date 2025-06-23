
export interface Blackout {
  id: string;
  facility_id: number;
  start_date: string;
  end_date: string;
  type: 'maintenance' | 'renovation' | 'event' | 'weather' | 'other';
  reason: string;
  created_by: string;
  created_at: string;
}
