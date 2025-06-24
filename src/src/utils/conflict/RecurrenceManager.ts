
import { RRule } from 'rrule';
import { addMinutes } from 'date-fns';
import { TimeSlotManager } from './TimeSlotManager';

interface TimeSlot {
  start: Date;
  end: Date;
}

export class RecurrenceManager {
  private timeSlotManager: TimeSlotManager;

  constructor() {
    this.timeSlotManager = new TimeSlotManager();
  }

  generateOccurrences(
    startDate: Date, 
    timeSlot: string, 
    recurrenceRule: string, 
    until: Date
  ): TimeSlot[] {
    const slot = this.timeSlotManager.parseTimeSlot(startDate, timeSlot);
    if (!slot) return [];
    
    const durationMinutes = this.timeSlotManager.getDurationMinutes(slot);
    
    let ruleOptions = RRule.parseString(recurrenceRule);
    ruleOptions = {
      ...ruleOptions,
      dtstart: startDate,
      until: until
    };
    
    const rule = new RRule(ruleOptions);
    const occurrenceDates = rule.all();
    
    return occurrenceDates.map(date => ({
      start: date,
      end: addMinutes(date, durationMinutes)
    }));
  }

  generateRecurrenceRule(
    frequency: 'daily' | 'weekly' | 'monthly',
    interval: number = 1,
    count?: number,
    until?: Date
  ): string {
    let rule = `FREQ=${frequency.toUpperCase()};INTERVAL=${interval}`;
    
    if (count) {
      rule += `;COUNT=${count}`;
    } else if (until) {
      const untilStr = until.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      rule += `;UNTIL=${untilStr}`;
    }
    
    return rule;
  }

  parseRecurrenceRule(rrule: string): {
    frequency: 'daily' | 'weekly' | 'monthly',
    interval: number,
    count?: number,
    until?: Date
  } {
    const ruleObj = RRule.parseString(rrule);
    
    return {
      frequency: ruleObj.freq === RRule.DAILY 
        ? 'daily' 
        : ruleObj.freq === RRule.WEEKLY 
          ? 'weekly' 
          : 'monthly',
      interval: ruleObj.interval || 1,
      count: ruleObj.count,
      until: ruleObj.until
    };
  }

  getRecurrenceDescription(
    frequency: 'daily' | 'weekly' | 'monthly',
    interval: number = 1
  ): string {
    switch (frequency) {
      case 'daily':
        return interval === 1 
          ? 'Hver dag' 
          : `Hver ${interval}. dag`;
      case 'weekly':
        return interval === 1 
          ? 'Hver uke' 
          : `Hver ${interval}. uke`;
      case 'monthly':
        return interval === 1 
          ? 'Hver måned' 
          : `Hver ${interval}. måned`;
      default:
        return 'Gjentakende';
    }
  }
}
