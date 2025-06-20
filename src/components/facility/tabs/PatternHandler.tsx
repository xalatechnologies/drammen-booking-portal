
import { RecurrencePattern, SelectedTimeSlot, recurrenceEngine } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { Zone } from '@/components/booking/types';

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
    if (appliedPattern.timeSlots.length === 0 || appliedPattern.weekdays.length === 0) return;

    const zoneId = zones[0]?.id;
    if (!zoneId) return;
    
    const occurrences = recurrenceEngine.generateOccurrences(
      appliedPattern,
      currentWeekStart,
      zoneId,
      12
    );

    // Check for conflicts
    const conflictedDates: Date[] = [];
    const availableOccurrences: SelectedTimeSlot[] = [];
    
    occurrences.forEach(occurrence => {
      const { status } = conflictManager.checkZoneConflict(occurrence.zoneId, occurrence.date, occurrence.timeSlot) 
        ? { status: 'busy' } : { status: 'available' };
      
      if (status === 'available') {
        availableOccurrences.push(occurrence);
      } else {
        conflictedDates.push(occurrence.date);
      }
    });

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
      onPatternApplied(availableOccurrences);
    }
  };

  return { handlePatternApply };
}
