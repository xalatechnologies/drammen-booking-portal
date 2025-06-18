
import { PriceCalculation, ActorType, BookingType, PriceBreakdownItem } from '@/types/pricing';
import { AdditionalService } from '@/types/additionalServices';
import { pricingEngine } from './pricingEngine';

interface ServicePriceCalculation {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  actorDiscount: number;
}

interface EnhancedPriceCalculation extends PriceCalculation {
  serviceCalculations: ServicePriceCalculation[];
  totalServicesCost: number;
  grandTotal: number;
}

export class EnhancedPricingEngine {
  static calculateWithServices(
    facilityId: string,
    zoneId: string,
    startDate: Date,
    endDate: Date,
    actorType: ActorType,
    timeSlot: string,
    bookingType: BookingType,
    eventType?: string,
    ageGroup?: string,
    services: AdditionalService[] = [],
    serviceQuantities: Record<string, number> = {},
    attendees?: number
  ): EnhancedPriceCalculation {
    
    // Calculate base facility pricing
    const basePricing = pricingEngine.calculatePrice(
      facilityId,
      zoneId,
      startDate,
      endDate,
      actorType,
      timeSlot,
      bookingType,
      eventType,
      ageGroup
    );

    // Calculate service pricing
    const serviceCalculations: ServicePriceCalculation[] = [];
    let totalServicesCost = 0;

    for (const service of services) {
      const quantity = serviceQuantities[service.id] || 0;
      if (quantity <= 0) continue;

      const actorMultiplier = service.pricing.actorTypeMultipliers[actorType] || 1.0;
      const actorDiscount = actorMultiplier < 1.0 ? Math.round((1 - actorMultiplier) * 100) : 0;
      
      let unitPrice = service.pricing.basePrice;
      let totalPrice = 0;

      // Apply pricing type calculations
      switch (service.pricing.pricingType) {
        case 'per-person':
          if (attendees) {
            totalPrice = unitPrice * attendees * quantity * actorMultiplier;
          } else {
            totalPrice = unitPrice * quantity * actorMultiplier;
          }
          break;
        case 'per-item':
          totalPrice = unitPrice * quantity * actorMultiplier;
          break;
        case 'hourly':
          // Calculate hours from facility booking duration
          const hours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
          totalPrice = unitPrice * hours * quantity * actorMultiplier;
          break;
        case 'daily':
          // Calculate days from facility booking duration  
          const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          totalPrice = unitPrice * days * quantity * actorMultiplier;
          break;
        case 'flat':
        default:
          totalPrice = unitPrice * quantity * actorMultiplier;
          break;
      }

      // Apply minimum charge if specified
      if (service.pricing.minimumCharge && totalPrice < service.pricing.minimumCharge) {
        totalPrice = service.pricing.minimumCharge;
      }

      // Apply maximum charge if specified
      if (service.pricing.maximumCharge && totalPrice > service.pricing.maximumCharge) {
        totalPrice = service.pricing.maximumCharge;
      }

      const serviceCalculation: ServicePriceCalculation = {
        serviceId: service.id,
        serviceName: service.name,
        quantity,
        unitPrice: unitPrice * actorMultiplier,
        totalPrice: Math.round(totalPrice),
        actorDiscount
      };

      serviceCalculations.push(serviceCalculation);
      totalServicesCost += serviceCalculation.totalPrice;
    }

    // Create enhanced breakdown
    const enhancedBreakdown: PriceBreakdownItem[] = [
      ...basePricing.breakdown,
      ...serviceCalculations.map(calc => ({
        description: `${calc.serviceName} (${calc.quantity}x)`,
        amount: calc.totalPrice,
        type: 'base' as const
      }))
    ];

    const grandTotal = basePricing.finalPrice + totalServicesCost;

    return {
      ...basePricing,
      serviceCalculations,
      totalServicesCost,
      grandTotal,
      breakdown: enhancedBreakdown
    };
  }

  static calculateServicePrice(
    service: AdditionalService,
    quantity: number,
    actorType: ActorType,
    attendees?: number,
    duration?: { hours?: number; days?: number }
  ): ServicePriceCalculation {
    
    const actorMultiplier = service.pricing.actorTypeMultipliers[actorType] || 1.0;
    const actorDiscount = actorMultiplier < 1.0 ? Math.round((1 - actorMultiplier) * 100) : 0;
    
    let unitPrice = service.pricing.basePrice;
    let totalPrice = 0;

    // Apply pricing type calculations
    switch (service.pricing.pricingType) {
      case 'per-person':
        if (attendees) {
          totalPrice = unitPrice * attendees * quantity * actorMultiplier;
        } else {
          totalPrice = unitPrice * quantity * actorMultiplier;
        }
        break;
      case 'per-item':
        totalPrice = unitPrice * quantity * actorMultiplier;
        break;
      case 'hourly':
        const hours = duration?.hours || 2; // Default 2 hours
        totalPrice = unitPrice * hours * quantity * actorMultiplier;
        break;
      case 'daily':
        const days = duration?.days || 1; // Default 1 day
        totalPrice = unitPrice * days * quantity * actorMultiplier;
        break;
      case 'flat':
      default:
        totalPrice = unitPrice * quantity * actorMultiplier;
        break;
    }

    // Apply minimum charge if specified
    if (service.pricing.minimumCharge && totalPrice < service.pricing.minimumCharge) {
      totalPrice = service.pricing.minimumCharge;
    }

    // Apply maximum charge if specified
    if (service.pricing.maximumCharge && totalPrice > service.pricing.maximumCharge) {
      totalPrice = service.pricing.maximumCharge;
    }

    return {
      serviceId: service.id,
      serviceName: service.name,
      quantity,
      unitPrice: unitPrice * actorMultiplier,
      totalPrice: Math.round(totalPrice),
      actorDiscount
    };
  }
}

export const enhancedPricingEngine = EnhancedPricingEngine;
