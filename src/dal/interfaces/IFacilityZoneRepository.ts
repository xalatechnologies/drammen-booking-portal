import { PaginationParams, RepositoryResponse, SortingParams } from '@/types/api';
import { Zone, ZoneCapacity, ZoneFeature } from '@/types/facility';

/**
 * Specialized repository interface for facility zone management
 * Follows Single Responsibility Principle by focusing only on zone concerns
 */
export interface IFacilityZoneRepository {
  /**
   * Get all zones for a facility
   */
  getZonesByFacilityId(
    facilityId: string | number,
    pagination?: PaginationParams,
    sorting?: SortingParams
  ): Promise<RepositoryResponse<Zone[]>>;
  
  /**
   * Get a specific zone by ID
   */
  getZoneById(zoneId: string | number): Promise<RepositoryResponse<Zone | null>>;
  
  /**
   * Create a new zone for a facility
   */
  createZone(facilityId: string | number, zoneData: Omit<Zone, 'id'>): Promise<RepositoryResponse<Zone>>;
  
  /**
   * Update an existing zone
   */
  updateZone(zoneId: string | number, zoneData: Partial<Zone>): Promise<RepositoryResponse<Zone>>;
  
  /**
   * Delete a zone
   */
  deleteZone(zoneId: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Get zone features for a specific zone
   */
  getZoneFeatures(zoneId: string | number): Promise<RepositoryResponse<ZoneFeature[]>>;
  
  /**
   * Add feature to a zone
   */
  addZoneFeature(zoneId: string | number, feature: Omit<ZoneFeature, 'id'>): Promise<RepositoryResponse<ZoneFeature>>;
  
  /**
   * Remove feature from a zone
   */
  removeZoneFeature(zoneId: string | number, featureId: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Set zone capacity information
   */
  setZoneCapacity(zoneId: string | number, capacity: ZoneCapacity): Promise<RepositoryResponse<ZoneCapacity>>;
  
  /**
   * Get zone capacity information
   */
  getZoneCapacity(zoneId: string | number): Promise<RepositoryResponse<ZoneCapacity | null>>;
  
  /**
   * Check if zones are available at a specific time
   */
  checkZoneAvailability(
    facilityId: string | number, 
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<RepositoryResponse<Record<string, boolean>>>;
}
