import { ActorType, BookingType, PriceCalculation, PriceBreakdownItem } from '@/types/pricing';

interface ZonePricing {
  id: string;
  name: string;
  pricePerHour: number;
  capacity: number;
}

interface FacilityPricing {
  id: string;
  name: string;
  zones: ZonePricing[];
}

// Mock pricing data
const facilitiesPricing: FacilityPricing[] = [
  {
    id: "1",
    name: "Drammen Kulturhus",
    zones: [
      { id: "whole-facility", name: "Hele lokalet", pricePerHour: 800, capacity: 200 },
      { id: "zone-1", name: "Hovedsalen", pricePerHour: 500, capacity: 120 },
      { id: "zone-2", name: "Øvingsrom 1", pricePerHour: 200, capacity: 30 },
      { id: "zone-3", name: "Øvingsrom 2", pricePerHour: 200, capacity: 30 }
    ]
  }
];

// Pricing multipliers for different actor types
const actorTypeMultipliers: Record<ActorType, number> = {
  'lag-foreninger': 0.5,      // 50% discount for clubs and associations
  'paraply': 0.3,             // 70% discount for umbrella organizations
  'private-firma': 1.2,       // 20% surcharge for private companies
  'kommunale-enheter': 0.7,   // 30% discount for municipal units
  'private-person': 1.0       // Standard price for private persons
};

// Booking type multipliers
const bookingTypeMultipliers: Record<BookingType, number> = {
  'fastlan': 0.9,   // 10% discount for recurring bookings
  'engangs': 1.0,   // Standard price for one-time bookings
  'strotimer': 1.0  // Standard price for drop-in bookings
};

// Time-based multipliers
const timeMultipliers = {
  morning: 1.0,    // 08:00-12:00
  afternoon: 1.0,  // 12:00-17:00
  evening: 1.3,    // 17:00-22:00
  night: 1.5       // 22:00-08:00
};

const weekendMultiplier = 1.2; // 20% surcharge for weekends

