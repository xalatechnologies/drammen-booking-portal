import { RepositoryResponse } from '@/types/api';
import { PricingRule } from '@/types/facility';

/**
 * Specialized repository interface for facility pricing management
 * Following Single Responsibility Principle by focusing only on pricing concerns
 */
export interface IFacilityPricingRepository {
  /**
   * Get all pricing rules for a facility
   */
  getPricingRules(facilityId: string | number): Promise<RepositoryResponse<PricingRule[]>>;
  
  /**
   * Get a specific pricing rule by ID
   */
  getPricingRuleById(ruleId: string | number): Promise<RepositoryResponse<PricingRule | null>>;
  
  /**
   * Add a new pricing rule for a facility
   */
  addPricingRule(facilityId: string | number, rule: Omit<PricingRule, 'id'>): Promise<RepositoryResponse<PricingRule>>;
  
  /**
   * Update an existing pricing rule
   */
  updatePricingRule(ruleId: string | number, rule: Partial<PricingRule>): Promise<RepositoryResponse<PricingRule>>;
  
  /**
   * Delete a pricing rule
   */
  deletePricingRule(ruleId: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Calculate price for a booking duration based on all applicable pricing rules
   */
  calculatePrice(
    facilityId: string | number,
    zoneId: string | number | null,
    startDate: Date,
    endDate: Date,
    userGroups?: string[]
  ): Promise<RepositoryResponse<{ basePrice: number; finalPrice: number; appliedRules: PricingRule[] }>>;
  
  /**
   * Set the base price for a facility
   */
  setBasePrice(facilityId: string | number, pricePerHour: number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Set zone-specific pricing
   */
  setZonePrice(facilityId: string | number, zoneId: string | number, pricePerHour: number): Promise<RepositoryResponse<boolean>>;
}
