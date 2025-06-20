
import { RecurrencePattern, SelectedTimeSlot, recurrenceEngine } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { Zone } from '@/components/booking/types';
import { addWeeks, startOfWeek } from 'date-fns';

interface PatternHandlerProps {
  pattern: RecurrencePattern;
  zones: Zone[];
  currentWeekStart: Date;
  conflictManager: EnhancedZoneConflictManager;
  onConflictDetected: (data: any) => void;
  onPatternApplied: (slots: SelectedTimeSlot[]) => void;
}

export function usePatternHandler({
  pattern,
  zones,
  currentWeekStart,
  conflictManager,
  onConflictDetected,
  onPatternApplied,
}: PatternHandlerProps) {
  const handlePatternApply = (appliedPattern: RecurrencePattern) => {
    console.log('PatternHandler: handlePatternApply called with pattern:', appliedPattern);
    
    if (!appliedPattern.timeSlots || appliedPattern.timeSlots.length === 0) {
      console.log('PatternHandler: No time slots in pattern');
      return;
    }
    
    if (!appliedPattern.weekdays || appliedPattern.weekdays.length === 0) {
      console.log('PatternHandler: No weekdays in pattern');
      return;
    }

    const zoneId = zones[0]?.id || 'whole-facility';
    console.log('PatternHandler: Using zone ID:', zoneId);
    
    // Start from the beginning of the current week
    const startDate = startOfWeek(currentWeekStart, { weekStartsOn: 1 }); // Monday
    console.log('PatternHandler: Start date:', startDate);
    
    // Generate occurrences for the next 12 weeks
    const occurrences = recurrenceEngine.generateOccurrences(
      appliedPattern,
      startDate,
      zoneId,
      52 // Generate more occurrences for better coverage
    );

    console.log('PatternHandler: Generated occurrences:', occurrences);

    if (occurrences.length === 0) {
      console.log('PatternHandler: No occurrences generated');
      return;
    }

    // Check for conflicts (simplified for now)
    const availableOccurrences: SelectedTimeSlot[] = [];
    const conflictedDates: Date[] = [];
    
    occurrences.forEach(occurrence => {
      // For now, assume all slots are available
      // In a real implementation, you would check against existing bookings
      const hasConflict = false; // conflictManager.checkZoneConflict(occurrence.zoneId, occurrence.date, occurrence.timeSlot);
      
      if (!hasConflict) {
        availableOccurrences.push(occurrence);
      } else {
        conflictedDates.push(occurrence.date);
      }
    });

    console.log('PatternHandler: Available occurrences:', availableOccurrences);
    console.log('PatternHandler: Conflicted dates:', conflictedDates);

    if (conflictedDates.length > 0) {
      // Show conflict resolution
      onConflictDetected({
        conflictedDates,
        availableDates: availableOccurrences.map(o => o.date),
        alternativeTimeSlots: [],
        suggestedZones: [],
        originalZone: zones[0],
        originalTimeSlot: appliedPattern.timeSlots[0],
        occurrences: availableOccurrences
      });
    } else {
      // No conflicts, add all occurrences
      console.log('PatternHandler: Applying all occurrences to pattern');
      onPatternApplied(availableOccurrences);
    }
  };

  return { handlePatternApply };
}
