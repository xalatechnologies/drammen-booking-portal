
import { PriceCalculation, PriceBreakdownItem, ActorType, BookingType, TimeSlotCategory } from '@/types/pricing';

export class EnhancedPricingEngine {
  private basePrices = {
    'facility-1': {
      'zone-1': 200,
      'zone-2': 150,
      'zone-3': 100
    },
    'facility-2': {
      'zone-1': 300,
      'zone-2': 250
    }
  };

  private actorDiscounts = {
    'lag-foreninger': 1.0, // Free for verified nonprofits
    'paraply': 0.5, // 50% discount
    'private-firma': 0, // No discount
    'kommunale-enheter': 0.3, // 30% discount
    'private-person': 0 // No discount
  };

  private timeSlotMultipliers = {
    'morning': 0.8,
    'day': 1.0,
    'evening': 1.2,
    'night': 1.5
  };

  private bookingTypeDiscounts = {
    'engangs': 0, // No discount for one-time bookings
    'fastlan': 0.1 // 10% discount for recurring bookings
  };

  calculatePrice(
    facilityId: string,
    zoneId: string,
    startDate: Date,
    endDate: Date,
    actorType: ActorType,
    timeSlot: string,
    bookingType: BookingType,
    eventType?: string,
    ageGroup?: string
  ): PriceCalculation {
    console.log('EnhancedPricingEngine.calculatePrice called with:', {
      facilityId,
      zoneId,
      startDate,
      endDate,
      actorType,
      timeSlot,
      bookingType,
      eventType,
      ageGroup
    });

    const basePrice = this.getBasePrice(facilityId, zoneId);
    const hours = this.calculateHours(startDate, endDate);
    const days = this.calculateDays(startDate, endDate);
    
    const timeSlotCategory = this.getTimeSlotCategory(timeSlot);
    const timeSlotMultiplier = this.timeSlotMultipliers[timeSlotCategory];
    
    const actorDiscount = this.actorDiscounts[actorType];
    const bookingTypeDiscount = this.bookingTypeDiscounts[bookingType];
    
    const isWeekend = this.isWeekend(startDate);
    const weekendSurcharge = isWeekend ? 0.2 : 0;

    // Calculate subtotal
    let subtotal = basePrice * hours * timeSlotMultiplier;
    
    // Apply weekend surcharge
    if (weekendSurcharge > 0) {
      subtotal *= (1 + weekendSurcharge);
    }
    
    // Apply booking type discount
    if (bookingTypeDiscount > 0) {
      subtotal *= (1 - bookingTypeDiscount);
    }

    // Calculate final price based on actor type
    let finalPrice = subtotal;
    
    // Special case for nonprofits - they get free or heavily discounted rates
    if (actorType === 'lag-foreninger') {
      finalPrice = 0; // Free for verified nonprofits
    } else if (actorDiscount > 0) {
      finalPrice *= (1 - actorDiscount);
    }

    // Build breakdown
    const breakdown: PriceBreakdownItem[] = [];

    // Base price
    breakdown.push({
      description: `Basispris (${hours} timer × ${basePrice} kr)`,
      amount: basePrice * hours,
      type: 'base'
    });

    // Time slot multiplier
    if (timeSlotMultiplier !== 1.0) {
      breakdown.push({
        description: `${this.getTimeSlotDescription(timeSlotCategory)} (${timeSlotMultiplier}x)`,
        amount: (basePrice * hours * timeSlotMultiplier) - (basePrice * hours),
        type: timeSlotMultiplier > 1 ? 'surcharge' : 'discount'
      });
    }

    // Weekend surcharge
    if (weekendSurcharge > 0) {
      breakdown.push({
        description: `Helgetillegg (${(weekendSurcharge * 100).toFixed(0)}%)`,
        amount: subtotal * weekendSurcharge,
        type: 'surcharge'
      });
    }

    // Booking type discount
    if (bookingTypeDiscount > 0) {
      breakdown.push({
        description: `${bookingType === 'fastlan' ? 'Fastlån' : 'Booking'} rabatt (${(bookingTypeDiscount * 100).toFixed(0)}%)`,
        amount: -(subtotal * bookingTypeDiscount),
        type: 'discount'
      });
    }

    // Actor type discount/free
    if (actorType === 'lag-foreninger') {
      breakdown.push({
        description: 'Gratis for frivillige organisasjoner',
        amount: -subtotal,
        type: 'discount'
      });
    } else if (actorDiscount > 0) {
      breakdown.push({
        description: `${this.getActorTypeDescription(actorType)} rabatt (${(actorDiscount * 100).toFixed(0)}%)`,
        amount: -(subtotal * actorDiscount),
        type: 'discount'
      });
    }

    // Event type adjustments
    if (eventType) {
      const eventAdjustment = this.getEventTypeAdjustment(eventType);
      if (eventAdjustment !== 0) {
        breakdown.push({
          description: `${eventType} justering`,
          amount: finalPrice * eventAdjustment,
          type: eventAdjustment > 0 ? 'surcharge' : 'discount'
        });
        finalPrice *= (1 + eventAdjustment);
      }
    }

    const requiresApproval = this.requiresApproval(actorType, finalPrice, eventType);

    return {
      basePrice,
      totalHours: hours,
      totalDays: days,
      actorTypeDiscount: actorDiscount,
      timeSlotMultiplier,
      bookingTypeDiscount,
      weekendSurcharge,
      subtotal,
      finalPrice: Math.max(0, finalPrice),
      requiresApproval,
      breakdown
    };
  }

