
export interface OpeningHours {
  id?: string;
  facility_id: number;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  open_time: string; // HH:mm format
  close_time: string; // HH:mm format
  is_open: boolean;
  valid_from?: string | null;
  valid_to?: string | null;
  created_at?: string;
}
