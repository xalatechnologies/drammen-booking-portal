
import { ZoneConflictManager } from "./zoneConflictManager";
import { Zone } from "@/components/booking/types";
import { BookingService } from "@/services/BookingService";
import { Booking } from "@/types/booking";

// Add missing types
export interface ConflictCheckResult {
  hasConflicts: boolean;
  conflictingBookings: Booking[];
  availableAlternatives: AlternativeSlot[];
}

export interface AlternativeSlot {
  zoneId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface ExistingBooking {
  id: string;
  zoneId: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  purpose: string;
}

export interface AlternativeZoneSuggestion {
  zone: Zone;
  reason: string;
  score: number;
}

export class EnhancedZoneConflictManager extends ZoneConflictManager {
  constructor(zones: Zone[], existingBookings: ExistingBooking[] = []) {
    super(zones, existingBookings);
  }

  /**
   * Enhanced conflict checking with real booking data
   */
  async checkRealTimeConflicts(
    zoneId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    hasConflict: boolean;
    conflictingBookings: any[];
    alternatives: Zone[];
    recommendations: string[];
  }> {
    try {
      // Use the booking service to check real conflicts
      const conflictResponse = await BookingService.getConflictingBookings(
        zoneId,
        startDate,
        endDate
      );

      if (!conflictResponse.success) {
        throw new Error(conflictResponse.error?.message || 'Failed to check conflicts');
      }

      const { hasConflict, conflictingBookings, availableAlternatives = [] } = conflictResponse.data!;

      // Generate intelligent recommendations
      const recommendations = this.generateRecommendations(
        conflictingBookings,
        availableAlternatives,
        startDate,
        endDate
      );

      return {
        hasConflict,
        conflictingBookings,
        alternatives: availableAlternatives,
        recommendations
      };
    } catch (error) {
      console.error('Enhanced conflict check failed:', error);
      
      // Fallback to basic conflict checking
      return {
        hasConflict: false,
        conflictingBookings: [],
        alternatives: [],
        recommendations: ['Unable to check real-time conflicts. Please try again.']
      };
    }
  }

  /**
   * Generate intelligent booking recommendations
   */
  private generateRecommendations(
    conflicts: any[],
    alternatives: any[],
    startDate: Date,
    endDate: Date
  ): string[] {
    const recommendations: string[] = [];

    if (conflicts.length > 0) {
      recommendations.push(
        `Det er ${conflicts.length} konfliktende booking(er) i denne tidsperioden.`
      );

      // Suggest alternative times
      const duration = endDate.getTime() - startDate.getTime();
      const earlierTime = new Date(startDate.getTime() - duration);
      const laterTime = new Date(endDate.getTime() + duration);

      recommendations.push(
        `Prøv en time tidligere (${earlierTime.toLocaleTimeString('no-NO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}) eller senere (${laterTime.toLocaleTimeString('no-NO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}).`
      );
    }

    if (alternatives.length > 0) {
      const altNames = alternatives.slice(0, 3).map(alt => alt.name).join(', ');
      recommendations.push(
        `Alternative lokaler: ${altNames}${alternatives.length > 3 ? ` og ${alternatives.length - 3} andre` : ''}.`
      );
    }

    // Day-specific recommendations
    const dayOfWeek = startDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      recommendations.push(
        'Vurdér ukedager for bedre tilgjengelighet og lavere priser.'
      );
    }

    // Time-specific recommendations
    const hour = startDate.getHours();
    if (hour >= 17 && hour <= 22) { // Evening
      recommendations.push(
        'Kveldstid har høy etterspørsel. Vurdér dagtid for bedre tilgjengelighet.'
      );
    }

    return recommendations;
  }

