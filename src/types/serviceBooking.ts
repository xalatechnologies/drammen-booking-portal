
export interface ServiceBooking {
  id: string;
  bookingId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  startTime?: Date;
  endTime?: Date;
  specialInstructions?: string;
  createdAt: Date;
}
