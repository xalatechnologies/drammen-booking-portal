
import { ActorType, BookingType, PriceCalculation, PriceRule, TimeSlotCategory } from '@/types/pricing';

// Mock price rules - these would come from database in real implementation
const mockPriceRules: PriceRule[] = [
  {
    id: "1",
    facilityId: "1",
    zoneId: "whole-facility",
    actorType: "lag-foreninger",
    timeSlot: "day",
    bookingType: "engangs",
    dayType: "weekday",
    priceType: "hourly",
    basePrice: 0,
    isActive: true,
    requiresApproval: true
  },
  {
    id: "2", 
    facilityId: "1",
    zoneId: "whole-facility",
    actorType: "lag-foreninger",
    timeSlot: "evening",
    bookingType: "fastlan",
    dayType: "weekday",
    priceType: "hourly",
    basePrice: 0,
    isActive: true,
    requiresApproval: true
  },
  {
    id: "3",
    facilityId: "1", 
    zoneId: "whole-facility",
    actorType: "private-firma",
    timeSlot: "day",
    bookingType: "engangs",
    dayType: "weekday",
    priceType: "hourly",
    basePrice: 450,
    isActive: true
  },
  {
    id: "4",
    facilityId: "1",
    zoneId: "whole-facility", 
    actorType: "private-firma",
    timeSlot: "evening",
    bookingType: "engangs",
    dayType: "weekday",
    priceType: "hourly",
    basePrice: 550,
    isActive: true
  },
  {
    id: "5",
    facilityId: "1",
    zoneId: "whole-facility",
    actorType: "private-person",
    timeSlot: "day", 
    bookingType: "engangs",
    dayType: "weekday",
    priceType: "hourly",
    basePrice: 300,
    isActive: true
  },
  {
    id: "6",
    facilityId: "1",
    zoneId: "whole-facility",
    actorType: "private-person",
    timeSlot: "evening",
    bookingType: "engangs", 
    dayType: "weekday",
    priceType: "hourly",
    basePrice: 350,
    isActive: true
  },
  {
    id: "7",
    facilityId: "1",
    zoneId: "whole-facility",
    actorType: "kommunale-enheter",
    timeSlot: "day",
    bookingType: "engangs",
    dayType: "weekday", 
    priceType: "hourly",
    basePrice: 200,
    isActive: true
  },
  {
    id: "8",
    facilityId: "1",
    zoneId: "whole-facility",
    actorType: "paraply",
    timeSlot: "day",
    bookingType: "engangs",
    dayType: "weekday",
    priceType: "hourly", 
    basePrice: 100,
    isActive: true,
    requiresApproval: true
  },
  {
    id: "9",
    facilityId: "1",
    zoneId: "zone-1",
    actorType: "private-person",
    timeSlot: "day",
    bookingType: "engangs",
    dayType: "weekday",
    priceType: "hourly",
    basePrice: 180,
    isActive: true
  }
];

export interface PricingEngineOptions {
  facilityId: string;
  zoneId: string;
  startDate: Date;
  endDate: Date;
  actorType: ActorType;
  timeSlot: string;
  bookingMode?: 'one-time' | 'date-range' | 'recurring';
  eventType?: string;
  ageGroup?: string;
}

