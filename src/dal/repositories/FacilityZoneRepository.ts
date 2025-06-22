import { IFacilityZoneRepository } from '../interfaces/IFacilityZoneRepository';
import { PaginationParams, RepositoryResponse, SortingParams } from '@/types/api';
import { Zone, ZoneCapacity, ZoneFeature } from '@/types/facility';
import { supabaseClient } from '@/supabase/client';

/**
 * Repository for managing facility zones
 * Following the Single Responsibility Principle by focusing only on zone concerns
 */
export class FacilityZoneRepository implements IFacilityZoneRepository {
  private readonly tableName = 'zones';
  private readonly featureTableName = 'zone_features';
  private readonly capacityTableName = 'zone_capacities';

  constructor(private readonly client = supabaseClient) {}

  /**
   * Get all zones for a facility
   */
  async getZonesByFacilityId(
    facilityId: string | number,
    pagination?: PaginationParams,
    sorting?: SortingParams
  ): Promise<RepositoryResponse<Zone[]>> {
    try {
      let query = this.client
        .from(this.tableName)
        .select(`
          *,
          zone_capacities (*),
          zone_features (*)
        `)
        .eq('facility_id', facilityId);

      // Apply sorting
      if (sorting?.field) {
        const direction = sorting.direction || 'asc';
        query = query.order(sorting.field, { ascending: direction === 'asc' });
      } else {
        // Default sorting
        query = query.order('name', { ascending: true });
      }

      // Apply pagination if provided
      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as Zone[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Get a specific zone by ID
   */
  async getZoneById(zoneId: string | number): Promise<RepositoryResponse<Zone | null>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(`
          *,
          zone_capacities (*),
          zone_features (*)
        `)
        .eq('id', zoneId)
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as Zone
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Create a new zone for a facility
   */
  async createZone(facilityId: string | number, zoneData: Omit<Zone, 'id'>): Promise<RepositoryResponse<Zone>> {
    try {
      // Extract related data that belongs in separate tables
      const { features, capacity, ...zoneCore } = zoneData as any;
      
      // Insert the zone
      const { data: newZone, error } = await this.client
        .from(this.tableName)
        .insert({
          ...zoneCore,
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

      // Insert zone capacity if provided
      if (capacity) {
        await this.setZoneCapacity(newZone.id, capacity);
      }

      // Insert zone features if provided
      if (features && Array.isArray(features) && features.length > 0) {
        for (const feature of features) {
          await this.addZoneFeature(newZone.id, feature);
        }
      }

      // Return the complete zone with related data
      return this.getZoneById(newZone.id);
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Update an existing zone
   */
  async updateZone(zoneId: string | number, zoneData: Partial<Zone>): Promise<RepositoryResponse<Zone>> {
    try {
      // Extract related data that belongs in separate tables
      const { features, capacity, ...zoneCore } = zoneData as any;
      
      // Update the zone core data
      const { data: updatedZone, error } = await this.client
        .from(this.tableName)
        .update({
          ...zoneCore,
          updated_at: new Date()
        })
        .eq('id', zoneId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      // Update zone capacity if provided
      if (capacity) {
        await this.setZoneCapacity(zoneId, capacity);
      }

      // Update zone features if provided
      if (features && Array.isArray(features)) {
        // Get current features
        const { data: currentFeatures } = await this.client
          .from(this.featureTableName)
          .select('*')
          .eq('zone_id', zoneId);
        
        // Delete existing features
        if (currentFeatures && currentFeatures.length > 0) {
          await this.client
            .from(this.featureTableName)
            .delete()
            .eq('zone_id', zoneId);
        }
        
        // Add new features
        for (const feature of features) {
          await this.addZoneFeature(zoneId, feature);
        }
      }

      // Return the complete zone with related data
      return this.getZoneById(zoneId);
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Delete a zone
   */
  async deleteZone(zoneId: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      // Delete related data first (cascading delete might not be enabled)
      await this.client
        .from(this.featureTableName)
        .delete()
        .eq('zone_id', zoneId);
      
      await this.client
        .from(this.capacityTableName)
        .delete()
        .eq('zone_id', zoneId);
      
      // Delete the zone
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', zoneId);

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
   * Get zone features for a specific zone
   */
  async getZoneFeatures(zoneId: string | number): Promise<RepositoryResponse<ZoneFeature[]>> {
    try {
      const { data, error } = await this.client
        .from(this.featureTableName)
        .select('*')
        .eq('zone_id', zoneId);

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as ZoneFeature[]
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Add feature to a zone
   */
  async addZoneFeature(zoneId: string | number, feature: Omit<ZoneFeature, 'id'>): Promise<RepositoryResponse<ZoneFeature>> {
    try {
      const { data, error } = await this.client
        .from(this.featureTableName)
        .insert({
          ...feature,
          zone_id: zoneId,
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
        data: data as ZoneFeature
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Remove feature from a zone
   */
  async removeZoneFeature(zoneId: string | number, featureId: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.featureTableName)
        .delete()
        .eq('id', featureId)
        .eq('zone_id', zoneId);

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
   * Set zone capacity information
   */
  async setZoneCapacity(zoneId: string | number, capacity: ZoneCapacity): Promise<RepositoryResponse<ZoneCapacity>> {
    try {
      // Check if capacity record exists
      const { data: existingCapacity } = await this.client
        .from(this.capacityTableName)
        .select('id')
        .eq('zone_id', zoneId)
        .maybeSingle();
      
      let result;
      
      if (existingCapacity?.id) {
        // Update existing
        result = await this.client
          .from(this.capacityTableName)
          .update({
            ...capacity,
            updated_at: new Date()
          })
          .eq('id', existingCapacity.id)
          .select()
          .single();
      } else {
        // Create new
        result = await this.client
          .from(this.capacityTableName)
          .insert({
            ...capacity,
            zone_id: zoneId,
            created_at: new Date()
          })
          .select()
          .single();
      }

      if (result.error) {
        return {
          success: false,
          error: { message: result.error.message }
        };
      }

      return {
        success: true,
        data: result.data as ZoneCapacity
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Get zone capacity information
   */
  async getZoneCapacity(zoneId: string | number): Promise<RepositoryResponse<ZoneCapacity | null>> {
    try {
      const { data, error } = await this.client
        .from(this.capacityTableName)
        .select('*')
        .eq('zone_id', zoneId)
        .maybeSingle();

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      return {
        success: true,
        data: data as ZoneCapacity || null
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }

  /**
   * Check if zones are available at a specific time
   */
  async checkZoneAvailability(
    facilityId: string | number, 
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<RepositoryResponse<Record<string, boolean>>> {
    try {
      // This is a complex query that would typically involve checking bookings
      // For now, we'll implement a simplified version
      
      // Get all zones for the facility
      const { data: zones, error } = await this.client
        .from(this.tableName)
        .select('id, name')
        .eq('facility_id', facilityId)
        .eq('is_active', true);

      if (error) {
        return {
          success: false,
          error: { message: error.message }
        };
      }

      // Check bookings for each zone (simplified mock implementation)
      const availability: Record<string, boolean> = {};
      
      for (const zone of zones) {
        // In a real implementation, we'd check against bookings table
        // This is a placeholder implementation
        availability[zone.id] = true; // Assuming all zones are available
      }

      return {
        success: true,
        data: availability
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'An unknown error occurred' }
      };
    }
  }
}

// Export singleton instance
export const facilityZoneRepository = new FacilityZoneRepository();
