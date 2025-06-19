
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { isDateUnavailable } from '@/utils/holidaysAndAvailability';

export class AvailabilityStatusManager {
  constructor(private conflictManager: EnhancedZoneConflictManager) {}

  getAvailabilityStatus(zoneId: string, date: Date, timeSlot: string) {
    const unavailableCheck = isDateUnavailable(date);
    if (unavailableCheck.isUnavailable) {
      return { status: 'unavailable', conflict: null };
    }

    const conflict = this.conflictManager.checkZoneConflict(zoneId, date, timeSlot);
    if (conflict) {
      return { status: 'busy', conflict };
    }

    return { status: 'available', conflict: null };
  }
}
