
import { ActorType, BookingType, PriceCalculation, PriceBreakdownItem, PriceAdjustment } from '@/types/pricing';
import { PricingMode, PricingRule, FixedPricingPackage, ZonePricingConfiguration } from '@/types/pricingModes';

// Mock pricing configurations for different zones
const zonePricingConfigurations: Record<string, ZonePricingConfiguration> = {
  'whole-facility': {
    zoneId: 'whole-facility',
    defaultMode: 'hourly',
    allowedModes: ['hourly', 'daily', 'fixed'],
    pricingRules: [
      {
        id: 'rule-1',
        mode: 'hourly',
        actorType: 'private-person',
        timeSlot: 'day',
        dayType: 'weekday',
        price: 200,
        isActive: true,
        description: 'Privatperson hverdag dagtid'
      },
      {
        id: 'rule-2',
        mode: 'hourly',
        actorType: 'private-person',
        timeSlot: 'evening',
        dayType: 'weekend',
        price: 350,
        isActive: true,
        description: 'Privatperson kveld/helg'
      },
      {
        id: 'rule-3',
        mode: 'daily',
        actorType: 'private-person',
        dayType: 'weekend',
        price: 1500,
        isActive: true,
        description: 'Privatperson helgedag'
      },
      {
        id: 'rule-4',
        mode: 'hourly',
        actorType: 'lag-foreninger',
        price: 0,
        isActive: true,
        description: 'Lag og foreninger gratis'
      },
      {
        id: 'rule-5',
        mode: 'daily',
        actorType: 'lag-foreninger',
        price: 500,
        isActive: true,
        description: 'Lag og foreninger dagpris'
      }
    ],
    fixedPackages: [
      {
        id: 'package-1',
        name: 'Sesongpakke Frivillig',
        description: 'Fast trening hver tirsdag kl. 18-20 fra januar til juni',
        price: 4000,
        duration: 180, // 6 months
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-06-30'),
        actorTypes: ['lag-foreninger'],
        isActive: true
      }
    ]
  },
  'zone-1': {
    zoneId: 'zone-1',
    defaultMode: 'hourly',
    allowedModes: ['hourly', 'daily'],
    pricingRules: [
      {
        id: 'zone1-rule-1',
        mode: 'hourly',
        actorType: 'private-person',
        price: 150,
        isActive: true,
        description: 'Hovedsalen timepris'
      },
      {
        id: 'zone1-rule-2',
        mode: 'daily',
        actorType: 'private-person',
        price: 1200,
        isActive: true,
        description: 'Hovedsalen dagpris'
      }
    ],
    fixedPackages: []
  }
};

function getTimeSlotCategory(timeSlot: string): 'morning' | 'day' | 'evening' | 'night' {
  if (!timeSlot) return 'day';
  
  const hour = parseInt(timeSlot.split(':')[0]);
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 23) return 'evening';
  return 'night';
}

function getDayType(date: Date): 'weekday' | 'weekend' | 'holiday' {
  const day = date.getDay();
  if (day === 0 || day === 6) return 'weekend';
  
  // Simple holiday check - in real app would use comprehensive holiday calendar
  const month = date.getMonth();
  const dateNum = date.getDate();
  if ((month === 11 && (dateNum === 25 || dateNum === 26)) || // Christmas
      (month === 0 && dateNum === 1) || // New Year
      (month === 4 && dateNum === 1) || // Labor Day
      (month === 4 && dateNum === 17)) { // Constitution Day
    return 'holiday';
  }
  
  return 'weekday';
}

function findBestPricingRule(
  config: ZonePricingConfiguration,
  mode: PricingMode,
  actorType: ActorType,
  timeSlot?: string,
  date?: Date
): PricingRule | null {
  const timeSlotCategory = timeSlot ? getTimeSlotCategory(timeSlot) : undefined;
  const dayType = date ? getDayType(date) : undefined;

  // Find rules that match the criteria, prioritizing more specific matches
  const matchingRules = config.pricingRules.filter(rule => 
    rule.mode === mode && 
    rule.actorType === actorType && 
    rule.isActive &&
    (!rule.timeSlot || rule.timeSlot === timeSlotCategory) &&
    (!rule.dayType || rule.dayType === dayType)
  );

  if (matchingRules.length === 0) return null;

  // Sort by specificity (more specific rules first)
  return matchingRules.sort((a, b) => {
    const aSpecificity = (a.timeSlot ? 1 : 0) + (a.dayType ? 1 : 0);
    const bSpecificity = (b.timeSlot ? 1 : 0) + (b.dayType ? 1 : 0);
    return bSpecificity - aSpecificity;
  })[0];
}

