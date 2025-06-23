
import { GenericSupabaseRepository } from '../GenericSupabaseRepository';
import { Booking } from '@/types/booking';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DatabaseBooking = Database['public']['Tables']['bookings']['Row'];
type DatabaseBookingInsert = Database['public']['Tables']['bookings']['Insert'];
type DatabaseBookingUpdate = Database['public']['Tables']['bookings']['Update'];

interface BookingCreateRequest {
  facility_id: number;
  zone_id?: string;
  start_date: string;
  end_date: string;
  user_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  purpose: string;
  expected_attendees: number;
  actor_type: string;
  event_type: string;
  age_group: string;
  total_price: number;
  description?: string;
  special_requirements?: string;
}

interface BookingUpdateRequest extends Partial<BookingCreateRequest> {
  status?: string;
}

export class BookingRepository extends GenericSupabaseRepository<Booking, DatabaseBooking> {
  protected tableName = 'bookings';

  protected mapFromDatabase(dbRecord: DatabaseBooking): Booking {
    return {
      id: dbRecord.id,
      facilityId: String(dbRecord.facility_id),
      zoneId: dbRecord.zone_id || undefined,
      userId: dbRecord.user_id,
      organizationId: dbRecord.organization_id || undefined,
      bookingReference: dbRecord.booking_reference,
      type: dbRecord.type as Booking['type'],
      status: dbRecord.status as Booking['status'],
      eventType: dbRecord.event_type as Booking['eventType'],
      expectedAttendees: dbRecord.expected_attendees,
      ageGroup: dbRecord.age_group as Booking['ageGroup'],
      actorType: dbRecord.actor_type as Booking['actorType'],
      contactName: dbRecord.contact_name,
      contactEmail: dbRecord.contact_email,
      contactPhone: dbRecord.contact_phone || undefined,
      purpose: dbRecord.purpose,
      description: dbRecord.description || undefined,
      specialRequirements: dbRecord.special_requirements || undefined,
      startDate: new Date(dbRecord.start_date),
      endDate: new Date(dbRecord.end_date),
      recurrenceRule: dbRecord.recurrence_rule || undefined,
      recurrenceEndDate: dbRecord.recurrence_end_date ? new Date(dbRecord.recurrence_end_date) : undefined,
      requiresApproval: dbRecord.requires_approval,
      approvalStatus: dbRecord.approval_status as Booking['approvalStatus'],
      additionalServices: [],
      pricing: {
        basePrice: Number(dbRecord.base_price),
        servicesPrice: Number(dbRecord.services_price),
        totalPrice: Number(dbRecord.total_price),
        currency: 'NOK',
        breakdown: []
      },
      cancelledAt: dbRecord.cancelled_at ? new Date(dbRecord.cancelled_at) : undefined,
      cancellationReason: dbRecord.cancellation_reason || undefined,
      notes: [],
      attachments: [],
      createdAt: new Date(dbRecord.created_at),
      updatedAt: new Date(dbRecord.updated_at)
    };
  }

  protected mapToDatabase(frontendRecord: Partial<Booking>): Partial<DatabaseBookingInsert> {
    return {
      facility_id: frontendRecord.facilityId ? Number(frontendRecord.facilityId) : undefined,
      zone_id: frontendRecord.zoneId,
      user_id: frontendRecord.userId,
      organization_id: frontendRecord.organizationId,
      booking_reference: frontendRecord.bookingReference,
      type: frontendRecord.type as any,
      status: frontendRecord.status as any,
      event_type: frontendRecord.eventType as any,
      expected_attendees: frontendRecord.expectedAttendees,
      age_group: frontendRecord.ageGroup as any,
      actor_type: frontendRecord.actorType as any,
      contact_name: frontendRecord.contactName,
      contact_email: frontendRecord.contactEmail,
      contact_phone: frontendRecord.contactPhone,
      purpose: frontendRecord.purpose,
      description: frontendRecord.description,
      special_requirements: frontendRecord.specialRequirements,
      start_date: frontendRecord.startDate?.toISOString(),
      end_date: frontendRecord.endDate?.toISOString(),
      duration_minutes: frontendRecord.startDate && frontendRecord.endDate ? 
        Math.floor((frontendRecord.endDate.getTime() - frontendRecord.startDate.getTime()) / (1000 * 60)) : undefined,
      recurrence_rule: frontendRecord.recurrenceRule,
      recurrence_end_date: frontendRecord.recurrenceEndDate?.toISOString(),
      requires_approval: frontendRecord.requiresApproval,
      approval_status: frontendRecord.approvalStatus as any,
      base_price: frontendRecord.pricing?.basePrice?.toString(),
      services_price: frontendRecord.pricing?.servicesPrice?.toString(),
      total_price: frontendRecord.pricing?.totalPrice?.toString(),
      payment_status: 'pending',
      cancelled_at: frontendRecord.cancelledAt?.toISOString(),
      cancellation_reason: frontendRecord.cancellationReason
    };
  }

