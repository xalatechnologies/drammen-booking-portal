
import { BaseRepository } from './BaseRepository';
import { Booking, BookingFilters, BookingCreateRequest, BookingUpdateRequest, BookingStatus } from '@/types/booking';
import { Zone } from '@/types/zone';
import { mockBookings, getBookingsByFacilityId, getBookingsByZoneId, getBookingsByDateRange } from '@/data/mockBookings';
import { mockZones } from '@/data/mockZones';
import { addDays, isSameDay, parseISO } from 'date-fns';

interface BookingConflictResult {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  availableAlternatives: Zone[];
}

export class BookingRepository extends BaseRepository<Booking, BookingFilters, BookingCreateRequest, BookingUpdateRequest> {
  private zones: Zone[] = [];

  constructor() {
    super([...mockBookings]);
    this.zones = [...mockZones];
  }

  protected getId(booking: Booking): string {
    return booking.id;
  }

  protected applyFilters(bookings: Booking[], filters: BookingFilters): Booking[] {
    return bookings.filter(booking => {
      // Facility filter
      if (filters.facilityId && booking.facilityId !== filters.facilityId) {
        return false;
      }

      // Zone filter
      if (filters.zoneId && booking.zoneId !== filters.zoneId) {
        return false;
      }

      // User filter
      if (filters.userId && booking.userId !== filters.userId) {
        return false;
      }

      // Organization filter
      if (filters.organizationId && booking.organizationId !== filters.organizationId) {
        return false;
      }

      // Status filter
      if (filters.status && booking.status !== filters.status) {
        return false;
      }

      // Event type filter
      if (filters.eventType && booking.eventType !== filters.eventType) {
        return false;
      }

      // Date range filter
      if (filters.startDate && booking.startDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && booking.startDate > filters.endDate) {
        return false;
      }

      // Search term filter
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

      // Requires approval filter
      if (filters.requiresApproval !== undefined && booking.requiresApproval !== filters.requiresApproval) {
        return false;
      }

      // Approval status filter
      if (filters.approvalStatus && booking.approvalStatus !== filters.approvalStatus) {
        return false;
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
      userId: 'current-user', // Would come from auth context
      organizationId: request.organizationId,
      status: 'pending-approval',
      type: 'engangs',
      actorType: 'private-person', // Would be determined from user/organization
      
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
      
      additionalServices: [], // Fixed: Always use BookingService[] type
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
      // Handle additionalServices properly
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

  // Booking-specific methods

  async checkBookingConflicts(
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<{ success: boolean; data?: BookingConflictResult; error?: any }> {
    try {
      const zone = this.zones.find(z => z.id === zoneId);
      if (!zone) {
        return { success: false, error: { message: 'Zone not found' } };
      }

      // Get all bookings for this zone and date range
      const zoneBookings = this.data.filter(booking => 
        booking.zoneId === zoneId &&
        booking.id !== excludeBookingId &&
        booking.status !== 'cancelled' &&
        booking.status !== 'rejected' &&
        // Check for time overlap
        booking.startDate < endDate && booking.endDate > startDate
      );

      // Check for conflicts with main zone if booking a sub-zone
      let mainZoneConflicts: Booking[] = [];
      if (zone.parentZoneId) {
        mainZoneConflicts = this.data.filter(booking =>
          booking.zoneId === zone.parentZoneId &&
          booking.id !== excludeBookingId &&
          booking.status !== 'cancelled' &&
          booking.status !== 'rejected' &&
          booking.startDate < endDate && booking.endDate > startDate
        );
      }

      // Check for conflicts with sub-zones if booking main zone
      let subZoneConflicts: Booking[] = [];
      // Find sub-zones by checking if any zones have this zone as parent
      const subZones = this.zones.filter(z => z.parentZoneId === zoneId);
      if (zone.isMainZone && subZones.length > 0) {
        const subZoneIds = subZones.map(z => z.id);
        subZoneConflicts = this.data.filter(booking =>
          subZoneIds.includes(booking.zoneId) &&
          booking.id !== excludeBookingId &&
          booking.status !== 'cancelled' &&
          booking.status !== 'rejected' &&
          booking.startDate < endDate && booking.endDate > startDate
        );
      }

      const allConflicts = [...zoneBookings, ...mainZoneConflicts, ...subZoneConflicts];
      const hasConflict = allConflicts.length > 0;

      // Find alternative zones if there's a conflict
      const availableAlternatives: Zone[] = [];
      if (hasConflict) {
        for (const alternativeZone of this.zones) {
          if (alternativeZone.id === zoneId || !alternativeZone.isActive) continue;
          
          const alternativeConflicts = await this.checkBookingConflicts(
            alternativeZone.id,
            startDate,
            endDate,
            excludeBookingId
          );
          
          if (alternativeConflicts.success && !alternativeConflicts.data?.hasConflict) {
            availableAlternatives.push(alternativeZone);
          }
        }
      }

      return {
        success: true,
        data: {
          hasConflict,
          conflictingBookings: allConflicts,
          availableAlternatives
        }
      };
    } catch (error) {
      return { success: false, error: { message: 'Failed to check booking conflicts', details: error } };
    }
  }

  async getBookingsByFacility(facilityId: string) {
    try {
      const bookings = getBookingsByFacilityId(facilityId);
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch bookings by facility', details: error } };
    }
  }

  async getBookingsByZone(zoneId: string) {
    try {
      const bookings = getBookingsByZoneId(zoneId);
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch bookings by zone', details: error } };
    }
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date) {
    try {
      const bookings = getBookingsByDateRange(startDate, endDate);
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch bookings by date range', details: error } };
    }
  }

  async getBookingAvailability(
    zoneId: string,
    date: Date,
    timeSlots: string[]
  ): Promise<{ success: boolean; data?: Record<string, boolean>; error?: any }> {
    try {
      const availability: Record<string, boolean> = {};
      
      for (const timeSlot of timeSlots) {
        const [startTime, endTime] = timeSlot.split('-');
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startDate = new Date(date);
        startDate.setHours(startHour, startMin, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(endHour, endMin, 0, 0);
        
        const conflictCheck = await this.checkBookingConflicts(zoneId, startDate, endDate);
        availability[timeSlot] = conflictCheck.success && !conflictCheck.data?.hasConflict;
      }
      
      return { success: true, data: availability };
    } catch (error) {
      return { success: false, error: { message: 'Failed to check availability', details: error } };
    }
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus, notes?: string) {
    try {
      const booking = await this.findById(bookingId);
      if (!booking.success || !booking.data) {
        return { success: false, error: { message: 'Booking not found' } };
      }

      const updatedBooking = await this.update(bookingId, { status });
      
      if (notes && updatedBooking.success && updatedBooking.data) {
        const newNote = {
          id: `note-${Date.now()}`,
          userId: 'current-user',
          userRole: 'system',
          content: notes,
          isInternal: true,
          createdAt: new Date()
        };
        
        updatedBooking.data.notes.push(newNote);
      }
      
      return updatedBooking;
    } catch (error) {
      return { success: false, error: { message: 'Failed to update booking status', details: error } };
    }
  }

  async generateRecurringBookings(
    baseBooking: Booking,
    pattern: Booking['recurrencePattern']
  ): Promise<{ success: boolean; data?: Booking[]; error?: any }> {
    try {
      if (!pattern || !pattern.endDate) {
        return { success: false, error: { message: 'Invalid recurrence pattern' } };
      }

      const generatedBookings: Booking[] = [];
      let currentDate = new Date(baseBooking.startDate);
      const endDate = pattern.endDate;
      
      while (currentDate <= endDate) {
        // Skip exceptions
        if (pattern.exceptions.some(exception => isSameDay(exception, currentDate))) {
          currentDate = this.incrementDate(currentDate, pattern);
          continue;
        }

        // Check day of week for weekly patterns
        if (pattern.type === 'weekly' && pattern.daysOfWeek) {
          if (!pattern.daysOfWeek.includes(currentDate.getDay())) {
            currentDate = addDays(currentDate, 1);
            continue;
          }
        }

        // Create booking for this date
        const bookingStart = new Date(currentDate);
        bookingStart.setHours(baseBooking.startDate.getHours(), baseBooking.startDate.getMinutes());
        
        const bookingEnd = new Date(currentDate);
        bookingEnd.setHours(baseBooking.endDate.getHours(), baseBooking.endDate.getMinutes());

        // Check for conflicts
        const conflictCheck = await this.checkBookingConflicts(
          baseBooking.zoneId,
          bookingStart,
          bookingEnd
        );

        if (conflictCheck.success && !conflictCheck.data?.hasConflict) {
          const newBooking: Booking = {
            ...baseBooking,
            id: `${baseBooking.id}-recur-${currentDate.getTime()}`,
            startDate: bookingStart,
            endDate: bookingEnd,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          generatedBookings.push(newBooking);
        }

        currentDate = this.incrementDate(currentDate, pattern);
      }

      return { success: true, data: generatedBookings };
    } catch (error) {
      return { success: false, error: { message: 'Failed to generate recurring bookings', details: error } };
    }
  }

  private incrementDate(date: Date, pattern: Booking['recurrencePattern']): Date {
    if (!pattern) return date;
    
    const newDate = new Date(date);
    
    switch (pattern.type) {
      case 'daily':
        return addDays(newDate, pattern.interval);
      case 'weekly':
        return addDays(newDate, pattern.interval * 7);
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + pattern.interval);
        return newDate;
      default:
        return addDays(newDate, 1);
    }
  }
}

// Export singleton instance
export const bookingRepository = new BookingRepository();
