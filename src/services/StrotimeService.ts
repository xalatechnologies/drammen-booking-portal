
export interface StrotimeSlot {
  id: string;
  zone_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  price_per_slot: number;
}

export class StrotimeService {
  static async getStrotimeSlots() {
    return [];
  }
  
  static async bookStrotimeSlot() {
    return { success: true };
  }

  static async bookStrøtime(slotId: string, bookingData: any) {
    return { success: true, data: { id: slotId, ...bookingData } };
  }
}