  private getBasePrice(facilityId: string, zoneId: string): number {
    return this.basePrices[facilityId]?.[zoneId] || 200;
  }

  private calculateHours(startDate: Date, endDate: Date): number {
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)));
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  }

  private getTimeSlotCategory(timeSlot: string): TimeSlotCategory {
    const hour = parseInt(timeSlot.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'day';
    if (hour >= 17 && hour < 23) return 'evening';
    return 'night';
  }

  private getTimeSlotDescription(category: TimeSlotCategory): string {
    const descriptions = {
      'morning': 'Morgentillegg',
      'day': 'Dagtillegg',
      'evening': 'Kveldstillegg',
      'night': 'Nattetillegg'
    };
    return descriptions[category];
  }

  private getActorTypeDescription(actorType: ActorType): string {
    const descriptions = {
      'lag-foreninger': 'Frivillig organisasjon',
      'paraply': 'Paraplyorganisasjon',
      'private-firma': 'Privat firma',
      'kommunale-enheter': 'Kommunal enhet',
      'private-person': 'Privatperson'
    };
    return descriptions[actorType];
  }

  private getEventTypeAdjustment(eventType: string): number {
    const adjustments: { [key: string]: number } = {
      'commercial': 0.5, // 50% surcharge for commercial events
      'wedding': 0.3, // 30% surcharge for weddings
      'meeting': 0, // No adjustment for meetings
      'sports': -0.1, // 10% discount for sports
      'culture': -0.1 // 10% discount for cultural events
    };
    return adjustments[eventType] || 0;
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  private requiresApproval(actorType: ActorType, finalPrice: number, eventType?: string): boolean {
    // Nonprofits always require approval for verification
    if (actorType === 'lag-foreninger' || actorType === 'paraply') {
      return true;
    }
    
    // High-value bookings require approval
    if (finalPrice > 5000) {
      return true;
    }
    
    // Commercial events require approval
    if (eventType === 'commercial') {
      return true;
    }
    
    return false;
  }

  applyOverride(calculation: PriceCalculation, amount: number, reason: string): PriceCalculation {
    const override: PriceBreakdownItem = {
      description: `Manuell justering: ${reason}`,
      amount: amount - calculation.finalPrice,
      type: 'override'
    };

    return {
      ...calculation,
      overrideAmount: amount,
      overrideReason: reason,
      finalPrice: amount,
      breakdown: [...calculation.breakdown, override]
    };
  }
}

export const enhancedPricingEngine = new EnhancedPricingEngine();
