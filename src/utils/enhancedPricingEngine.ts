
import { PriceRule, PriceCalculation, PriceBreakdownItem, ActorType, TimeSlotCategory, BookingType, ActorStatus } from '@/types/pricing';
import { isWeekend, differenceInHours, differenceInDays, getHours } from 'date-fns';

// Enhanced mock price rules with Norwegian actor types
const mockPriceRules: PriceRule[] = [
  // Lag og foreninger (frivillige) - Gratis/redusert pris
  {
    id: 'rule-lf-1',
    facilityId: '1',
    zoneId: 'whole-facility',
    actorType: 'lag-foreninger',
    timeSlot: 'day',
    bookingType: 'engangs',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 0,
    isActive: true,
    requiresApproval: true
  },
  {
    id: 'rule-lf-2',
    facilityId: '1',
    zoneId: 'zone-1',
    actorType: 'lag-foreninger',
    timeSlot: 'evening',
    bookingType: 'fastlan',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 100,
    isActive: true,
    requiresApproval: true
  },
  
  // Paraplyorganisasjoner - Spesiell rabatt
  {
    id: 'rule-para-1',
    facilityId: '1',
    zoneId: 'whole-facility',
    actorType: 'paraply',
    timeSlot: 'day',
    bookingType: 'engangs',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 200,
    isActive: true,
    requiresApproval: true
  },
  
  // Private firmaer - Full pris
  {
    id: 'rule-pf-1',
    facilityId: '1',
    zoneId: 'whole-facility',
    actorType: 'private-firma',
    timeSlot: 'day',
    bookingType: 'engangs',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 650,
    isActive: true,
    requiresApproval: false
  },
  
  // Kommunale enheter - Redusert pris
  {
    id: 'rule-ke-1',
    facilityId: '1',
    zoneId: 'whole-facility',
    actorType: 'kommunale-enheter',
    timeSlot: 'day',
    bookingType: 'engangs',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 300,
    isActive: true,
    requiresApproval: false
  },
  
  // Private personer - Standard pris
  {
    id: 'rule-pp-1',
    facilityId: '1',
    zoneId: 'whole-facility',
    actorType: 'private-person',
    timeSlot: 'day',
    bookingType: 'engangs',
    dayType: 'weekday',
    priceType: 'hourly',
    basePrice: 450,
    isActive: true,
    requiresApproval: false
  }
];

export class EnhancedPricingEngine {
  private rules: PriceRule[] = mockPriceRules;

  calculatePrice(
    facilityId: string,
    zoneId: string,
    startDate: Date,
    endDate: Date,
    actorType: ActorType = 'private-person',
    bookingType: BookingType = 'engangs',
    timeSlot: string = '',
    actorStatus: ActorStatus = 'unverified'
  ): PriceCalculation {
    const rule = this.findApplicableRule(facilityId, zoneId, startDate, actorType, bookingType, timeSlot);
    
    if (!rule) {
      return this.createDefaultCalculation();
    }

    const totalHours = this.calculateTotalHours(startDate, endDate, timeSlot);
    const totalDays = this.calculateTotalDays(startDate, endDate);
    const dayType = isWeekend(startDate) ? 'weekend' : 'weekday';
    const timeSlotCategory = this.getTimeSlotCategory(timeSlot);

    let basePrice = rule.basePrice;
    let subtotal = 0;
    const breakdown: PriceBreakdownItem[] = [];
    const requiresApproval = rule.requiresApproval || false;

    // Calculate base cost
    if (rule.priceType === 'hourly') {
      subtotal = basePrice * totalHours;
      breakdown.push({
        description: this.getActorTypeDescription(actorType, totalHours),
        quantity: totalHours,
        unitPrice: basePrice,
        total: subtotal,
        type: 'base'
      });
    } else if (rule.priceType === 'daily') {
      subtotal = basePrice * totalDays;
      breakdown.push({
        description: `Dagspris ${this.getActorTypeDescription(actorType)} (${totalDays} dager)`,
        quantity: totalDays,
        unitPrice: basePrice,
        total: subtotal,
        type: 'base'
      });
    } else {
      subtotal = basePrice;
      breakdown.push({
        description: `Fastpris ${this.getActorTypeDescription(actorType)}`,
        quantity: 1,
        unitPrice: basePrice,
        total: subtotal,
        type: 'base'
      });
    }

    // Apply time slot multipliers
    let timeSlotMultiplier = 0;
    if (timeSlotCategory === 'evening') {
      timeSlotMultiplier = subtotal * 0.2; // 20% evening surcharge
      breakdown.push({
        description: 'Kveldsleie tillegg (20%)',
        quantity: 1,
        unitPrice: timeSlotMultiplier,
        total: timeSlotMultiplier,
        type: 'surcharge'
      });
    }

    // Apply booking type discounts
    let bookingTypeDiscount = 0;
    if (bookingType === 'fastlan' && actorType === 'lag-foreninger') {
      bookingTypeDiscount = subtotal * 0.15; // 15% discount for recurring bookings by sports clubs
      breakdown.push({
        description: 'Fastlån rabatt for lag og foreninger (15%)',
        quantity: 1,
        unitPrice: -bookingTypeDiscount,
        total: -bookingTypeDiscount,
        type: 'discount'
      });
    }

    // Apply weekend surcharge
    let weekendSurcharge = 0;
    if (dayType === 'weekend' && actorType !== 'lag-foreninger') {
      weekendSurcharge = subtotal * 0.25; // 25% weekend surcharge (except for sports clubs)
      breakdown.push({
        description: 'Helgetillegg (25%)',
        quantity: 1,
        unitPrice: weekendSurcharge,
        total: weekendSurcharge,
        type: 'surcharge'
      });
    }

    // Actor status verification discount
    let actorTypeDiscount = 0;
    if (actorStatus === 'verified' && (actorType === 'lag-foreninger' || actorType === 'paraply')) {
      actorTypeDiscount = subtotal * 0.1; // Additional 10% for verified status
      breakdown.push({
        description: 'Verifisert aktør rabatt (10%)',
        quantity: 1,
        unitPrice: -actorTypeDiscount,
        total: -actorTypeDiscount,
        type: 'discount'
      });
    }

    const finalPrice = Math.max(0, subtotal + timeSlotMultiplier - bookingTypeDiscount + weekendSurcharge - actorTypeDiscount);

    return {
      basePrice,
      totalHours,
      totalDays,
      actorTypeDiscount,
      timeSlotMultiplier,
      bookingTypeDiscount,
      weekendSurcharge,
      subtotal,
      finalPrice,
      requiresApproval,
      breakdown
    };
  }

