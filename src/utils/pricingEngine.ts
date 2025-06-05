
import { PriceRule, PriceCalculation, PriceBreakdownItem, CustomerType } from '@/types/pricing';
import { isWeekend, differenceInHours, differenceInDays } from 'date-fns';

// Enhanced mock price rules with new customer types
const mockPriceRules: PriceRule[] = [
  // Private customers
  {
    id: 'rule-1',
    facilityId: '1',
    zoneId: 'whole-facility',
    customerType: 'private',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 450,
    isActive: true
  },
  {
    id: 'rule-2',
    facilityId: '1',
    zoneId: 'zone-1',
    customerType: 'private',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 250,
    isActive: true
  },
  {
    id: 'rule-3',
    facilityId: '1',
    zoneId: 'zone-2',
    customerType: 'private',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 280,
    isActive: true
  },
  // Nonprofit organizations
  {
    id: 'rule-4',
    facilityId: '1',
    zoneId: 'whole-facility',
    customerType: 'nonprofit',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 300,
    isActive: true
  },
  {
    id: 'rule-5',
    facilityId: '1',
    zoneId: 'zone-1',
    customerType: 'nonprofit',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 180,
    isActive: true
  },
  {
    id: 'rule-6',
    facilityId: '1',
    zoneId: 'zone-2',
    customerType: 'nonprofit',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 200,
    isActive: true
  },
  // Business customers
  {
    id: 'rule-7',
    facilityId: '1',
    zoneId: 'whole-facility',
    customerType: 'business',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 650,
    isActive: true
  },
  // Youth customers
  {
    id: 'rule-8',
    facilityId: '1',
    zoneId: 'whole-facility',
    customerType: 'youth',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 200,
    isActive: true
  },
  // Senior customers
  {
    id: 'rule-9',
    facilityId: '1',
    zoneId: 'whole-facility',
    customerType: 'senior',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 350,
    isActive: true
  }
];

export class PricingEngine {
  private rules: PriceRule[] = mockPriceRules;

  calculatePrice(
    facilityId: string,
    zoneId: string,
    startDate: Date,
    endDate: Date,
    customerType: CustomerType = 'private',
    timeSlot: string = '',
    bookingMode: 'one-time' | 'date-range' | 'recurring' = 'one-time',
    eventType?: string,
    ageGroup?: string
  ): PriceCalculation {
    const rule = this.findApplicableRule(facilityId, zoneId, startDate, customerType);
    
    if (!rule) {
      return this.createDefaultCalculation();
    }

    const totalHours = this.calculateTotalHours(startDate, endDate, timeSlot, bookingMode);
    const totalDays = this.calculateTotalDays(startDate, endDate, bookingMode);
    const dayType = isWeekend(startDate) ? 'weekend' : 'weekday';

    let basePrice = rule.basePrice;
    let subtotal = 0;
    const breakdown: PriceBreakdownItem[] = [];

    // Calculate base cost
    if (rule.priceType === 'hourly') {
      subtotal = basePrice * totalHours;
      breakdown.push({
        description: `Timepris (${totalHours} timer)`,
        quantity: totalHours,
        unitPrice: basePrice,
        total: subtotal,
        type: 'base'
      });
    } else if (rule.priceType === 'daily') {
      subtotal = basePrice * totalDays;
      breakdown.push({
        description: `Dagspris (${totalDays} dager)`,
        quantity: totalDays,
        unitPrice: basePrice,
        total: subtotal,
        type: 'base'
      });
    } else {
      subtotal = basePrice;
      breakdown.push({
        description: 'Fastpris',
        quantity: 1,
        unitPrice: basePrice,
        total: subtotal,
        type: 'base'
      });
    }

    // Apply customer type discounts
    let customerTypeDiscount = 0;
    if (customerType === 'nonprofit') {
      customerTypeDiscount = subtotal * 0.2; // 20% discount for nonprofits
      breakdown.push({
        description: 'Rabatt frivillige organisasjoner (20%)',
        quantity: 1,
        unitPrice: -customerTypeDiscount,
        total: -customerTypeDiscount,
        type: 'discount'
      });
    } else if (customerType === 'youth') {
      customerTypeDiscount = subtotal * 0.3; // 30% discount for youth
      breakdown.push({
        description: 'Ungdomsrabatt (30%)',
        quantity: 1,
        unitPrice: -customerTypeDiscount,
        total: -customerTypeDiscount,
        type: 'discount'
      });
    } else if (customerType === 'senior') {
      customerTypeDiscount = subtotal * 0.15; // 15% discount for seniors
      breakdown.push({
        description: 'Seniorrabatt (15%)',
        quantity: 1,
        unitPrice: -customerTypeDiscount,
        total: -customerTypeDiscount,
        type: 'discount'
      });
    }

    // Apply weekend surcharge
    let weekendSurcharge = 0;
    if (dayType === 'weekend') {
      weekendSurcharge = subtotal * 0.15; // 15% weekend surcharge
      breakdown.push({
        description: 'Helgetillegg (15%)',
        quantity: 1,
        unitPrice: weekendSurcharge,
        total: weekendSurcharge,
        type: 'surcharge'
      });
    }

    // Event type modifiers
    if (eventType === 'competition') {
      const competitionSurcharge = subtotal * 0.1; // 10% for competitions
      breakdown.push({
        description: 'Tillegg konkurranse (10%)',
        quantity: 1,
        unitPrice: competitionSurcharge,
        total: competitionSurcharge,
        type: 'surcharge'
      });
      weekendSurcharge += competitionSurcharge;
    }

    const finalPrice = Math.max(0, subtotal - customerTypeDiscount + weekendSurcharge);

    return {
      basePrice,
      totalHours,
      totalDays,
      customerTypeDiscount,
      weekendSurcharge,
      subtotal,
      finalPrice,
      breakdown
    };
  }

