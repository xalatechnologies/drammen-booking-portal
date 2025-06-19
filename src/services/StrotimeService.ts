
import { StrøtimeSlot, StrøtimeBooking, StrøtimeFilters } from '@/types/booking/strøtimer';
import { ApiResponse } from '@/types/api';

// Mock data for demo
const mockStrøtimeSlots: StrøtimeSlot[] = [
  {
    id: 'stro-1',
    facilityId: '2',
    facilityName: 'Gymsal 2 - Brandengen skole',
    zoneId: 'zone-1',
    zoneName: 'Sone A (Nord)',
    date: new Date(2025, 5, 19),
    startTime: '15:00',
    endTime: '16:00',
    duration: 60,
    isAvailable: true,
    publishedAt: new Date(),
    publishedBy: 'admin',
    pricePerSlot: 150
  },
  {
    id: 'stro-2',
    facilityId: '2',
    facilityName: 'Gymsal 2 - Brandengen skole',
    zoneId: 'zone-1',
    zoneName: 'Sone A (Nord)',
    date: new Date(2025, 5, 19),
    startTime: '16:30',
    endTime: '17:00',
    duration: 30,
    isAvailable: true,
    publishedAt: new Date(),
    publishedBy: 'admin',
    pricePerSlot: 80
  },
  {
    id: 'stro-3',
    facilityId: '2',
    facilityName: 'Gymsal 2 - Brandengen skole',
    zoneId: 'zone-2',
    zoneName: 'Sone B (Sør)',
    date: new Date(2025, 5, 20),
    startTime: '12:00',
    endTime: '12:30',
    duration: 30,
    isAvailable: false,
    publishedAt: new Date(),
    publishedBy: 'admin',
    bookedBy: 'john.doe@example.com',
    bookedAt: new Date(),
    pricePerSlot: 80
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class StrotimeService {
  static async getAvailableStrøtimer(filters?: StrøtimeFilters): Promise<ApiResponse<StrøtimeSlot[]>> {
    try {
      await delay(200);
      
      let filteredSlots = mockStrøtimeSlots.filter(slot => slot.isAvailable);
      
      if (filters) {
        if (filters.facilityId) {
          filteredSlots = filteredSlots.filter(slot => slot.facilityId === filters.facilityId);
        }
        if (filters.zoneId) {
          filteredSlots = filteredSlots.filter(slot => slot.zoneId === filters.zoneId);
        }
        if (filters.date) {
          filteredSlots = filteredSlots.filter(slot => 
            slot.date.toDateString() === filters.date!.toDateString()
          );
        }
        if (filters.duration) {
          filteredSlots = filteredSlots.filter(slot => slot.duration === filters.duration);
        }
      }
      
      return {
        success: true,
        data: filteredSlots
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to fetch strøtimer', details: error }
      };
    }
  }

  static async bookStrøtime(
    slotId: string,
    contactInfo: { name: string; email: string; phone: string }
  ): Promise<ApiResponse<StrøtimeBooking>> {
    try {
      await delay(300);
      
      const slot = mockStrøtimeSlots.find(s => s.id === slotId);
      if (!slot) {
        return {
          success: false,
          error: { message: 'Strøtime slot not found' }
        };
      }
      
      if (!slot.isAvailable) {
        return {
          success: false,
          error: { message: 'Strøtime slot is no longer available' }
        };
      }
      
      // Mark slot as booked
      slot.isAvailable = false;
      slot.bookedBy = contactInfo.email;
      slot.bookedAt = new Date();
      
      const booking: StrøtimeBooking = {
        id: `stro-booking-${Date.now()}`,
        strøtimeSlotId: slotId,
        contactName: contactInfo.name,
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
        bookedAt: new Date(),
        status: 'confirmed'
      };
      
      return {
        success: true,
        data: booking
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to book strøtime', details: error }
      };
    }
  }

  static async cancelStrøtime(bookingId: string, reason?: string): Promise<ApiResponse<StrøtimeBooking>> {
    try {
      await delay(200);
      
      // Find the booking and mark the slot as available again
      const slot = mockStrøtimeSlots.find(s => s.bookedBy);
      if (slot) {
        slot.isAvailable = true;
        slot.bookedBy = undefined;
        slot.bookedAt = undefined;
      }
      
      const cancelledBooking: StrøtimeBooking = {
        id: bookingId,
        strøtimeSlotId: slot?.id || '',
        contactName: 'User',
        contactEmail: 'user@example.com',
        contactPhone: '12345678',
        bookedAt: new Date(),
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason
      };
      
      return {
        success: true,
        data: cancelledBooking
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to cancel strøtime', details: error }
      };
    }
  }
}
