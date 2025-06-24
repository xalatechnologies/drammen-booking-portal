
export interface BookingService {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface BookingPricing {
  basePrice: number;
  servicesCost: number;
  discounts: PriceDiscount[];
  surcharges: PriceSurcharge[];
  taxes: PriceTax[];
  totalPrice: number;
  currency: string;
  calculatedAt: Date;
  breakdown: PriceBreakdownItem[];
}

export interface PriceDiscount {
  type: string;
  description: string;
  amount: number;
  percentage?: number;
}

export interface PriceSurcharge {
  type: string;
  description: string;
  amount: number;
  percentage?: number;
}

export interface PriceTax {
  type: string;
  rate: number;
  amount: number;
}

export interface PriceBreakdownItem {
  description: string;
  amount: number;
  type: 'base' | 'service' | 'discount' | 'surcharge' | 'tax';
}