  async getAllBookings(filters?: any): Promise<RepositoryResponse<Booking[]>> {
    return this.findAll(undefined, filters);
  }

  async getBookingById(id: string): Promise<RepositoryResponse<Booking | null>> {
    return this.findById(id);
  }

  async createBooking(bookingData: BookingCreateRequest): Promise<RepositoryResponse<Booking | null>> {
    try {
      // Generate booking reference
      const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const dbData: Partial<DatabaseBookingInsert> = {
        facility_id: bookingData.facility_id,
        zone_id: bookingData.zone_id,
        user_id: bookingData.user_id,
        booking_reference: bookingReference,
        contact_name: bookingData.contact_name,
        contact_email: bookingData.contact_email,
        contact_phone: bookingData.contact_phone,
        purpose: bookingData.purpose,
        expected_attendees: bookingData.expected_attendees,
        actor_type: bookingData.actor_type as any,
        event_type: bookingData.event_type as any,
        age_group: bookingData.age_group as any,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        duration_minutes: Math.floor((new Date(bookingData.end_date).getTime() - new Date(bookingData.start_date).getTime()) / (1000 * 60)),
        total_price: bookingData.total_price.toString(),
        base_price: bookingData.total_price.toString(),
        services_price: '0',
        description: bookingData.description,
        special_requirements: bookingData.special_requirements,
        status: 'draft' as any,
        type: 'engangs' as any,
        approval_status: 'not-required' as any,
        payment_status: 'pending'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(dbData as any)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data ? this.mapFromDatabase(data as DatabaseBooking) : null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async updateBooking(id: string, bookingData: BookingUpdateRequest): Promise<RepositoryResponse<Booking | null>> {
    try {
      const dbData: Partial<DatabaseBookingUpdate> = {
        facility_id: bookingData.facility_id,
        zone_id: bookingData.zone_id,
        contact_name: bookingData.contact_name,
        contact_email: bookingData.contact_email,
        contact_phone: bookingData.contact_phone,
        purpose: bookingData.purpose,
        expected_attendees: bookingData.expected_attendees,
        actor_type: bookingData.actor_type as any,
        event_type: bookingData.event_type as any,
        age_group: bookingData.age_group as any,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        duration_minutes: bookingData.start_date && bookingData.end_date ? 
          Math.floor((new Date(bookingData.end_date).getTime() - new Date(bookingData.start_date).getTime()) / (1000 * 60)) : undefined,
        total_price: bookingData.total_price?.toString(),
        description: bookingData.description,
        special_requirements: bookingData.special_requirements,
        status: bookingData.status as any,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('bookings')
        .update(dbData as any)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data ? this.mapFromDatabase(data as DatabaseBooking) : null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async deleteBooking(id: string): Promise<RepositoryResponse<boolean>> {
    return this.delete(id);
  }

  async checkBookingConflicts(bookingData: any): Promise<RepositoryResponse<{
    hasConflict: boolean;
    conflictingBookings: Booking[];
    availableAlternatives: any[];
  }>> {
    try {
      const { facility_id, zone_id, start_date, end_date } = bookingData;
  
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('facility_id', facility_id)
        .eq('zone_id', zone_id)
        .lte('start_date', end_date)
        .gte('end_date', start_date);
  
      if (error) {
        return {
          data: {
            hasConflict: true,
            conflictingBookings: [],
            availableAlternatives: []
          },
          error: error.message
        };
      }
  
      const conflictingBookings = (data || []).map(record => this.mapFromDatabase(record as DatabaseBooking));
      const hasConflict = conflictingBookings.length > 0;
  
      return {
        data: {
          hasConflict,
          conflictingBookings,
          availableAlternatives: []
        },
        error: null
      };
    } catch (error: any) {
      return {
        data: {
          hasConflict: false,
          conflictingBookings: [],
          availableAlternatives: []
        },
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const bookingRepository = new BookingRepository();
