import { RepositoryResponse } from '@/types/api';
import { Zone, ZoneCapacity, ZoneFeature } from '@/types/facility';
import { PaginationParams, SortParams } from '@/types/api';
import { IBaseRepository } from './IBaseRepository';

/**
 * Specialized repository interface for zone management
 * Follows Single Responsibility Principle by focusing only on zone operations
 * Follows Interface Segregation Principle with specific zone-related methods
 */
export interface IZoneRepository extends IBaseRepository<Zone> {
  /**
   * Get all zones for a facility
   */
  getZonesByFacilityId(
    facilityId: string | number, 
    pagination?: PaginationParams, 
    sorting?: SortParams
  ): Promise<RepositoryResponse<Zone[]>>;
  
  /**
   * Get a specific zone by ID
   */
  getZoneById(zoneId: string | number): Promise<RepositoryResponse<Zone>>;
  
  /**
   * Create a new zone
   */
  createZone(zone: Omit<Zone, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<Zone>>;
  
  /**
   * Update an existing zone
   */
  updateZone(zoneId: string | number, zone: Partial<Zone>): Promise<RepositoryResponse<Zone>>;
  
  /**
   * Delete a zone
   */
  deleteZone(zoneId: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Get all features for a zone
   */
  getZoneFeatures(zoneId: string | number): Promise<RepositoryResponse<ZoneFeature[]>>;
  
  /**
   * Add a feature to a zone
   */
  addZoneFeature(
    zoneId: string | number, 
    feature: Omit<ZoneFeature, 'id' | 'created_at' | 'updated_at'>
  ): Promise<RepositoryResponse<ZoneFeature>>;
  
  /**
   * Remove a feature from a zone
   */
  removeZoneFeature(zoneId: string | number, featureId: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Get capacity information for a zone
   */
  getZoneCapacity(zoneId: string | number): Promise<RepositoryResponse<ZoneCapacity>>;
  
  /**
   * Set capacity information for a zone
   */
  setZoneCapacity(zoneId: string | number, capacity: ZoneCapacity): Promise<RepositoryResponse<ZoneCapacity>>;
  
  /**
   * Check availability of zones at a specific time
   */
  checkZoneAvailability(
    facilityId: string | number,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<RepositoryResponse<Record<string, boolean>>>;
}