  private findApplicableRule(
    facilityId: string,
    zoneId: string,
    date: Date,
    actorType: ActorType,
    bookingType: BookingType,
    timeSlot: string
  ): PriceRule | undefined {
    const dayType = isWeekend(date) ? 'weekend' : 'weekday';
    const timeSlotCategory = this.getTimeSlotCategory(timeSlot);
    
    // Try to find exact match first
    let rule = this.rules.find(r => 
      r.facilityId === facilityId &&
      r.zoneId === zoneId &&
      r.actorType === actorType &&
      r.bookingType === bookingType &&
      r.timeSlot === timeSlotCategory &&
      r.dayType === dayType &&
      r.isActive
    );

    // Fallback to more general rules
    if (!rule) {
      rule = this.rules.find(r => 
        r.facilityId === facilityId &&
        r.actorType === actorType &&
        r.dayType === dayType &&
        r.isActive
      );
    }

    return rule;
  }

  private getTimeSlotCategory(timeSlot: string): TimeSlotCategory {
    if (!timeSlot || !timeSlot.includes('-')) return 'day';
    
    const [startTime] = timeSlot.split(' - ');
    const [startHour] = startTime.split(':').map(Number);
    
    if (startHour >= 6 && startHour < 12) return 'morning';
    if (startHour >= 12 && startHour < 17) return 'day';
    if (startHour >= 17 && startHour < 23) return 'evening';
    return 'night';
  }

  private getActorTypeDescription(actorType: ActorType, hours?: number): string {
    const hourText = hours ? ` (${hours} timer)` : '';
    
    switch (actorType) {
      case 'lag-foreninger':
        return `Lag og foreninger${hourText}`;
      case 'paraply':
        return `Paraplyorganisasjon${hourText}`;
      case 'private-firma':
        return `Privat firma${hourText}`;
      case 'kommunale-enheter':
        return `Kommunal enhet${hourText}`;
      case 'private-person':
        return `Privatperson${hourText}`;
      default:
        return `Timepris${hourText}`;
    }
  }

  private calculateTotalHours(startDate: Date, endDate: Date, timeSlot: string): number {
    if (timeSlot && timeSlot.includes('-')) {
      const [startTime, endTime] = timeSlot.split(' - ');
      const [startHour] = startTime.split(':').map(Number);
      const [endHour] = endTime.split(':').map(Number);
      return endHour - startHour;
    }
    
    return differenceInHours(endDate, startDate) || 2;
  }

  private calculateTotalDays(startDate: Date, endDate: Date): number {
    return differenceInDays(endDate, startDate) + 1;
  }

  private createDefaultCalculation(): PriceCalculation {
    return {
      basePrice: 0,
      totalHours: 0,
      totalDays: 0,
      actorTypeDiscount: 0,
      timeSlotMultiplier: 0,
      bookingTypeDiscount: 0,
      weekendSurcharge: 0,
      subtotal: 0,
      finalPrice: 0,
      requiresApproval: false,
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

export const enhancedPricingEngine = new EnhancedPricingEngine();
