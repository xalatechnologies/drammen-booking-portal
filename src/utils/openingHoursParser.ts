
export const parseOpeningHours = (hours: string): string[] => {
  try {
    console.log('parseOpeningHours - Input hours:', hours);
    
    const [start, end] = hours.split('-');
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    
    console.log('parseOpeningHours - Start hour:', startHour, 'End hour:', endHour);
    
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push(timeSlot);
    }
    
    console.log('parseOpeningHours - Generated slots:', slots);
    return slots;
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
