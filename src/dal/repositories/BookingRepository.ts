
import { BaseRepository } from '../BaseRepository';
import { Booking, BookingFilters, BookingCreateRequest, BookingUpdateRequest } from '@/types/booking';
import { Zone } from '@/types/zone';
import { mockBookings } from '@/data/bookings';
import { mockZones } from '@/data/mockZones';
import { BookingConflictRepository } from './BookingConflictRepository';
import { BookingValidationRepository } from './BookingValidationRepository';
import { RecurringBookingRepository } from './RecurringBookingRepository';

export class BookingRepository extends BaseRepository<Booking, BookingFilters, BookingCreateRequest, BookingUpdateRequest> {
  private zones: Zone[] = [];
  private conflictRepo: BookingConflictRepository;
  private validationRepo: BookingValidationRepository;
  private recurringRepo: RecurringBookingRepository;

  constructor() {
    super([...mockBookings]);
    this.zones = [...mockZones];
    this.conflictRepo = new BookingConflictRepository(this.zones, this.data);
    this.validationRepo = new BookingValidationRepository();
    this.recurringRepo = new RecurringBookingRepository(this.data);
  }

  protected getId(booking: Booking): string {
    return booking.id;
  }

  protected applyFilters(bookings: Booking[], filters: BookingFilters): Booking[] {
    return bookings.filter(booking => {
      if (filters.facilityId && booking.facilityId !== filters.facilityId) return false;
      if (filters.zoneId && booking.zoneId !== filters.zoneId) return false;
      if (filters.userId && booking.userId !== filters.userId) return false;
      if (filters.organizationId && booking.organizationId !== filters.organizationId) return false;
      if (filters.status && booking.status !== filters.status) return false;
      if (filters.eventType && booking.eventType !== filters.eventType) return false;
      if (filters.startDate && booking.startDate < filters.startDate) return false;
      if (filters.endDate && booking.startDate > filters.endDate) return false;
      if (filters.requiresApproval !== undefined && booking.requiresApproval !== filters.requiresApproval) return false;
      if (filters.approvalStatus && booking.approvalStatus !== filters.approvalStatus) return false;

      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          booking.facilityName.toLowerCase().includes(searchLower) ||
          booking.zoneName.toLowerCase().includes(searchLower) ||
          booking.purpose.toLowerCase().includes(searchLower) ||
          booking.contactName.toLowerCase().includes(searchLower) ||
          booking.eventType.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }

  protected createEntity(request: BookingCreateRequest): Booking {
    const newId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const zone = this.zones.find(z => z.id === request.zoneId);
    const facility = zone ? `Facility ${request.facilityId}` : 'Unknown Facility';
    
    return {
      id: newId,
      facilityId: request.facilityId,
      facilityName: facility,
      zoneId: request.zoneId,
      zoneName: zone?.name || 'Unknown Zone',
      userId: 'current-user',
      organizationId: request.organizationId,
      status: 'pending-approval',
      type: 'engangs',
      actorType: 'private-person',
      
      startDate: request.startDate,
      endDate: request.endDate,
      duration: Math.round((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60)),
      timeSlot: `${request.startDate.getHours()}:${request.startDate.getMinutes().toString().padStart(2, '0')}-${request.endDate.getHours()}:${request.endDate.getMinutes().toString().padStart(2, '0')}`,
      isRecurring: false,
      
      purpose: request.purpose,
      eventType: request.eventType,
      expectedAttendees: request.expectedAttendees,
      ageGroup: request.ageGroup,
      description: request.specialRequirements,
      
      contactName: request.contactName,
      contactEmail: request.contactEmail,
      contactPhone: request.contactPhone,
      
      additionalServices: [],
      pricing: {
        basePrice: 0,
        servicesCost: 0,
        discounts: [],
        surcharges: [],
        taxes: [],
        totalPrice: 0,
        currency: 'NOK',
        calculatedAt: new Date(),
        breakdown: []
      },
      
      requiresApproval: true,
      approvalStatus: 'pending',
      
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: [],
      attachments: []
    };
  }

  protected updateEntity(existing: Booking, request: BookingUpdateRequest): Booking {
    return {
      ...existing,
      ...request,
      additionalServices: request.additionalServices 
        ? request.additionalServices.map(serviceId => ({
            serviceId,
            serviceName: `Service ${serviceId}`,
            quantity: 1,
            unitPrice: 0,
            totalPrice: 0
          }))
        : existing.additionalServices,
      updatedAt: new Date()
    };
  }

  // Delegate to specialized repositories
  async checkBookingConflicts(zoneId: string, startDate: Date, endDate: Date, excludeBookingId?: string) {
    return this.conflictRepo.checkBookingConflicts(zoneId, startDate, endDate, excludeBookingId);
  }

  async getBookingAvailability(zoneId: string, date: Date, timeSlots: string[]) {
    return this.conflictRepo.getBookingAvailability(zoneId, date, timeSlots);
  }

  async generateRecurringBookings(baseBooking: Booking, pattern: Booking['recurrencePattern']) {
    return this.recurringRepo.generateRecurringBookings(baseBooking, pattern);
  }

  async updateBookingStatus(bookingId: string, status: any, notes?: string) {
    return this.validationRepo.updateBookingStatus(this, bookingId, status, notes);
  }

  // Simplified query methods
  async getBookingsByFacility(facilityId: string) {
    try {
      const bookings = this.data.filter(booking => booking.facilityId === facilityId);
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch bookings by facility', details: error } };
    }
  }

  async getBookingsByZone(zoneId: string) {
    try {
      const bookings = this.data.filter(booking => booking.zoneId === zoneId);
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch bookings by zone', details: error } };
    }
  }
}
