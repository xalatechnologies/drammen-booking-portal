
export interface StrøtimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  zoneName: string;
  zoneId: string;
  pricePerSlot: number;
  isAvailable: boolean;
  maxParticipants: number;
}
