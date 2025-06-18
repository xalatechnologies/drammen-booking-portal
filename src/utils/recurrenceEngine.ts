
import { addDays, addWeeks, addMonths, format, startOfWeek, isSameDay, getDay } from 'date-fns';

export interface RecurrencePattern {
  type: 'single' | 'weekly' | 'biweekly' | 'monthly' | 'custom' | 'daily';
  weekdays: number[]; // 0 = Sunday, 1 = Monday, etc.
  timeSlots: string[];
  interval: number; // for custom patterns
  endDate?: Date;
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
    let currentDate = startDate;
    let count = 0;

    while (count < maxOccurrences && (!pattern.endDate || currentDate <= pattern.endDate)) {
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
    const timeSlotsText = pattern.timeSlots.length > 0 
      ? `kl. ${pattern.timeSlots.join(', ')}` 
      : '';

    switch (pattern.type) {
      case 'single':
        return 'Enkelt booking';
      case 'weekly':
        return `Ukentlig på ${selectedDays} ${timeSlotsText}`;
      case 'biweekly':
        return `Annenhver uke på ${selectedDays} ${timeSlotsText}`;
      case 'monthly':
        const dayName = weekdayNames[pattern.monthlyWeekday || 0];
        if (pattern.monthlyPattern && pattern.monthlyWeekday !== undefined) {
          return `${pattern.monthlyPattern} ${dayName} hver måned ${timeSlotsText}`;
        }
        return `Månedlig på ${selectedDays} ${timeSlotsText}`;
      case 'daily':
        return `Daglig ${timeSlotsText}`;
      case 'custom':
        return `Egendefinert: hver ${pattern.interval}. dag på ${selectedDays} ${timeSlotsText}`;
      default:
        return 'Ukjent mønster';
    }
  }

  /**
   * Convert a recurrence pattern to an iCal RRULE string
   */
  patternToRRule(pattern: RecurrencePattern): string {
    let freq = '';
    let interval = pattern.interval || 1;
    
    switch (pattern.type) {
      case 'daily':
        freq = 'DAILY';
        break;
      case 'weekly':
        freq = 'WEEKLY';
        break;
      case 'biweekly':
        freq = 'WEEKLY';
        interval = 2;
        break;
      case 'monthly':
        freq = 'MONTHLY';
        break;
      default:
        freq = 'WEEKLY'; // Default to weekly
    }
    
    let rule = `FREQ=${freq};INTERVAL=${interval}`;
    
    // Add BYDAY for weekly/biweekly patterns
    if ((pattern.type === 'weekly' || pattern.type === 'biweekly') && pattern.weekdays.length > 0) {
      const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      const byDay = pattern.weekdays.map(day => dayMap[day]).join(',');
      rule += `;BYDAY=${byDay}`;
    }
    
    // Add UNTIL if there's an end date
    if (pattern.endDate) {
      const untilStr = pattern.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      rule += `;UNTIL=${untilStr}`;
    }
    
    return rule;
  }

  /**
   * Parse an iCal RRULE string to a RecurrencePattern
   */
  rRuleToPattern(rrule: string): Partial<RecurrencePattern> {
    const parts = rrule.split(';');
    const pattern: Partial<RecurrencePattern> = {
      weekdays: [],
      timeSlots: [],
      interval: 1
    };
    
    parts.forEach(part => {
      const [key, value] = part.split('=');
      
      switch (key) {
        case 'FREQ':
          switch (value) {
            case 'DAILY':
              pattern.type = 'daily';
              break;
            case 'WEEKLY':
              pattern.type = 'weekly';
              break;
            case 'MONTHLY':
              pattern.type = 'monthly';
              break;
            default:
              pattern.type = 'custom';
          }
          break;
          
        case 'INTERVAL':
          pattern.interval = parseInt(value);
          // If it's weekly with interval 2, it's biweekly
          if (pattern.type === 'weekly' && pattern.interval === 2) {
            pattern.type = 'biweekly';
            pattern.interval = 1;
          }
          break;
          
        case 'BYDAY':
          const dayMap = { 'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6 };
          pattern.weekdays = value.split(',').map(day => dayMap[day as keyof typeof dayMap]);
          break;
          
        case 'UNTIL':
          // Parse the UNTIL date (format: 20231231T000000Z)
          const year = parseInt(value.substring(0, 4));
          const month = parseInt(value.substring(4, 6)) - 1;
          const day = parseInt(value.substring(6, 8));
          pattern.endDate = new Date(year, month, day);
          break;
      }
    });
    
    return pattern;
  }
}

export const recurrenceEngine = new RecurrenceEngine();
