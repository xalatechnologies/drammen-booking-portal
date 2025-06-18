
import { Zone, BookingConflict } from "@/components/booking/types";
import { ZoneConflictManager, ExistingBooking } from "./zoneConflictManager";

export interface AlternativeZoneSuggestion {
  zone: Zone;
  reason: string;
  score: number;
  availableSlots: string[];
}

export interface ConflictResolutionOptions {
  skipConflictedDates: boolean;
  suggestAlternativeTimes: boolean;
  suggestAlternativeZones: boolean;
  allowPartialBooking: boolean;
}

export class EnhancedZoneConflictManager extends ZoneConflictManager {
  
  /**
   * Get smart alternative zone suggestions when preferred zone is unavailable
   */
  getSmartAlternatives(
    preferredZoneId: string,
    date: Date,
    timeSlot: string,
    requiredCapacity: number,
    preferredEquipment: string[] = []
  ): AlternativeZoneSuggestion[] {
    const availableZones = this.getAlternativeZones(preferredZoneId, date, timeSlot, requiredCapacity);
    
    return availableZones.map(zone => {
      let score = 0;
      let reason = '';
      
      // Score based on capacity efficiency (closer to required = better)
      const capacityEfficiency = 1 - Math.abs(zone.capacity - requiredCapacity) / zone.capacity;
      score += capacityEfficiency * 40;
      
      // Score based on equipment match
      const equipmentMatches = preferredEquipment.filter(eq => zone.equipment.includes(eq)).length;
      const equipmentScore = preferredEquipment.length > 0 ? (equipmentMatches / preferredEquipment.length) * 30 : 0;
      score += equipmentScore;
      
      // Score based on price (lower is better)
      const priceScore = Math.max(0, (1000 - zone.pricePerHour) / 1000) * 20;
      score += priceScore;
      
      // Score based on zone type
      if (zone.isMainZone) {
        score += 10;
        reason = 'Hele lokalet med full tilgang';
      } else if (equipmentMatches > 0) {
        reason = `Har ${equipmentMatches} av ${preferredEquipment.length} ønsket utstyr`;
      } else if (zone.capacity >= requiredCapacity) {
        reason = `Passer for ${requiredCapacity} personer`;
      } else {
        reason = 'Alternativ tilgjengelig';
      }
      
      return {
        zone,
        reason,
        score: Math.round(score),
        availableSlots: this.getAvailableTimeSlots(zone.id, date)
      };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Get available time slots for a zone on a specific date
   */
  private getAvailableTimeSlots(zoneId: string, date: Date): string[] {
    const allTimeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"];
    
    return allTimeSlots.filter(slot => {
      const conflict = this.checkZoneConflict(zoneId, date, slot);
      return !conflict;
    });
  }

  /**
   * Resolve conflicts in recurring booking patterns
   */
  resolveRecurringConflicts(
    zoneId: string,
    dates: Date[],
    timeSlot: string,
    options: ConflictResolutionOptions
  ): {
    availableDates: Date[];
    conflictedDates: Date[];
    alternativeTimeSlots: { date: Date; slots: string[] }[];
    suggestedZones: AlternativeZoneSuggestion[];
  } {
    const availableDates: Date[] = [];
    const conflictedDates: Date[] = [];
    const alternativeTimeSlots: { date: Date; slots: string[] }[] = [];
    
    // Check each date for conflicts
    dates.forEach(date => {
      const conflict = this.checkZoneConflict(zoneId, date, timeSlot);
      
      if (conflict) {
        conflictedDates.push(date);
        
        if (options.suggestAlternativeTimes) {
          const availableSlots = this.getAvailableTimeSlots(zoneId, date);
          if (availableSlots.length > 0) {
            alternativeTimeSlots.push({ date, slots: availableSlots });
          }
        }
      } else {
        availableDates.push(date);
      }
    });

    // Get alternative zones for conflicted dates
    let suggestedZones: AlternativeZoneSuggestion[] = [];
    if (options.suggestAlternativeZones && conflictedDates.length > 0) {
      // Use the first conflicted date to find alternatives
      const zone = this.zones.find(z => z.id === zoneId);
      if (zone) {
        suggestedZones = this.getSmartAlternatives(
          zoneId, 
          conflictedDates[0], 
          timeSlot, 
          zone.capacity,
          zone.equipment
        );
      }
    }

    return {
      availableDates,
      conflictedDates,
      alternativeTimeSlots,
      suggestedZones
    };
  }

  /**
   * Get conflict severity for visual indication
   */
  getConflictSeverity(conflict: BookingConflict): 'high' | 'medium' | 'low' {
    switch (conflict.conflictType) {
      case 'whole-facility-conflict':
        return 'high';
      case 'sub-zone-conflict':
        return 'medium';
      default:
        return 'low';
    }
  }
}
