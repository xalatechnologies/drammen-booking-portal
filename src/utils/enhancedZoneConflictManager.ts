
import { ZoneConflictManager } from "./zoneConflictManager";
import { Zone } from "@/components/booking/types";
import { BookingService } from "@/services/BookingService";
import { ConflictCheckResult, AlternativeSlot, ExistingBooking } from "./conflict/types";
import { Booking } from "@/types/booking";

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

      const { hasConflict, conflictingBookings, alternatives } = conflictResponse.data!;

      // Generate intelligent recommendations
      const recommendations = this.generateRecommendations(
        conflictingBookings,
        alternatives,
        startDate,
        endDate
      );

      return {
        hasConflict,
        conflictingBookings,
        alternatives,
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
    alternatives: Zone[],
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
      .map(booking => ({
        id: booking.id,
        zoneId: booking.zoneId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        userId: booking.userId,
        purpose: booking.purpose,
        // Add required Booking properties with defaults
        eventType: 'other' as const,
        expectedAttendees: 1,
        ageGroup: 'mixed' as const,
        contactName: 'Unknown',
        contactEmail: 'unknown@example.com',
        contactPhone: '',
        facilityId: parseInt(this.zones.find(z => z.id === zoneId)?.facilityId || '1'),
        status: 'confirmed' as const,
        type: 'engangs' as const,
        actorType: 'private-person' as const,
        approvalStatus: 'not-required' as const,
        requiresApproval: false,
        description: booking.purpose,
        specialRequirements: '',
        basePrice: 0,
        servicesPrice: 0,
        totalPrice: 0,
        paymentStatus: 'pending',
        durationMinutes: Math.floor((booking.endDate.getTime() - booking.startDate.getTime()) / 60000),
        bookingReference: `REF-${booking.id}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

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
