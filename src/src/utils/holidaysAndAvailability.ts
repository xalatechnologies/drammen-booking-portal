
import { addDays, format, isWeekend, getYear } from 'date-fns';

// Function to calculate Easter date for a given year (using the algorithm)
const getEasterDate = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

// Function to get all Norwegian holidays for a given year
export const getNorwegianHolidaysForYear = (year: number) => {
  const easter = getEasterDate(year);
  
  console.log(`Calculating holidays for year ${year}, Easter: ${easter.toDateString()}`);
  
  return [
    // Fixed holidays
    { date: new Date(year, 0, 1), name: 'Nyttårsdag' },
    { date: new Date(year, 4, 1), name: 'Arbeidernes dag' },
    { date: new Date(year, 4, 17), name: 'Grunnlovsdag' },
    { date: new Date(year, 11, 25), name: 'Første juledag' },
    { date: new Date(year, 11, 26), name: 'Andre juledag' },
    
    // Easter-based holidays (calculated dynamically)
    { date: addDays(easter, -3), name: 'Skjærtorsdag' },
    { date: addDays(easter, -2), name: 'Langfredag' },
    { date: easter, name: 'Første påskedag' },
    { date: addDays(easter, 1), name: 'Andre påskedag' },
    { date: addDays(easter, 39), name: 'Kristi himmelfartsdag' },
    { date: addDays(easter, 49), name: 'Første pinsedag' },
    { date: addDays(easter, 50), name: 'Andre pinsedag' },
  ];
};

// Function to check if a date is a Norwegian holiday
export const isNorwegianHoliday = (date: Date): { isHoliday: boolean; name?: string } => {
  const year = getYear(date);
  const holidays = getNorwegianHolidaysForYear(year);
  
  const holiday = holidays.find(
    holiday => {
      const holidayDateString = holiday.date.toDateString();
      const checkDateString = date.toDateString();
      console.log(`Comparing ${holidayDateString} with ${checkDateString}`);
      return holidayDateString === checkDateString;
    }
  );
  
  return {
    isHoliday: !!holiday,
    name: holiday?.name
  };
};

// Function to check if a date is unavailable (past date, weekend, or holiday)
export const isDateUnavailable = (date: Date): { 
  isUnavailable: boolean; 
  reason?: 'past' | 'weekend' | 'holiday' | 'maintenance';
  details?: string;
} => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if date is in the past
  if (date < today) {
    return { isUnavailable: true, reason: 'past', details: 'Fortid' };
  }
  
  // Check if date is a holiday
  const holidayCheck = isNorwegianHoliday(date);
  if (holidayCheck.isHoliday) {
    return { 
      isUnavailable: true, 
      reason: 'holiday', 
      details: holidayCheck.name 
    };
  }
  
  // Check if date is weekend (optional - some facilities might be closed on weekends)
  if (isWeekend(date)) {
    return { 
      isUnavailable: true, 
      reason: 'weekend', 
      details: 'Helg - begrenset tilgang' 
    };
  }
  
  // Mock some maintenance days (you can make this more dynamic in the future)
  const maintenanceDays = [
    new Date(2025, 5, 15), // June 15, 2025
    new Date(2025, 6, 20), // July 20, 2025
    new Date(2026, 5, 15), // June 15, 2026
    new Date(2026, 6, 20), // July 20, 2026
  ];
  
  const isMaintenanceDay = maintenanceDays.some(
    maintenanceDate => maintenanceDate.toDateString() === date.toDateString()
  );
  
  if (isMaintenanceDay) {
    return { 
      isUnavailable: true, 
      reason: 'maintenance', 
      details: 'Vedlikehold' 
    };
  }
  
  return { isUnavailable: false };
};

// Get availability status with improved color coding for UI
export const getDateAvailabilityStatus = (date: Date) => {
  const unavailableCheck = isDateUnavailable(date);
  
  if (unavailableCheck.isUnavailable) {
    const colorClass = {
      'past': 'text-gray-500 bg-gray-100',
      'weekend': 'text-amber-800 bg-amber-100',
      'holiday': 'text-red-800 bg-red-200',
      'maintenance': 'text-yellow-800 bg-yellow-200'
    }[unavailableCheck.reason!];
    
    return {
      isAvailable: false,
      colorClass,
      tooltip: unavailableCheck.details,
      reason: unavailableCheck.reason
    };
  }
  
  return {
    isAvailable: true,
    colorClass: 'text-green-800 bg-green-100',
    tooltip: 'Tilgjengelig for booking',
    reason: 'available'
  };
};
