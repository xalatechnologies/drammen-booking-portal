
import { supabase } from "@/integrations/supabase/client";

export interface Calendar {
  id: string;
  location_id: string;
  date: string;
  slot_length: number;
  created_at: string;
  updated_at: string;
}

export interface CalendarBlock {
  id: string;
  calendar_id: string;
  start_time: string;
  end_time: string;
  block_type: 'STROTIME' | 'FASTLÅN' | 'RAMMETID' | 'SPERRET';
  is_available: boolean;
  booking_id?: string;
  created_at: string;
  updated_at: string;
}

export class CalendarService {
  static async getCalendarForDate(locationId: string, date: string): Promise<Calendar | null> {
    const { data, error } = await supabase
      .from('app_calendars')
      .select('*')
      .eq('location_id', locationId)
      .eq('date', date)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  static async createCalendar(locationId: string, date: string, slotLength: number = 60): Promise<Calendar> {
    const { data, error } = await supabase
      .from('app_calendars')
      .insert({
        location_id: locationId,
        date,
        slot_length: slotLength
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getCalendarBlocks(calendarId: string): Promise<CalendarBlock[]> {
    const { data, error } = await supabase
      .from('app_calendar_blocks')
      .select('*')
      .eq('calendar_id', calendarId)
      .order('start_time', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async createCalendarBlock(block: Omit<CalendarBlock, 'id' | 'created_at' | 'updated_at'>): Promise<CalendarBlock> {
    const { data, error } = await supabase
      .from('app_calendar_blocks')
      .insert(block)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateCalendarBlock(id: string, updates: Partial<CalendarBlock>): Promise<CalendarBlock> {
    const { data, error } = await supabase
      .from('app_calendar_blocks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async deleteCalendarBlock(id: string): Promise<void> {
    const { error } = await supabase
      .from('app_calendar_blocks')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
