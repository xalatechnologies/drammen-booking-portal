
// Create a stable hash for consistent availability
export const createStableHash = (zoneId: string, date: Date, timeSlot: string): number => {
  const str = `${zoneId}-${date.toDateString()}-${timeSlot}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Stable availability function - no random behavior
export const getStableAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
  const now = new Date();
  const timeHour = parseInt(timeSlot.split(':')[0]);
  const slotDateTime = new Date(date);
  slotDateTime.setHours(timeHour, 0, 0, 0);
  
  if (slotDateTime < now) {
    return { status: 'unavailable', conflict: null };
  }

  // Use stable hash instead of random to determine if slot is booked
  const hash = createStableHash(zoneId, date, timeSlot);
  const isBooked = (hash % 10) < 2; // 20% of slots are "busy"
  
  return { 
    status: isBooked ? 'busy' : 'available', 
    conflict: isBooked ? { type: 'existing-booking', details: 'Allerede booket' } : null 
  };
};
