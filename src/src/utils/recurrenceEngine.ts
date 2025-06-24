import { addDays, addWeeks, addMonths, format, startOfWeek, isSameDay, getDay } from 'date-fns';

export interface RecurrencePattern {
  type: 'single' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  weekdays: number[]; // 0 = Sunday, 1 = Monday, etc.
  timeSlots: string[];
  interval: number; // for custom patterns
  startDate?: Date; // When the recurrence should start
  endDate?: Date; // When the recurrence should end
  monthlyPattern?: 'first' | 'second' | 'third' | 'fourth' | 'last';
  monthlyWeekday?: number;
}

export interface SelectedTimeSlot {
  zoneId: string;
  date: Date;
  timeSlot: string;
  duration: number; // in hours
}

export class RecurrenceEngine {
  generateOccurrences(
    pattern: RecurrencePattern,
    startDate: Date,
    zoneId: string,
    maxOccurrences: number = 52
  ): SelectedTimeSlot[] {
    const occurrences: SelectedTimeSlot[] = [];
    
    // Use pattern's start date if available, otherwise use provided startDate
    let currentDate = pattern.startDate || startDate;
    const endDate = pattern.endDate;
    let count = 0;

    while (count < maxOccurrences && (!endDate || currentDate <= endDate)) {
      // Check if current date matches pattern
      if (this.dateMatchesPattern(currentDate, pattern)) {
        // Add all time slots for this date
        pattern.timeSlots.forEach(timeSlot => {
          occurrences.push({
            zoneId,
            date: new Date(currentDate),
            timeSlot,
            duration: this.calculateDuration(timeSlot)
          });
        });
        count++;
      }

      // Move to next date based on pattern type
      currentDate = this.getNextDate(currentDate, pattern);
    }

    return occurrences;
  }

  private dateMatchesPattern(date: Date, pattern: RecurrencePattern): boolean {
    const dayOfWeek = getDay(date);

    switch (pattern.type) {
      case 'single':
        return true; // Single occurrence
      case 'weekly':
      case 'biweekly':
        return pattern.weekdays.includes(dayOfWeek);
      case 'monthly':
        return this.matchesMonthlyPattern(date, pattern);
      case 'custom':
        return pattern.weekdays.includes(dayOfWeek);
      default:
        return false;
    }
  }

  private matchesMonthlyPattern(date: Date, pattern: RecurrencePattern): boolean {
    if (!pattern.monthlyPattern || pattern.monthlyWeekday === undefined) return false;

    const dayOfWeek = getDay(date);
    if (dayOfWeek !== pattern.monthlyWeekday) return false;

    // Calculate which occurrence of this weekday in the month
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstOccurrence = addDays(firstOfMonth, (7 + pattern.monthlyWeekday - getDay(firstOfMonth)) % 7);
    
    const weekNumber = Math.floor((date.getDate() - firstOccurrence.getDate()) / 7) + 1;

    switch (pattern.monthlyPattern) {
      case 'first': return weekNumber === 1;
      case 'second': return weekNumber === 2;
      case 'third': return weekNumber === 3;
      case 'fourth': return weekNumber === 4;
      case 'last':
        // Check if this is the last occurrence of this weekday in the month
        const nextWeek = addDays(date, 7);
        return nextWeek.getMonth() !== date.getMonth();
      default: return false;
    }
  }

  private getNextDate(currentDate: Date, pattern: RecurrencePattern): Date {
    switch (pattern.type) {
      case 'single':
        return addDays(currentDate, 1);
      case 'weekly':
        return addDays(currentDate, 1);
      case 'biweekly':
        return addDays(currentDate, 1);
      case 'monthly':
        return addDays(currentDate, 1);
      case 'custom':
        return addDays(currentDate, pattern.interval || 1);
      default:
        return addDays(currentDate, 1);
    }
  }

  private calculateDuration(timeSlot: string): number {
    if (!timeSlot.includes('-')) return 2; // Default 2 hours
    
    const [start, end] = timeSlot.split('-').map(t => t.trim());
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    
    return endHour - startHour;
  }

  getPatternDescription(pattern: RecurrencePattern): string {
    const weekdayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const selectedDays = pattern.weekdays.map(day => weekdayNames[day]).join(', ');

    switch (pattern.type) {
      case 'single':
        return 'Enkelt booking';
      case 'weekly':
        return `Ukentlig på ${selectedDays}`;
      case 'biweekly':
        return `Annenhver uke på ${selectedDays}`;
      case 'monthly':
        const dayName = weekdayNames[pattern.monthlyWeekday || 0];
        return `${pattern.monthlyPattern} ${dayName} hver måned`;
      case 'custom':
        return `Egendefinert: hver ${pattern.interval}. dag på ${selectedDays}`;
      default:
        return 'Ukjent mønster';
    }
  }
}

export const recurrenceEngine = new RecurrenceEngine();
