

export const parseOpeningHours = (hours: string): string[] => {
  try {
    console.log('parseOpeningHours - Input hours:', hours);
    
    // Handle complex opening hours format like "Man-Fre: 08:00-22:00, Lør-Søn: 10:00-20:00"
    if (hours.includes('Man-Fre') || hours.includes('Lør-Søn') || hours.includes(',')) {
      // For now, extract the weekday hours (Man-Fre) as the primary schedule
      const weekdayMatch = hours.match(/Man-Fre:\s*(\d{2}:\d{2})-(\d{2}:\d{2})/);
      if (weekdayMatch) {
        const startTime = weekdayMatch[1];
        const endTime = weekdayMatch[2];
        
        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        
        console.log('parseOpeningHours - Extracted weekday hours - Start:', startHour, 'End:', endHour);
        
        const slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
          slots.push(timeSlot);
        }
        
        console.log('parseOpeningHours - Generated slots from complex format:', slots);
        return slots;
      }
    }
    
    // Handle simple format like "08:00-22:00"
    const [start, end] = hours.split('-');
    if (start && end) {
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      
      console.log('parseOpeningHours - Simple format - Start hour:', startHour, 'End hour:', endHour);
      
      if (!isNaN(startHour) && !isNaN(endHour)) {
        const slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
          slots.push(timeSlot);
        }
        
        console.log('parseOpeningHours - Generated slots from simple format:', slots);
        return slots;
      }
    }
    
    throw new Error('Unable to parse opening hours format');
  } catch (error) {
    console.error('parseOpeningHours - Error parsing hours:', error);
    // Fallback to default hours if parsing fails
    const defaultSlots = [
      "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", 
      "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", 
      "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", 
      "20:00-21:00", "21:00-22:00"
    ];
    console.log('parseOpeningHours - Using fallback slots:', defaultSlots);
    return defaultSlots;
  }
};

