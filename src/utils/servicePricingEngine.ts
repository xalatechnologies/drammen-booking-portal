
import { AdditionalService, ServicePricing } from '@/types/additionalServices';
import { ActorType } from '@/types/pricing';
import { ApiResponse } from '@/types/api';

export interface ServicePriceCalculation {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  basePrice: number;
  actorTypeMultiplier: number;
  discounts: ServiceDiscount[];
  surcharges: ServiceSurcharge[];
  totalPrice: number;
  breakdown: ServicePriceBreakdownItem[];
}

export interface ServiceDiscount {
  type: 'actor-type' | 'volume' | 'seasonal';
  description: string;
  amount: number;
  percentage: number;
}

export interface ServiceSurcharge {
  type: 'time-based' | 'capacity' | 'rush';
  description: string;
  amount: number;
  percentage: number;
}

export interface ServicePriceBreakdownItem {
  description: string;
  amount: number;
  type: 'base' | 'discount' | 'surcharge' | 'total';
}

export class ServicePricingEngine {
  static calculateServicePrice(
    service: AdditionalService,
    quantity: number,
    actorType: ActorType,
    attendees?: number,
    timeSlot?: string,
    date?: Date
  ): ApiResponse<ServicePriceCalculation> {
    try {
      const pricing = service.pricing;
      let unitPrice = pricing.basePrice;
      const breakdown: ServicePriceBreakdownItem[] = [];
      const discounts: ServiceDiscount[] = [];
      const surcharges: ServiceSurcharge[] = [];

      // Base price
      breakdown.push({
        description: `${service.name} (${quantity}x)`,
        amount: unitPrice * quantity,
        type: 'base'
      });

      // Actor type multiplier
      const actorMultiplier = pricing.actorTypeMultipliers[actorType] || 1.0;
      if (actorMultiplier !== 1.0) {
        const discountPercentage = (1 - actorMultiplier) * 100;
        const discountAmount = unitPrice * quantity * (1 - actorMultiplier);
        
        if (actorMultiplier < 1.0) {
          discounts.push({
            type: 'actor-type',
            description: `${Math.round(discountPercentage)}% rabatt for ${actorType}`,
            amount: discountAmount,
            percentage: discountPercentage
          });
          
          breakdown.push({
            description: `Aktørtype rabatt (${Math.round(discountPercentage)}%)`,
            amount: -discountAmount,
            type: 'discount'
          });
        } else {
          const surchargePercentage = (actorMultiplier - 1) * 100;
          const surchargeAmount = unitPrice * quantity * (actorMultiplier - 1);
          
          surcharges.push({
            type: 'capacity',
            description: `${Math.round(surchargePercentage)}% tillegg for ${actorType}`,
            amount: surchargeAmount,
            percentage: surchargePercentage
          });
          
          breakdown.push({
            description: `Aktørtype tillegg (${Math.round(surchargePercentage)}%)`,
            amount: surchargeAmount,
            type: 'surcharge'
          });
        }
      }

      // Volume discounts
      if (pricing.volumeDiscounts && pricing.volumeDiscounts.length > 0) {
        const applicableDiscount = pricing.volumeDiscounts
          .filter(d => quantity >= d.minimumQuantity)
          .sort((a, b) => b.minimumQuantity - a.minimumQuantity)[0];
        
        if (applicableDiscount) {
          const discountAmount = unitPrice * quantity * actorMultiplier * (applicableDiscount.discountPercentage / 100);
          
          discounts.push({
            type: 'volume',
            description: `Volum rabatt (${applicableDiscount.discountPercentage}%)`,
            amount: discountAmount,
            percentage: applicableDiscount.discountPercentage
          });
          
          breakdown.push({
            description: `Volum rabatt (${applicableDiscount.discountPercentage}%)`,
            amount: -discountAmount,
            type: 'discount'
          });
        }
      }

      // Time-based pricing
      if (pricing.timeBasedPricing && timeSlot) {
        const timeCategory = this.getTimeSlotCategory(timeSlot);
        const timePricing = pricing.timeBasedPricing.find(p => p.timeSlot === timeCategory);
        
        if (timePricing && timePricing.multiplier !== 1.0) {
          const multiplierAmount = unitPrice * quantity * (timePricing.multiplier - 1);
          
          if (timePricing.multiplier > 1.0) {
            surcharges.push({
              type: 'time-based',
              description: `Tidstillegg (${Math.round((timePricing.multiplier - 1) * 100)}%)`,
              amount: multiplierAmount,
              percentage: (timePricing.multiplier - 1) * 100
            });
            
            breakdown.push({
              description: `Tidstillegg (${Math.round((timePricing.multiplier - 1) * 100)}%)`,
              amount: multiplierAmount,
              type: 'surcharge'
            });
          }
        }
      }

      // Seasonal pricing
      if (pricing.seasonalPricing && date) {
        const seasonalPrice = pricing.seasonalPricing.find(p => 
          date >= p.startDate && date <= p.endDate
        );
        
        if (seasonalPrice && seasonalPrice.multiplier !== 1.0) {
          const seasonalAmount = unitPrice * quantity * (seasonalPrice.multiplier - 1);
          
          if (seasonalPrice.multiplier > 1.0) {
            surcharges.push({
              type: 'seasonal',
              description: seasonalPrice.description,
              amount: seasonalAmount,
              percentage: (seasonalPrice.multiplier - 1) * 100
            });
            
            breakdown.push({
              description: seasonalPrice.description,
              amount: seasonalAmount,
              type: 'surcharge'
            });
          }
        }
      }

      // Calculate final price
      const baseAmount = unitPrice * quantity;
      const discountAmount = discounts.reduce((sum, d) => sum + d.amount, 0);
      const surchargeAmount = surcharges.reduce((sum, s) => sum + s.amount, 0);
      const totalPrice = Math.max(0, baseAmount * actorMultiplier - discountAmount + surchargeAmount);

      // Apply minimum/maximum charges
      let finalPrice = totalPrice;
      if (pricing.minimumCharge && finalPrice < pricing.minimumCharge) {
        finalPrice = pricing.minimumCharge;
        breakdown.push({
          description: 'Minimum kostnad',
          amount: pricing.minimumCharge - totalPrice,
          type: 'surcharge'
        });
      }
      
      if (pricing.maximumCharge && finalPrice > pricing.maximumCharge) {
        finalPrice = pricing.maximumCharge;
        breakdown.push({
          description: 'Maksimum kostnad',
          amount: pricing.maximumCharge - totalPrice,
          type: 'discount'
        });
      }

      // Add total line
      breakdown.push({
        description: 'Total',
        amount: finalPrice,
        type: 'total'
      });

      return {
        success: true,
        data: {
          serviceId: service.id,
          serviceName: service.name,
          quantity,
          unitPrice: unitPrice * actorMultiplier,
          basePrice: unitPrice,
          actorTypeMultiplier: actorMultiplier,
          discounts,
          surcharges,
          totalPrice: finalPrice,
          breakdown
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to calculate service price',
          details: error
        }
      };
    }
  }

  private static getTimeSlotCategory(timeSlot: string): 'morning' | 'day' | 'evening' | 'night' {
    const startTime = timeSlot.split(' - ')[0];
    const hour = parseInt(startTime.split(':')[0]);
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'day';
    if (hour >= 17 && hour < 23) return 'evening';
    return 'night';
  }
}