  private findApplicableRule(
    facilityId: string,
    zoneId: string,
    date: Date,
    customerType: CustomerType
  ): PriceRule | undefined {
    const dayType = isWeekend(date) ? 'weekend' : 'weekday';
    
    // Try to find zone-specific rule first
    let rule = this.rules.find(r => 
      r.facilityId === facilityId &&
      r.zoneId === zoneId &&
      r.customerType === customerType &&
      r.dayType === dayType &&
      r.isActive
    );

    // Fallback to weekday rule if weekend rule not found
    if (!rule && dayType === 'weekend') {
      rule = this.rules.find(r => 
        r.facilityId === facilityId &&
        r.zoneId === zoneId &&
        r.customerType === customerType &&
        r.dayType === 'weekday' &&
        r.isActive
      );
    }

    // Fallback to facility-level rule
    if (!rule) {
      rule = this.rules.find(r => 
        r.facilityId === facilityId &&
        !r.zoneId &&
        r.customerType === customerType &&
        r.isActive
      );
    }

    return rule;
  }

  private calculateTotalHours(
    startDate: Date,
    endDate: Date,
    timeSlot: string,
    bookingMode: string
  ): number {
    if (timeSlot && timeSlot.includes('-')) {
      const [startTime, endTime] = timeSlot.split(' - ');
      const [startHour] = startTime.split(':').map(Number);
      const [endHour] = endTime.split(':').map(Number);
      const hoursPerDay = endHour - startHour;

      if (bookingMode === 'date-range') {
        const days = differenceInDays(endDate, startDate) + 1;
        return hoursPerDay * days;
      }
      return hoursPerDay;
    }
    
    return differenceInHours(endDate, startDate) || 2; // Default 2 hours
  }

  private calculateTotalDays(
    startDate: Date,
    endDate: Date,
    bookingMode: string
  ): number {
    if (bookingMode === 'date-range') {
      return differenceInDays(endDate, startDate) + 1;
    }
    return 1;
  }

  private createDefaultCalculation(): PriceCalculation {
    return {
      basePrice: 0,
      totalHours: 0,
      totalDays: 0,
      customerTypeDiscount: 0,
      weekendSurcharge: 0,
      subtotal: 0,
      finalPrice: 0,
      breakdown: []
    };
  }

  applyOverride(calculation: PriceCalculation, overrideAmount: number, reason: string): PriceCalculation {
    const overrideTotal = overrideAmount - calculation.finalPrice;
    
    return {
      ...calculation,
      overrideAmount,
      overrideReason: reason,
      finalPrice: overrideAmount,
      breakdown: [
        ...calculation.breakdown,
        {
          description: `Manuell justering: ${reason}`,
          quantity: 1,
          unitPrice: overrideTotal,
          total: overrideTotal,
          type: 'override'
        }
      ]
    };
  }
}

export const pricingEngine = new PricingEngine();