export const enhancedPricingEngine = {
  calculatePrice(
    facilityId: string,
    zoneId: string,
    startDate: Date,
    endDate: Date,
    actorType: ActorType,
    timeSlot: string,
    pricingMode: PricingMode = 'hourly',
    bookingType: BookingType = 'engangs',
    eventType?: string,
    attendees: number = 1
  ): PriceCalculation {
    console.log('🔍 enhancedPricingEngine.calculatePrice called with:', {
      facilityId,
      zoneId,
      startDate,
      endDate,
      actorType,
      timeSlot,
      pricingMode,
      bookingType
    });

    const config = zonePricingConfigurations[zoneId];
    if (!config) {
      console.warn('❌ No pricing configuration found for zone:', zoneId);
      return this.getFallbackCalculation();
    }

    const rule = findBestPricingRule(config, pricingMode, actorType, timeSlot, startDate);
    if (!rule) {
      console.warn('❌ No pricing rule found for:', { pricingMode, actorType, timeSlot });
      return this.getFallbackCalculation();
    }

    console.log('✅ Found pricing rule:', rule);

    const hours = this.calculateHours(timeSlot);
    const days = this.getDaysBetween(startDate, endDate);
    
    let basePrice: number;
    let totalPrice: number;
    let breakdown: PriceBreakdownItem[] = [];

    switch (pricingMode) {
      case 'hourly':
        basePrice = rule.price;
        totalPrice = basePrice * hours * days;
        breakdown.push({
          description: `${rule.description || 'Timepris'} - ${hours}t x ${days} dag(er)`,
          amount: totalPrice,
          type: 'base'
        });
        break;

      case 'daily':
        basePrice = rule.price;
        totalPrice = basePrice * days;
        breakdown.push({
          description: `${rule.description || 'Dagpris'} - ${days} dag(er)`,
          amount: totalPrice,
          type: 'base'
        });
        break;

      case 'fixed':
        const fixedPackage = config.fixedPackages.find(p => 
          p.actorTypes.includes(actorType) && p.isActive
        );
        basePrice = fixedPackage?.price || rule.price;
        totalPrice = basePrice;
        breakdown.push({
          description: fixedPackage?.name || 'Fastpris',
          amount: totalPrice,
          type: 'base'
        });
        break;

      default:
        basePrice = rule.price;
        totalPrice = basePrice * hours * days;
        breakdown.push({
          description: 'Standard pris',
          amount: totalPrice,
          type: 'base'
        });
    }

    // Apply any additional adjustments based on booking type
    const discounts: PriceAdjustment[] = [];
    const surcharges: PriceAdjustment[] = [];

    if (bookingType === 'fastlan' && pricingMode !== 'fixed') {
      const discount = totalPrice * 0.1; // 10% discount for recurring bookings
      totalPrice -= discount;
      discounts.push({
        type: 'discount',
        name: 'Fastlån rabatt',
        amount: discount,
        reason: '10% rabatt for fastlån'
      });
      breakdown.push({
        description: 'Fastlån rabatt (10%)',
        amount: -discount,
        type: 'discount'
      });
    }

    return {
      basePrice,
      totalHours: hours,
      totalDays: days,
      actorTypeDiscount: 0,
      timeSlotMultiplier: 1,
      bookingTypeDiscount: bookingType === 'fastlan' ? 10 : 0,
      weekendSurcharge: 0,
      subtotal: totalPrice + discounts.reduce((sum, d) => sum + d.amount, 0),
      finalPrice: totalPrice,
      requiresApproval: ['lag-foreninger', 'paraply'].includes(actorType),
      breakdown,
      discounts,
      surcharges,
      totalPrice,
      currency: 'NOK'
    };
  },

  getFallbackCalculation(): PriceCalculation {
    return {
      basePrice: 450,
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
        description: 'Fallback pris',
        amount: 900,
        type: 'base'
      }],
      discounts: [],
      surcharges: [],
      totalPrice: 900,
      currency: 'NOK'
    };
  },

  calculateHours(timeSlot: string): number {
    if (!timeSlot || !timeSlot.includes('-')) return 2;
    
    const [start, end] = timeSlot.split('-').map(t => t.trim());
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    
    return Math.max(1, endHour - startHour);
  },

  getDaysBetween(startDate: Date, endDate: Date): number {
    if (!endDate || endDate <= startDate) return 1;
    
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  },

  getAvailablePricingModes(zoneId: string): PricingMode[] {
    const config = zonePricingConfigurations[zoneId];
    return config?.allowedModes || ['hourly'];
  },

  getZonePricingConfiguration(zoneId: string): ZonePricingConfiguration | null {
    return zonePricingConfigurations[zoneId] || null;
  }
};
