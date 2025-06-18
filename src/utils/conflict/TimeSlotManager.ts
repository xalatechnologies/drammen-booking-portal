
interface TimeSlot {
  start: Date;
  end: Date;
}

export class TimeSlotManager {
  parseTimeSlot(date: Date, timeSlot: string): TimeSlot | null {
    const [startStr, endStr] = timeSlot.split('-');
    if (!startStr || !endStr) return null;
    
    const [startHours, startMinutes] = startStr.split(':').map(Number);
    const [endHours, endMinutes] = endStr.split(':').map(Number);
    
    const startDate = new Date(date);
    startDate.setHours(startHours || 0, startMinutes || 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(endHours || 0, endMinutes || 0, 0, 0);
    
    return { start: startDate, end: endDate };
  }

  doSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
    return slot1.start < slot2.end && slot2.start < slot1.end;
  }

  doAnyOverlap(slots1: TimeSlot[], slots2: TimeSlot[]): boolean {
    for (const slot1 of slots1) {
      for (const slot2 of slots2) {
        if (this.doSlotsOverlap(slot1, slot2)) {
          return true;
        }
      }
    }
    return false;
  }

  formatTimeSlot(slot: TimeSlot): string {
    const formatTime = (date: Date) => 
      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    return `${formatTime(slot.start)}-${formatTime(slot.end)}`;
  }

  getDurationMinutes(slot: TimeSlot): number {
    return (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);
  }
}