  /**
   * Get availability heatmap for a zone over a date range
   */
  async getAvailabilityHeatmap(
    zoneId: string,
    startDate: Date,
    endDate: Date,
    timeSlots: string[]
  ): Promise<Record<string, Record<string, boolean>>> {
    const heatmap: Record<string, Record<string, boolean>> = {};

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      
      try {
        const availabilityResponse = await BookingService.checkAvailability(
          zoneId,
          currentDate,
          timeSlots
        );

        if (availabilityResponse.success && availabilityResponse.data) {
          heatmap[dateKey] = availabilityResponse.data;
        } else {
          // Default to unavailable if check fails
          heatmap[dateKey] = timeSlots.reduce((acc, slot) => {
            acc[slot] = false;
            return acc;
          }, {} as Record<string, boolean>);
        }
      } catch (error) {
        console.error(`Failed to check availability for ${dateKey}:`, error);
        heatmap[dateKey] = timeSlots.reduce((acc, slot) => {
          acc[slot] = false;
          return acc;
        }, {} as Record<string, boolean>);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return heatmap;
  }

  getDetailedConflictInfo(
    zoneId: string,
    startDate: Date,
    endDate: Date
  ): ConflictCheckResult {
    // Get existing bookings for this zone and time range
    const conflictingBookings = this.existingBookings
      .filter(booking => 
        booking.zoneId === zoneId &&
        booking.startDate <= endDate &&
        booking.endDate >= startDate
      )
      .map(booking => {
        const zone = this.zones.find(z => z.id === zoneId);
        const facility = zone ? { id: zone.facilityId, name: 'Facility Name' } : { id: '1', name: 'Unknown Facility' };
        
        return {
          // Core booking properties with correct camelCase naming
          id: booking.id,
          userId: booking.userId,
          facilityId: facility.id,
          facilityName: facility.name,
          zoneId: booking.zoneId,
          zoneName: zone?.name || 'Unknown Zone',
          startDate: booking.startDate,
          endDate: booking.endDate,
          durationMinutes: Math.floor((booking.endDate.getTime() - booking.startDate.getTime()) / 60000),
          
          // Missing required properties from Booking interface
          duration: Math.floor((booking.endDate.getTime() - booking.startDate.getTime()) / 60000),
          timeSlot: `${booking.startDate.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}-${booking.endDate.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}`,
          isRecurring: false,
          
          // Database field mappings
          user_id: booking.userId,
          facility_id: parseInt(facility.id),
          zone_id: booking.zoneId,
          start_date: booking.startDate,
          end_date: booking.endDate,
          duration_minutes: Math.floor((booking.endDate.getTime() - booking.startDate.getTime()) / 60000),
          
          // Required Booking properties with defaults
          type: 'engangs' as const,
          status: 'confirmed' as const,
          approval_status: 'not-required' as const,
          event_type: 'other' as const,
          expected_attendees: 1,
          age_group: 'mixed' as const,
          actor_type: 'private-person' as const,
          actorType: 'private-person' as const,
          contact_name: 'Unknown',
          contact_email: 'unknown@example.com',
          contact_phone: '',
          purpose: booking.purpose,
          description: booking.purpose,
          special_requirements: '',
          requires_approval: false,
          base_price: 0,
          services_price: 0,
          total_price: 0,
          payment_status: 'pending',
          booking_reference: `REF-${booking.id}`,
          created_at: new Date(),
          updated_at: new Date(),
          
          // Additional Booking interface properties
          eventType: 'other' as const,
          expectedAttendees: 1,
          ageGroup: 'mixed' as const,
          contactName: 'Unknown',
          contactEmail: 'unknown@example.com',
          contactPhone: '',
          additionalServices: [],
          pricing: {
            basePrice: 0,
            servicesPrice: 0,
            totalPrice: 0,
            currency: 'NOK'
          },
          requiresApproval: false,
          approvalStatus: 'not-required' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: [],
          attachments: [],
          conflicts: [],
          recurrence: null,
          cancellation: null
        } as Booking;
      });

    const hasConflicts = conflictingBookings.length > 0;

    const availableAlternatives: AlternativeSlot[] = [];
    // Could implement alternative finding logic here

    return {
      hasConflicts,
      conflictingBookings,
      availableAlternatives
    };
  }
}