class PricingEngine {
  calculatePrice(
    facilityId: string,
    zoneId: string, 
    startDate: Date,
    endDate: Date,
    actorType: ActorType,
    timeSlot: string,
    bookingMode: 'one-time' | 'date-range' | 'recurring' = 'one-time',
    eventType?: string,
    ageGroup?: string
  ): PriceCalculation {
    console.log('PricingEngine.calculatePrice called with:', {
      facilityId, zoneId, startDate, endDate, actorType, timeSlot, bookingMode
    });

    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const totalHours = Math.max(duration, 2);
    const isWeekend = startDate.getDay() === 0 || startDate.getDay() === 6;
    
    // Map booking mode to booking type
    const bookingType: BookingType = bookingMode === 'recurring' ? 'fastlan' : 'engangs';
    
    // Determine time slot category
    const hour = parseInt(timeSlot.split(':')[0]) || 12;
    let timeSlotCategory: TimeSlotCategory;
    if (hour < 12) timeSlotCategory = 'morning';
    else if (hour < 17) timeSlotCategory = 'day';
    else if (hour < 23) timeSlotCategory = 'evening';
    else timeSlotCategory = 'night';

    // Find applicable price rule
    const rule = this.findPriceRule(facilityId, zoneId, actorType, timeSlotCategory, bookingType, isWeekend);
    
    if (!rule) {
      console.warn('No price rule found, using default pricing');
      return this.createDefaultCalculation(totalHours, actorType);
    }

    console.log('Found price rule:', rule);

    // Special handling for non-profit organizations
    if (actorType === 'lag-foreninger') {
      return {
        basePrice: 0,
        totalHours,
        totalDays: 1,
        actorTypeDiscount: 0,
        timeSlotMultiplier: 1,
        bookingTypeDiscount: 0,
        weekendSurcharge: 0,
        subtotal: 0,
        finalPrice: 0,
        requiresApproval: true,
        breakdown: [{
          description: 'Gratis for lag og foreninger',
          quantity: totalHours,
          unitPrice: 0,
          total: 0,
          type: 'base'
        }]
      };
    }

    const basePrice = rule.basePrice * totalHours;
    let finalPrice = basePrice;
    const breakdown = [];

    // Base price breakdown
    breakdown.push({
      description: `Grunnpris (${totalHours} timer)`,
      quantity: totalHours,
      unitPrice: rule.basePrice,
      total: basePrice,
      type: 'base' as const
    });

    // Weekend surcharge
    let weekendSurcharge = 0;
    if (isWeekend) {
      weekendSurcharge = basePrice * 0.2;
      finalPrice += weekendSurcharge;
      breakdown.push({
        description: 'Helgetillegg (20%)',
        quantity: 1,
        unitPrice: weekendSurcharge,
        total: weekendSurcharge,
        type: 'surcharge' as const
      });
    }

    // Evening surcharge
    let eveningSurcharge = 0;
    if (timeSlotCategory === 'evening') {
      eveningSurcharge = basePrice * 0.1;
      finalPrice += eveningSurcharge;
      breakdown.push({
        description: 'Kveldsleie (10%)',
        quantity: 1,
        unitPrice: eveningSurcharge,
        total: eveningSurcharge,
        type: 'surcharge' as const
      });
    }

    // Recurring booking discount
    let bookingTypeDiscount = 0;
    if (bookingType === 'fastlan' && actorType === 'lag-foreninger') {
      bookingTypeDiscount = finalPrice * 0.1;
      finalPrice -= bookingTypeDiscount;
      breakdown.push({
        description: 'Fastlån rabatt (10%)',
        quantity: 1,
        unitPrice: -bookingTypeDiscount,
        total: -bookingTypeDiscount,
        type: 'discount' as const
      });
    }

    return {
      basePrice: rule.basePrice,
      totalHours,
      totalDays: 1,
      actorTypeDiscount: 0,
      timeSlotMultiplier: timeSlotCategory === 'evening' ? 1.1 : 1,
      bookingTypeDiscount,
      weekendSurcharge,
      subtotal: basePrice,
      finalPrice: Math.max(0, finalPrice),
      requiresApproval: rule.requiresApproval || false,
      breakdown
    };
  }

  private findPriceRule(
    facilityId: string,
    zoneId: string,
    actorType: ActorType,
    timeSlot: TimeSlotCategory,
    bookingType: BookingType,
    isWeekend: boolean
  ): PriceRule | null {
    const dayType = isWeekend ? 'weekend' : 'weekday';
    
    return mockPriceRules.find(rule => 
      rule.facilityId === facilityId &&
      rule.zoneId === zoneId &&
      rule.actorType === actorType &&
      rule.timeSlot === timeSlot &&
      rule.bookingType === bookingType &&
      rule.dayType === dayType &&
      rule.isActive
    ) || mockPriceRules.find(rule =>
      rule.facilityId === facilityId &&
      rule.zoneId === zoneId &&
      rule.actorType === actorType &&
      rule.dayType === dayType &&
      rule.isActive
    ) || null;
  }

  private createDefaultCalculation(totalHours: number, actorType: ActorType): PriceCalculation {
    const basePrice = 300;
    const total = basePrice * totalHours;
    
    return {
      basePrice,
      totalHours,
      totalDays: 1,
      actorTypeDiscount: 0,
      timeSlotMultiplier: 1,
      bookingTypeDiscount: 0,
      weekendSurcharge: 0,
      subtotal: total,
      finalPrice: total,
      requiresApproval: actorType === 'lag-foreninger' || actorType === 'paraply',
      breakdown: [{
        description: `Standard pris (${totalHours} timer)`,
        quantity: totalHours,
        unitPrice: basePrice,
        total,
        type: 'base'
      }]
    };
  }

  applyOverride(calculation: PriceCalculation, amount: number, reason: string): PriceCalculation {
    return {
      ...calculation,
      overrideAmount: amount,
      overrideReason: reason,
      finalPrice: amount,
      breakdown: [
        ...calculation.breakdown,
        {
          description: `Manual justering: ${reason}`,
          quantity: 1,
          unitPrice: amount - calculation.finalPrice,
          total: amount - calculation.finalPrice,
          type: 'override' as const
        }
      ]
    };
  }
}

export const pricingEngine = new PricingEngine();
