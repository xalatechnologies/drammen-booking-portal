import { IFacilityZoneService } from '@/services/interfaces/facility/IFacilityZoneService';
import { Zone, ZoneCapacity, ZoneFeature } from '@/types/facility';
import { PaginationParams, SortParams } from '@/types/api';
import { IZoneRepository } from '@/dal/interfaces/IZoneRepository';

/**
 * Implementation of the Facility Zone Service
 * Follows Single Responsibility Principle by focusing only on zone operations
 * Follows Dependency Inversion by depending on abstractions (interfaces) rather than concrete implementations
 * Follows Interface Segregation by implementing only the zone-specific interface
 */
export class FacilityZoneService implements IFacilityZoneService {
  /**
   * Repository instance injected via constructor (Dependency Injection)
   */
  private zoneRepository: IZoneRepository;

  /**
   * Constructor for FacilityZoneService
   * @param zoneRepository The repository implementation to use
   */
  constructor(zoneRepository: IZoneRepository) {
    this.zoneRepository = zoneRepository;
  }

  /**
   * Get all zones for a facility
   * @param facilityId The facility ID
   * @param pagination Optional pagination parameters
   * @param sorting Optional sorting parameters
   */
  async getZonesByFacilityId(
    facilityId: string | number,
    pagination?: PaginationParams,
    sorting?: SortParams
  ): Promise<Zone[]> {
    const response = await this.zoneRepository.getZonesByFacilityId(facilityId, pagination, sorting);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch facility zones');
    }
    
    return response.data || [];
  }

  /**
   * Get a specific zone by ID
   * @param zoneId The zone ID
   */
  async getZoneById(zoneId: string | number): Promise<Zone | null> {
    const response = await this.zoneRepository.getZoneById(zoneId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch zone');
    }
    
    return response.data || null;
  }

  /**
   * Create a new zone for a facility
   * @param facilityId The facility ID
   * @param zone The zone data to create
   */
  async createZone(facilityId: string | number, zone: Omit<Zone, 'id'>): Promise<Zone> {
    // Ensure facilityId is set in zone data
    const zoneData = { 
      ...zone,
      facilityId: String(facilityId)
    };
    
    const response = await this.zoneRepository.createZone(zoneData);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to create zone');
    }
    
    if (!response.data) {
      throw new Error('Failed to create zone: No data returned');
    }
    
    return response.data;
  }

  /**
   * Update an existing zone
   * @param zoneId The zone ID
   * @param zone The zone data to update
   */
  async updateZone(zoneId: string | number, zone: Partial<Zone>): Promise<Zone> {
    const response = await this.zoneRepository.updateZone(zoneId, zone);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to update zone');
    }
    
    if (!response.data) {
      throw new Error('Failed to update zone: No data returned');
    }
    
    return response.data;
  }

  /**
   * Delete a zone
   * @param zoneId The zone ID to delete
   */
  async deleteZone(zoneId: string | number): Promise<boolean> {
    const response = await this.zoneRepository.deleteZone(zoneId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to delete zone');
    }
    
    return response.data || false;
  }

  /**
   * Get all features for a zone
   * @param zoneId The zone ID
   */
  async getZoneFeatures(zoneId: string | number): Promise<ZoneFeature[]> {
    const response = await this.zoneRepository.getZoneFeatures(zoneId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch zone features');
    }
    
    return response.data || [];
  }

  /**
   * Add a feature to a zone
   * @param zoneId The zone ID
   * @param feature The feature data to add
   */
  async addZoneFeature(zoneId: string | number, feature: Omit<ZoneFeature, 'id'>): Promise<ZoneFeature> {
    // Ensure zoneId is set in feature data
    const featureData = { 
      ...feature,
      zoneId: String(zoneId)
    };
    
    const response = await this.zoneRepository.addZoneFeature(zoneId, featureData);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to add zone feature');
    }
    
    if (!response.data) {
      throw new Error('Failed to add zone feature: No data returned');
    }
    
    return response.data;
  }

  /**
   * Remove a feature from a zone
   * @param zoneId The zone ID
   * @param featureId The feature ID to remove
   */
  async removeZoneFeature(zoneId: string | number, featureId: string | number): Promise<boolean> {
    const response = await this.zoneRepository.removeZoneFeature(zoneId, featureId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to remove zone feature');
    }
    
    return response.data || false;
  }

  /**
   * Get capacity information for a zone
   * @param zoneId The zone ID
   */
  async getZoneCapacity(zoneId: string | number): Promise<ZoneCapacity | null> {
    const response = await this.zoneRepository.getZoneCapacity(zoneId);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to fetch zone capacity');
    }
    
    return response.data || null;
  }

  /**
   * Set capacity information for a zone
   * @param zoneId The zone ID
   * @param capacity The capacity data to set
   */
  async setZoneCapacity(zoneId: string | number, capacity: ZoneCapacity): Promise<ZoneCapacity> {
    const response = await this.zoneRepository.setZoneCapacity(zoneId, capacity);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to set zone capacity');
    }
    
    if (!response.data) {
      throw new Error('Failed to set zone capacity: No data returned');
    }
    
    return response.data;
  }

  /**
   * Check availability of zones at a specific time
   * @param facilityId The facility ID
   * @param date The date to check
   * @param startTime The start time to check (format: "HH:MM")
   * @param endTime The end time to check (format: "HH:MM")
   */
  async checkZoneAvailability(
    facilityId: string | number,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<Record<string, boolean>> {
    const response = await this.zoneRepository.checkZoneAvailability(facilityId, date, startTime, endTime);
    
    if (response.error) {
      throw new Error(response.error || 'Failed to check zone availability');
    }
    
    return response.data || {};
  }
}
