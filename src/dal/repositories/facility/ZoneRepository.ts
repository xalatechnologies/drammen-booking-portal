import { IZoneRepository } from '@/dal/interfaces/facility/IZoneRepository';
import { RepositoryResponse } from '@/types/api';
import { Zone, ZoneCapacity, ZoneFeature } from '@/types/facility';
import { PaginationParams, SortParams } from '@/types/api';
import { supabaseClient } from '@/supabase/client';

/**
 * Repository implementation for zone operations
 * Following the Single Responsibility Principle by focusing only on zone operations
 * Follows Liskov Substitution Principle by properly implementing the IZoneRepository interface
 */
export class ZoneRepository implements IZoneRepository {
  private readonly tableName = 'facility_zones';
  private readonly featureTableName = 'zone_features';
  private readonly capacityTableName = 'zone_capacities';
  
  constructor(private readonly client = supabaseClient) {}

  /**
   * Get all entities
   */
  async findAll(): Promise<RepositoryResponse<Zone[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*');
        
      return {
        data: data || [],
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || 'Error fetching zones'
      };
    }
  }

  /**
   * Find an entity by ID
   */
  async findById(id: string | number): Promise<RepositoryResponse<Zone>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Error fetching zone'
      };
    }
  }

  /**
   * Create a new entity
   */
  async create(entity: Omit<Zone, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<Zone>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(entity)
        .select()
        .single();
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Error creating zone'
      };
    }
  }

  /**
   * Update an existing entity
   */
  async update(id: string | number, entity: Partial<Zone>): Promise<RepositoryResponse<Zone>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update(entity)
        .eq('id', id)
        .select()
        .single();
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Error updating zone'
      };
    }
  }

  /**
   * Delete an entity
   */
  async delete(id: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id);
        
      return {
        data: !error,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message || 'Error deleting zone'
      };
    }
  }

  /**
   * Get all zones for a facility
   */
  async getZonesByFacilityId(
    facilityId: string | number, 
    pagination?: PaginationParams, 
    sorting?: SortParams
  ): Promise<RepositoryResponse<Zone[]>> {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*')
        .eq('facility_id', facilityId);
        
      // Apply sorting if provided
      if (sorting) {
        const { field, order } = sorting;
        query = query.order(field, { ascending: order === 'asc' });
      }
      
      // Apply pagination if provided
      if (pagination) {
        const { page, pageSize } = pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error } = await query;
        
      return {
        data: data || [],
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || 'Error fetching zones by facility'
      };
    }
  }

  /**
   * Get a specific zone by ID
   */
  async getZoneById(zoneId: string | number): Promise<RepositoryResponse<Zone>> {
    return this.findById(zoneId);
  }

  /**
   * Create a new zone
   */
  async createZone(zone: Omit<Zone, 'id' | 'created_at' | 'updated_at'>): Promise<RepositoryResponse<Zone>> {
    return this.create(zone);
  }

  /**
   * Update an existing zone
   */
  async updateZone(zoneId: string | number, zone: Partial<Zone>): Promise<RepositoryResponse<Zone>> {
    return this.update(zoneId, zone);
  }

  /**
   * Delete a zone
   */
  async deleteZone(zoneId: string | number): Promise<RepositoryResponse<boolean>> {
    return this.delete(zoneId);
  }

  /**
   * Get all features for a zone
   */
  async getZoneFeatures(zoneId: string | number): Promise<RepositoryResponse<ZoneFeature[]>> {
    try {
      const { data, error } = await this.client
        .from(this.featureTableName)
        .select('*')
        .eq('zone_id', zoneId);
        
      return {
        data: data || [],
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || 'Error fetching zone features'
      };
    }
  }

  /**
   * Add a feature to a zone
   */
  async addZoneFeature(
    zoneId: string | number, 
    feature: Omit<ZoneFeature, 'id' | 'created_at' | 'updated_at'>
  ): Promise<RepositoryResponse<ZoneFeature>> {
    try {
      const { data, error } = await this.client
        .from(this.featureTableName)
        .insert({ ...feature, zone_id: zoneId })
        .select()
        .single();
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Error adding zone feature'
      };
    }
  }

  /**
   * Remove a feature from a zone
   */
  async removeZoneFeature(zoneId: string | number, featureId: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.featureTableName)
        .delete()
        .eq('id', featureId)
        .eq('zone_id', zoneId);
        
      return {
        data: !error,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message || 'Error removing zone feature'
      };
    }
  }

  /**
   * Get capacity information for a zone
   */
  async getZoneCapacity(zoneId: string | number): Promise<RepositoryResponse<ZoneCapacity>> {
    try {
      const { data, error } = await this.client
        .from(this.capacityTableName)
        .select('*')
        .eq('zone_id', zoneId)
        .single();
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Error fetching zone capacity'
      };
    }
  }

  /**
   * Set capacity information for a zone
   */
  async setZoneCapacity(zoneId: string | number, capacity: ZoneCapacity): Promise<RepositoryResponse<ZoneCapacity>> {
    try {
      // Check if capacity record exists
      const { data: existingData } = await this.client
        .from(this.capacityTableName)
        .select('*')
        .eq('zone_id', zoneId)
        .single();
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await this.client
          .from(this.capacityTableName)
          .update(capacity)
          .eq('zone_id', zoneId)
          .select()
          .single();
      } else {
        // Create new record
        result = await this.client
          .from(this.capacityTableName)
          .insert({ ...capacity, zone_id: zoneId })
          .select()
          .single();
      }
      
      const { data, error } = result;
        
      return {
        data: data || null,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Error setting zone capacity'
      };
    }
  }

  /**
   * Check availability of zones at a specific time
   */
  async checkZoneAvailability(
    facilityId: string | number,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<RepositoryResponse<Record<string, boolean>>> {
    try {
      // This would typically involve checking against bookings
      // For now we'll return a mock implementation
      
      // Get all zones for the facility
      const { data: zones } = await this.getZonesByFacilityId(facilityId);
      
      if (!zones || zones.length === 0) {
        return {
          data: {},
          error: 'No zones found for this facility'
        };
      }
      
      // Mock availability check - in a real implementation this would
      // query bookings for the specified date/time range
      const availability: Record<string, boolean> = {};
      
      // Simulate random availability for zones
      zones.forEach(zone => {
        // 70% chance a zone is available
        availability[zone.id] = Math.random() > 0.3;
      });
      
      return {
        data: availability,
        error: null
      };
    } catch (error: any) {
      return {
        data: {},
        error: error.message || 'Error checking zone availability'
      };
    }
  }
}
