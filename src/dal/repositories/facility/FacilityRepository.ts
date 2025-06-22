
import { BaseRepository } from '@/dal/repositories/base/BaseRepository';
import { IFacilityRepository } from '@/dal/interfaces/facility/IFacilityRepository';
import { Facility, FacilityFilters, OpeningHours, Zone } from '@/types/facility';
import { PaginationParams, RepositoryResponse, PaginatedResponse, SortParams } from '@/types/api';
import { supabaseClient } from '@/supabase/client';

interface FacilityCreateRequest {
  name: string;
  address: string;
  type: string;
  area: string;
  description: string;
  capacity: number;
  accessibility: string[];
  suitableFor: string[];
  equipment: string[];
  openingHours: OpeningHours[];
  image: string;
}

interface FacilityUpdateRequest extends Partial<FacilityCreateRequest> {
  nextAvailable?: string;
  rating?: number;
  reviewCount?: number;
  pricePerHour?: number;
  amenities?: string[];
  hasAutoApproval?: boolean;
}

/**
 * Repository implementation for facility operations
 * Extends BaseRepository to inherit common CRUD operations
 * Follows Single Responsibility Principle by focusing only on facility operations
 */
export class FacilityRepository extends BaseRepository<Facility> implements IFacilityRepository {
  protected tableName = 'facilities';

  constructor(client = supabaseClient) {
    super(client);
  }

  /**
   * Get paginated facilities with specialized filtering
   * Implements the interface method for paginated data retrieval
   */
  async getPaginated(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sorting?: SortParams
  ): Promise<RepositoryResponse<PaginatedResponse<Facility>>> {
    try {
      let query = this.client.from(this.tableName).select('*', { count: 'exact' });
      
      // Apply filters if provided
      if (filters) {
        if (filters.type || filters.facilityType) {
          query = query.eq('type', filters.type || filters.facilityType);
        }
        if (filters.area || filters.location) {
          query = query.eq('area', filters.area || filters.location);
        }
        if (filters.search || filters.searchTerm) {
          query = query.ilike('name', `%${filters.search || filters.searchTerm}%`);
        }
        if (filters.amenities && filters.amenities.length > 0) {
          // This assumes amenities is stored as an array in the database
          // Adjustments may be needed based on actual storage format
          filters.amenities.forEach(amenity => {
            query = query.contains('amenities', [amenity]);
          });
        }
      }
      
      // Apply sorting if provided
      if (sorting) {
        const { field, direction } = sorting;
        query = query.order(field, { ascending: direction === 'asc' });
      }
      
      // Apply pagination
      const { page, pageSize } = pagination;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      return {
        data: {
          data: data || [],
          pagination: {
            page,
            limit: pageSize,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / pageSize),
            hasNext: (page * pageSize) < (count || 0),
            hasPrev: page > 1
          }
        },
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: {
          data: [],
          pagination: {
            page: pagination.page,
            limit: pagination.pageSize,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        },
        error: error.message || 'Error fetching paginated facilities'
      };
    }
  }

  /**
   * Get all facilities with optional pagination and filters
   * @param pagination Optional pagination parameters
   * @param filters Optional filtering criteria
   */
  async getAll(pagination?: PaginationParams, filters?: FacilityFilters): Promise<RepositoryResponse<Facility[]>> {
    try {
      let query = this.client.from(this.tableName).select('*');
      
      // Apply filters if provided
      if (filters) {
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        if (filters.area) {
          query = query.eq('area', filters.area);
        }
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }
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
        error: error.message || 'Error fetching facilities'
      };
    }
  }

  /**
   * Get facility by ID
   * @param id The facility ID
   */
  async getById(id: string): Promise<RepositoryResponse<Facility>> {
    return this.findById(id);
  }

  /**
   * Create a new facility
   * @param facilityData The facility data
   */
  async createAsync(facilityData: Partial<Facility>): Promise<RepositoryResponse<Facility>> {
    return this.create(facilityData as Omit<Facility, 'id' | 'created_at' | 'updated_at'>);
  }

  /**
   * Update an existing facility
   * @param id The facility ID
   * @param facilityData The facility data to update
   */
  async updateAsync(id: string, facilityData: Partial<Facility>): Promise<RepositoryResponse<Facility>> {
    return this.update(id, facilityData);
  }

  /**
   * Delete a facility
   * @param id The facility ID
   */
  async deleteAsync(id: string): Promise<RepositoryResponse<boolean>> {
    return this.delete(id);
  }

  /**
   * Get facilities by type
   * @param type The facility type
   */
  async getFacilitiesByType(type: string): Promise<RepositoryResponse<Facility[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('type', type);
      
      return {
        data: data || [],
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || 'Error fetching facilities by type'
      };
    }
  }

  /**
   * Get facilities by area
   * @param area The facility area
   */
  async getFacilitiesByArea(area: string): Promise<RepositoryResponse<Facility[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('area', area);
      
      return {
        data: data || [],
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || 'Error fetching facilities by area'
      };
    }
  }

  /**
   * Get zones for a facility
   * @param id The facility ID
   */
  async getFacilityZones(id: string | number): Promise<RepositoryResponse<Zone[]>> {
    try {
      const { data, error } = await this.client
        .from('facility_zones')
        .select('*')
        .eq('facility_id', id);
      
      return {
        data: data || [],
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || 'Error fetching facility zones'
      };
    }
  }

  /**
   * Check if a facility exists by ID
   * @param id The facility ID to check
   */
  async exists(id: string | number): Promise<RepositoryResponse<boolean>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('id')
        .eq('id', id)
        .single();
      
      return {
        data: !!data,
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message || 'Error checking facility existence'
      };
    }
  }
  
  /**
   * Get featured facilities
   */
  async getFeaturedFacilities(): Promise<RepositoryResponse<Facility[]>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('is_featured', true);
      
      return {
        data: data || [],
        error: error?.message
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message || 'Error fetching featured facilities'
      };
    }
  }
  
  /**
   * Toggle facility active status
   * @param id The facility ID
   * @param isActive The new active status
   */
  async toggleStatus(id: string | number, isActive: boolean): Promise<RepositoryResponse<Facility>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update({ 
          status: isActive ? 'active' : 'inactive' 
        })
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
        error: error.message || 'Error toggling facility status'
      };
    }
  }
  
  /**
   * Update facility images
   * @param id The facility ID
   * @param imageUrls Array of image URLs
   */
  async updateImages(id: string | number, imageUrls: string[]): Promise<RepositoryResponse<Facility>> {
    try {
      // Main facility image is the first in the array
      const mainImage = imageUrls.length > 0 ? imageUrls[0] : null;
      
      const { data, error } = await this.client
        .from(this.tableName)
        .update({
          image_url: mainImage,
          // Store all images in a JSON column or related table as per your DB schema
          // This is just a placeholder implementation
          // In a real implementation, you might need to handle this differently
          images: imageUrls
        })
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
        error: error.message || 'Error updating facility images'
      };
    }
  }
}

// Export singleton instance
export const facilityRepository = new FacilityRepository();
