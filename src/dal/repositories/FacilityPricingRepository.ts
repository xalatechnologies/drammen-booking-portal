import { IFacilityPricingRepository } from '../interfaces/IFacilityPricingRepository';
import { RepositoryResponse } from '@/types/api';
import { PricingRule } from '@/types/facility';
import { supabaseClient } from '@/supabase/client';

/**
 * Repository for managing facility pricing rules
 * Following the Single Responsibility Principle by focusing only on pricing concerns
 */
export class FacilityPricingRepository implements IFacilityPricingRepository {
  private readonly tableName = 'facility_pricing_rules';
  
  constructor(private readonly client = supabaseClient) {}

  /**
   * Get all pricing rules for a facility
   */
  async getPricingRules(facilityId: string | number): Promise<RepositoryResponse<PricingRule[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('facility_id', facilityId)
        .order('priority', { ascending: false });

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as PricingRule[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Get a specific pricing rule by ID
   */
  async getPricingRuleById(ruleId: string | number): Promise<RepositoryResponse<PricingRule | null>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', ruleId)
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as PricingRule
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Add a new pricing rule for a facility
   */
  async addPricingRule(facilityId: string | number, rule: Omit<PricingRule, 'id'>): Promise<RepositoryResponse<PricingRule>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert({
          ...rule,
          facility_id: facilityId,
          created_at: new Date()
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as PricingRule
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Update an existing pricing rule
   */
  async updatePricingRule(ruleId: string | number, rule: Partial<PricingRule>): Promise<RepositoryResponse<PricingRule>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update({
          ...rule,
          updated_at: new Date()
        })
        .eq('id', ruleId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as PricingRule
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Delete a pricing rule
   */
  async deletePricingRule(ruleId: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', ruleId);

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Calculate price for a booking duration based on all applicable pricing rules
   */
  async calculatePrice(
    facilityId: string | number,
    zoneId: string | number | null,
    startDate: Date,
    endDate: Date,
    userGroups: string[] = []
  ): Promise<RepositoryResponse<{ basePrice: number; finalPrice: number; appliedRules: PricingRule[] }>> {
    try {
      // Get facility base price
      const { data: facility, error: facilityError } = await this.client
        .from('facilities')
        .select('price_per_hour')
        .eq('id', facilityId)
        .single();

      if (facilityError) {
        return {
          success: false,
          error: { message: facilityError.message }
        };
      }

      let basePrice = facility.price_per_hour || 0;
      
      // If a zone is specified, check for zone-specific pricing
      if (zoneId) {
        const { data: zone, error: zoneError } = await this.client
          .from('zones')
          .select('price_per_hour')
          .eq('id', zoneId)
          .single();

        if (!zoneError && zone && zone.price_per_hour) {
          basePrice = zone.price_per_hour;
        }
      }
      
      // Calculate duration in hours
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      
      // Calculate base total price
      const baseTotalPrice = basePrice * durationHours;
      
      // Get all pricing rules for this facility
      const { data: rules, error: rulesError } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('facility_id', facilityId)
        .eq('is_active', true)
        .order('priority', { ascending: false });
        
      if (rulesError) {
        return {
          success: false,
          error: { message: rulesError.message }
        };
      }

      let finalPrice = baseTotalPrice;
      const appliedRules: PricingRule[] = [];
      
      // Apply each applicable pricing rule
      for (const rule of rules) {
        // Check if rule applies based on various criteria
        let ruleApplies = true;
        
        // Check zone-specific rules
        if (rule.zone_id && rule.zone_id !== zoneId) {
          ruleApplies = false;
        }
        
        // Check day-of-week rules
        if (rule.days_of_week && rule.days_of_week.length > 0) {
          const dayOfWeek = startDate.getDay(); // 0 is Sunday, 6 is Saturday
          if (!rule.days_of_week.includes(dayOfWeek)) {
            ruleApplies = false;
          }
        }
        
        // Check time-of-day rules
        if (rule.start_time && rule.end_time) {
          const requestStartTime = startDate.getHours() * 60 + startDate.getMinutes();
          const ruleStartTime = this.timeStringToMinutes(rule.start_time);
          const ruleEndTime = this.timeStringToMinutes(rule.end_time);
          
          if (requestStartTime < ruleStartTime || requestStartTime > ruleEndTime) {
            ruleApplies = false;
          }
        }
        
        // Check date range rules
        if (rule.valid_from && new Date(rule.valid_from) > startDate) {
          ruleApplies = false;
        }
        
        if (rule.valid_to && new Date(rule.valid_to) < startDate) {
          ruleApplies = false;
        }
        
        // Check user group rules
        if (rule.user_groups && rule.user_groups.length > 0 && userGroups.length > 0) {
          // Check if any of the user's groups match the rule's groups
          const hasMatchingGroup = rule.user_groups.some(group => 
            userGroups.includes(group)
          );
          
          if (!hasMatchingGroup) {
            ruleApplies = false;
          }
        }
        
        // Apply the rule if it's applicable
        if (ruleApplies) {
          if (rule.discount_type === 'percentage') {
            const discountAmount = finalPrice * (rule.discount_value / 100);
            finalPrice -= discountAmount;
          } else if (rule.discount_type === 'fixed') {
            finalPrice -= rule.discount_value;
          } else if (rule.discount_type === 'override') {
            // Override the price per hour directly
            finalPrice = rule.discount_value * durationHours;
          }
          
          appliedRules.push(rule);
          
          // If rule is marked as exclusive, stop applying further rules
          if (rule.is_exclusive) {
            break;
          }
        }
      }
      
      // Ensure price doesn't go below minimum, if specified
      if (finalPrice < 0) {
        finalPrice = 0;
      }
      
      return {
        success: true,
        data: {
          basePrice: baseTotalPrice,
          finalPrice,
          appliedRules
        }
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Set the base price for a facility
   */
  async setBasePrice(facilityId: string | number, pricePerHour: number): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from('facilities')
        .update({ price_per_hour: pricePerHour })
        .eq('id', facilityId);

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Set zone-specific pricing
   */
  async setZonePrice(facilityId: string | number, zoneId: string | number, pricePerHour: number): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from('zones')
        .update({ price_per_hour: pricePerHour })
        .eq('id', zoneId)
        .eq('facility_id', facilityId);

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }
  
  /**
   * Helper method to convert time string (HH:MM) to minutes
   * @private
   */
  private timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

// Export singleton instance
export const facilityPricingRepository = new FacilityPricingRepository();
