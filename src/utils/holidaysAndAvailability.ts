
import { addDays, format, isWeekend } from 'date-fns';

// Norwegian national holidays for 2025
export const norwegianHolidays2025 = [
  { date: new Date(2025, 0, 1), name: 'Nyttårsdag' },
  { date: new Date(2025, 2, 13), name: 'Skjærtorsdag' },
  { date: new Date(2025, 2, 14), name: 'Langfredag' },
  { date: new Date(2025, 2, 16), name: 'Første påskedag' },
  { date: new Date(2025, 2, 17), name: 'Andre påskedag' },
  { date: new Date(2025, 3, 1), name: 'Arbeidernes dag' },
  { date: new Date(2025, 3, 17), name: 'Grunnlovsdag' },
  { date: new Date(2025, 4, 25), name: 'Kristi himmelfartsdag' },
  { date: new Date(2025, 5, 4), name: 'Første pinsedag' },
  { date: new Date(2025, 5, 5), name: 'Andre pinsedag' },
  { date: new Date(2025, 11, 25), name: 'Første juledag' },
  { date: new Date(2025, 11, 26), name: 'Andre juledag' }
];

// Function to check if a date is a Norwegian holiday
export const isNorwegianHoliday = (date: Date): { isHoliday: boolean; name?: string } => {
  const holiday = norwegianHolidays2025.find(
    holiday => holiday.date.toDateString() === date.toDateString()
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
  
  // Mock some maintenance days
  const maintenanceDays = [
    new Date(2025, 5, 15), // June 15, 2025
    new Date(2025, 6, 20), // July 20, 2025
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

// Get availability status with color coding for UI
export const getDateAvailabilityStatus = (date: Date) => {
  const unavailableCheck = isDateUnavailable(date);
  
  if (unavailableCheck.isUnavailable) {
    const colorClass = {
      'past': 'text-gray-400 bg-gray-100',
      'weekend': 'text-orange-600 bg-orange-50',
      'holiday': 'text-red-600 bg-red-50',
      'maintenance': 'text-yellow-600 bg-yellow-50'
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
    colorClass: 'text-green-600 bg-green-50',
    tooltip: 'Tilgjengelig for booking',
    reason: 'available'
  };
};
