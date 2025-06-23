
import { supabase } from '@/integrations/supabase/client';

export interface BookingData {
  facilityId: number;
  zoneId?: string;
  startDate: Date;
  endDate: Date;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  purpose: string;
  expectedAttendees: number;
  actorType: string;
  eventType: string;
  description?: string;
  specialRequirements?: string;
}

export interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: any;
  termsAccepted: boolean;
}

export interface BookingServiceParams {
  selectedSlots: any[];
  facilityId: string;
  facilityName: string;
  zones?: any[];
  formData: BookingFormData;
}

export class BookingService {
  static async createBooking(data: BookingData) {
    const bookingData = {
      facility_id: data.facilityId,
      zone_id: data.zoneId,
      start_date: data.startDate.toISOString(),
      end_date: data.endDate.toISOString(),
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      purpose: data.purpose,
      expected_attendees: data.expectedAttendees,
      actor_type: data.actorType,
      event_type: data.eventType,
      description: data.description,
      special_requirements: data.specialRequirements,
      status: 'draft',
      booking_reference: `BK-${Date.now()}`,
      duration_minutes: Math.floor((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60)),
      base_price: 450,
      total_price: 450
    };

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return booking;
  }

  static async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  static async getBookingById(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static validateBookingData(params: BookingServiceParams): boolean {
    return params.selectedSlots.length > 0 && params.formData.termsAccepted;
  }

  static async addToCart(params: BookingServiceParams) {
    console.log('Adding to cart:', params);
    return { success: true, message: 'Added to cart successfully' };
  }

  static async completeBooking(params: BookingServiceParams) {
    console.log('Completing booking:', params);
    return { success: true, message: 'Booking completed successfully' };
  }

  static calculateTotalPricing(selectedSlots: any[], zones: any[] = []) {
    const totalPrice = selectedSlots.length * 450;
    return {
      totalPrice,
      currency: 'NOK',
      breakdown: {
        basePrice: totalPrice,
        discounts: 0,
        surcharges: 0
      }
    };
  }

  static async checkAvailability(zoneId: string, date: Date, timeSlots: string[]) {
    return { success: true, data: {} };
  }

  static async getConflictingBookings(zoneId: string, startDate: Date, endDate: Date) {
    return { success: true, data: [] };
  }

  static async updateBooking(id: string, request: any) {
    return { success: true, data: { id, ...request } };
  }

  static async cancelBooking(id: string, reason?: string) {
    return { success: true, data: { id, status: 'cancelled', reason } };
  }

  static async approveBooking(id: string, notes?: string) {
    return { success: true, data: { id, status: 'approved', notes } };
  }

  static async rejectBooking(id: string, reason: string) {
    return { success: true, data: { id, status: 'rejected', reason } };
  }

  static async createRecurringBooking(request: any, pattern: any) {
    return { success: true, data: [] };
  }
}