function getTimeMultiplier(timeSlot: string): number {
  if (!timeSlot) return 1.0;
  
  const timeStr = timeSlot.split('-')[0] || timeSlot.split(' ')[0];
  const hour = parseInt(timeStr.split(':')[0]);
  
  if (hour >= 8 && hour < 12) return timeMultipliers.morning;
  if (hour >= 12 && hour < 17) return timeMultipliers.afternoon;
  if (hour >= 17 && hour < 22) return timeMultipliers.evening;
  return timeMultipliers.night;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

function calculateHours(timeSlot: string): number {
  if (!timeSlot || !timeSlot.includes('-')) return 2; // Default 2 hours
  
  const [start, end] = timeSlot.split('-').map(t => t.trim());
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  
  return Math.max(1, endHour - startHour);
}

function getDaysBetween(startDate: Date, endDate: Date): number {
  if (!endDate || endDate <= startDate) return 1;
  
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
}

function requiresApproval(actorType: ActorType, eventType?: string): boolean {
  // Lag og foreninger and paraply organizations require approval
  if (actorType === 'lag-foreninger' || actorType === 'paraply') {
    return true;
  }
  
  // Large events or competitions require approval
  if (eventType === 'competition' || eventType === 'celebration') {
    return true;
  }
  
  return false;
}

export const pricingEngine = {
  calculatePrice(
    facilityId: string,
    zoneId: string,
    startDate: Date,
    endDate: Date,
    actorType: ActorType,
    timeSlot: string,
    bookingType: BookingType = 'engangs',
    eventType?: string,
    ageGroup?: string,
    attendees: number = 1
  ): PriceCalculation {
    console.log('🔍 pricingEngine.calculatePrice called with:', {
      facilityId,
      zoneId,
      startDate,
      endDate,
      actorType,
      timeSlot,
      bookingType,
      attendees
    });

    console.log('🏢 Available facilities:', facilitiesPricing.map(f => ({ id: f.id, name: f.name })));

    const facility = facilitiesPricing.find(f => f.id === facilityId);
    if (!facility) {
      console.warn('❌ Facility not found for ID:', facilityId);
      console.log('🔍 Available facility IDs:', facilitiesPricing.map(f => f.id));
      return {
        basePrice: 450, // Default fallback price
        totalHours: 2,
        totalDays: 1,
        actorTypeDiscount: 0,
        timeSlotMultiplier: 1,
        bookingTypeDiscount: 0,
        weekendSurcharge: 0,
        subtotal: 900,
        finalPrice: 900,
        requiresApproval: false,
        breakdown: [{
          description: 'Fallback pris (anlegg ikke funnet)',
          amount: 900,
          type: 'base'
        }],
        discounts: [],
        surcharges: [],
        totalPrice: 900,
        currency: 'NOK'
      };
    }

    console.log('✅ Facility found:', facility.name);
    console.log('🏗️ Available zones:', facility.zones.map(z => ({ id: z.id, name: z.name, price: z.pricePerHour })));

    const zone = facility.zones.find(z => z.id === zoneId);
    if (!zone) {
      console.warn('❌ Zone not found for ID:', zoneId);
      console.log('🔍 Available zone IDs:', facility.zones.map(z => z.id));
      return {
        basePrice: 450, // Default fallback price
        totalHours: 2,
        totalDays: 1,
        actorTypeDiscount: 0,
        timeSlotMultiplier: 1,
        bookingTypeDiscount: 0,
        weekendSurcharge: 0,
        subtotal: 900,
        finalPrice: 900,
        requiresApproval: false,
        breakdown: [{
          description: 'Fallback pris (sone ikke funnet)',
          amount: 900,
          type: 'base'
        }],
        discounts: [],
        surcharges: [],
        totalPrice: 900,
        currency: 'NOK'
      };
    }

    console.log('✅ Zone found:', zone.name, 'Price per hour:', zone.pricePerHour);

    const hours = calculateHours(timeSlot);
    const days = getDaysBetween(startDate, endDate);
    const basePrice = zone.pricePerHour;
    
    console.log('📊 Calculation details:', { hours, days, basePrice });
    
    // Calculate multipliers
    const actorMultiplier = actorTypeMultipliers[actorType] || 1.0;
    const bookingMultiplier = bookingTypeMultipliers[bookingType] || 1.0;
    const timeMultiplier = getTimeMultiplier(timeSlot);
    const weekendMulti = isWeekend(startDate) ? weekendMultiplier : 1.0;
    
    console.log('🔢 Multipliers:', { actorMultiplier, bookingMultiplier, timeMultiplier, weekendMulti });
    
    // Calculate pricing
    const subtotal = basePrice * hours * days;
    const afterActorType = subtotal * actorMultiplier;
    const afterBookingType = afterActorType * bookingMultiplier;
    const afterTimeSlot = afterBookingType * timeMultiplier;
    const finalPrice = Math.round(afterTimeSlot * weekendMulti);

    console.log('💰 Price calculation steps:', {
      subtotal,
      afterActorType,
      afterBookingType,
      afterTimeSlot,
      finalPrice
    });

    // Create breakdown
    const breakdown: PriceBreakdownItem[] = [
      {
        description: `${zone.name} - ${hours}t x ${days} dag(er)`,
        amount: subtotal,
        type: 'base'
      }
    ];

    const discounts = [];
    const surcharges = [];

    if (actorMultiplier !== 1.0) {
      const discount = subtotal - afterActorType;
      breakdown.push({
        description: `${actorType} rabatt`,
        amount: -discount,
        type: 'discount'
      });
      discounts.push({
        type: 'discount' as const,
        name: `${actorType} rabatt`,
        amount: discount,
        reason: 'Actor type discount'
      });
    }

    if (bookingMultiplier !== 1.0) {
      const discount = afterActorType - afterBookingType;
      breakdown.push({
        description: `${bookingType} rabatt`,
        amount: -discount,
        type: 'discount'
      });
      discounts.push({
        type: 'discount' as const,
        name: `${bookingType} rabatt`,
        amount: discount,
        reason: 'Booking type discount'
      });
    }

    if (timeMultiplier !== 1.0) {
      const surcharge = afterTimeSlot - afterBookingType;
      breakdown.push({
        description: 'Kveldstillegg',
        amount: surcharge,
        type: 'surcharge'
      });
      surcharges.push({
        type: 'surcharge' as const,
        name: 'Kveldstillegg',
        amount: surcharge,
        reason: 'Evening time surcharge'
      });
    }

    if (weekendMulti !== 1.0) {
      const surcharge = finalPrice - afterTimeSlot;
      breakdown.push({
        description: 'Helgetillegg',
        amount: surcharge,
        type: 'surcharge'
      });
      surcharges.push({
        type: 'surcharge' as const,
        name: 'Helgetillegg',
        amount: surcharge,
        reason: 'Weekend surcharge'
      });
    }

    return {
      basePrice,
      totalHours: hours,
      totalDays: days,
      actorTypeDiscount: actorMultiplier !== 1.0 ? (1 - actorMultiplier) * 100 : 0,
      timeSlotMultiplier: timeMultiplier,
      bookingTypeDiscount: bookingMultiplier !== 1.0 ? (1 - bookingMultiplier) * 100 : 0,
      weekendSurcharge: weekendMulti !== 1.0 ? (weekendMulti - 1) * 100 : 0,
      subtotal,
      finalPrice,
      requiresApproval: requiresApproval(actorType, eventType),
      breakdown,
      discounts,
      surcharges,
      totalPrice: finalPrice,
      currency: 'NOK'
    };
  },

  applyOverride(calculation: PriceCalculation, amount: number, reason: string): PriceCalculation {
    const override: PriceBreakdownItem = {
      description: `Manual justering: ${reason}`,
      amount: amount - calculation.finalPrice,
      type: 'override'
    };

    return {
      ...calculation,
      finalPrice: amount,
      totalPrice: amount,
      overrideAmount: amount,
      overrideReason: reason,
      breakdown: [...calculation.breakdown, override]
    };
  }
};
