
export interface StrøtimeSlot {
  id: string;
  facilityId: string;
  facilityName: string;
  zoneId: string;
  zoneName: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes (30 or 60)
  isAvailable: boolean;
  publishedAt: Date;
  publishedBy: string;
  bookedBy?: string;
  bookedAt?: Date;
  pricePerSlot: number;
}

export interface StrøtimeBooking {
  id: string;
  strøtimeSlotId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  bookedAt: Date;
  status: 'confirmed' | 'cancelled' | 'no-show';
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface StrøtimeFilters {
  facilityId?: string;
  zoneId?: string;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  isAvailable?: boolean;
  duration?: number;
}
