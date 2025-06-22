import { Zone, ZoneCapacity, ZoneFeature } from '@/types/facility';
import { PaginationParams, SortingParams } from '@/types/api';

/**
 * Service interface for facility zone operations
 * Follows Single Responsibility Principle by focusing only on zone management
 * Follows Interface Segregation Principle by providing focused methods
 */
export interface IFacilityZoneService {
  /**
   * Get all zones for a facility
   * @param facilityId The facility ID
   * @param pagination Optional pagination parameters
   * @param sorting Optional sorting parameters
   */
  getZonesByFacilityId(
    facilityId: string | number,
    pagination?: PaginationParams,
    sorting?: SortingParams
  ): Promise<Zone[]>;
  
  /**
   * Get a specific zone by ID
   * @param zoneId The zone ID
   */
  getZoneById(zoneId: string | number): Promise<Zone | null>;
  
  /**
   * Create a new zone for a facility
   * @param facilityId The facility ID
   * @param zone The zone data to create
   */
  createZone(facilityId: string | number, zone: Omit<Zone, 'id'>): Promise<Zone>;
  
  /**
   * Update an existing zone
   * @param zoneId The zone ID
   * @param zone The zone data to update
   */
  updateZone(zoneId: string | number, zone: Partial<Zone>): Promise<Zone>;
  
  /**
   * Delete a zone
   * @param zoneId The zone ID to delete
   */
  deleteZone(zoneId: string | number): Promise<boolean>;
  
  /**
   * Get all features for a zone
   * @param zoneId The zone ID
   */
  getZoneFeatures(zoneId: string | number): Promise<ZoneFeature[]>;
  
  /**
   * Add a feature to a zone
   * @param zoneId The zone ID
   * @param feature The feature data to add
   */
  addZoneFeature(zoneId: string | number, feature: Omit<ZoneFeature, 'id'>): Promise<ZoneFeature>;
  
  /**
   * Remove a feature from a zone
   * @param zoneId The zone ID
   * @param featureId The feature ID to remove
   */
  removeZoneFeature(zoneId: string | number, featureId: string | number): Promise<boolean>;
  
  /**
   * Get capacity information for a zone
   * @param zoneId The zone ID
   */
  getZoneCapacity(zoneId: string | number): Promise<ZoneCapacity | null>;
  
  /**
   * Set capacity information for a zone
   * @param zoneId The zone ID
   * @param capacity The capacity data to set
   */
  setZoneCapacity(zoneId: string | number, capacity: ZoneCapacity): Promise<ZoneCapacity>;
  
  /**
   * Check availability of zones at a specific time
   * @param facilityId The facility ID
   * @param date The date to check
   * @param startTime The start time to check (format: "HH:MM")
   * @param endTime The end time to check (format: "HH:MM")
   */
  checkZoneAvailability(
    facilityId: string | number,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<Record<string, boolean>>;
}
