import { IBaseRepository } from './IBaseRepository';
import { Facility, FacilityFilters, Zone } from '@/types/facility';
import { PaginatedResponse, PaginationParams, RepositoryResponse, SortingParams } from '@/types/api';

/**
 * Facility repository interface extending the base repository
 * Following Interface Segregation Principle by providing facility-specific methods
 */
export interface IFacilityRepository extends IBaseRepository<Facility> {
  /**
   * Get paginated facilities with specialized filtering
   */
  getPaginated(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sorting?: SortingParams
  ): Promise<RepositoryResponse<PaginatedResponse<Facility>>>;
  
  /**
   * Get facilities by type
   */
  getFacilitiesByType(type: string): Promise<RepositoryResponse<Facility[]>>;
  
  /**
   * Get facilities by area or location
   */
  getFacilitiesByArea(area: string): Promise<RepositoryResponse<Facility[]>>;
  
  /**
   * Get zones associated with a facility
   */
  getFacilityZones(facilityId: string | number): Promise<RepositoryResponse<Zone[]>>;
  
  /**
   * Check if a facility exists by ID
   */
  exists(id: string | number): Promise<RepositoryResponse<boolean>>;
  
  /**
   * Get featured facilities
   */
  getFeaturedFacilities(): Promise<RepositoryResponse<Facility[]>>;
  
  /**
   * Toggle facility active status
   */
  toggleStatus(id: string | number, isActive: boolean): Promise<RepositoryResponse<Facility>>;
  
  /**
   * Update facility images
   */
  updateImages(id: string | number, imageUrls: string[]): Promise<RepositoryResponse<Facility>>;
}
