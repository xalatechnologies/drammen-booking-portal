import { PricingRule } from '@/types/facility';

/**
 * Service interface for facility pricing operations
 * Follows Single Responsibility Principle by focusing only on pricing concerns
 * Follows Interface Segregation Principle by providing focused methods
 */
export interface IFacilityPricingService {
  /**
   * Get all pricing rules for a facility
   * @param facilityId The facility ID
   */
  getPricingRules(facilityId: string | number): Promise<PricingRule[]>;
  
  /**
   * Get a specific pricing rule by ID
   * @param ruleId The pricing rule ID
   */
  getPricingRuleById(ruleId: string | number): Promise<PricingRule | null>;
  
  /**
   * Add a new pricing rule for a facility
   * @param facilityId The facility ID
   * @param rule The pricing rule data to add
   */
  addPricingRule(facilityId: string | number, rule: Omit<PricingRule, 'id'>): Promise<PricingRule>;
  
  /**
   * Update an existing pricing rule
   * @param ruleId The pricing rule ID
   * @param rule The pricing rule data to update
   */
  updatePricingRule(ruleId: string | number, rule: Partial<PricingRule>): Promise<PricingRule>;
  
  /**
   * Delete a pricing rule
   * @param ruleId The pricing rule ID to delete
   */
  deletePricingRule(ruleId: string | number): Promise<boolean>;
  
  /**
   * Calculate price for a booking based on applied pricing rules
   * @param facilityId The facility ID
   * @param zoneId Optional zone ID if the booking is for a specific zone
   * @param startDate The booking start date and time
   * @param endDate The booking end date and time
   * @param userGroups Optional user groups for special pricing
   */
  calculatePrice(
    facilityId: string | number,
    zoneId: string | number | null,
    startDate: Date,
    endDate: Date,
    userGroups?: string[]
  ): Promise<{
    basePrice: number;
    finalPrice: number;
    appliedRules: PricingRule[];
  }>;
  
  /**
   * Set the base price for a facility
   * @param facilityId The facility ID
   * @param pricePerHour The price per hour
   */
  setBasePrice(facilityId: string | number, pricePerHour: number): Promise<boolean>;
  
  /**
   * Set zone-specific pricing
   * @param facilityId The facility ID
   * @param zoneId The zone ID
   * @param pricePerHour The price per hour for this zone
   */
  setZonePrice(facilityId: string | number, zoneId: string | number, pricePerHour: number): Promise<boolean>;
  
  /**
   * Get pricing simulation for different durations
   * @param facilityId The facility ID
   * @param zoneId Optional zone ID
   * @param date The date to simulate pricing for
   * @param userGroups Optional user groups for special pricing
   */
  getPricingSimulation(
    facilityId: string | number,
    zoneId: string | number | null,
    date: Date,
    userGroups?: string[]
  ): Promise<Array<{
    duration: number; // in hours
    basePrice: number;
    finalPrice: number;
    discount: number;
    discountPercentage: number;
  }>>;
}
