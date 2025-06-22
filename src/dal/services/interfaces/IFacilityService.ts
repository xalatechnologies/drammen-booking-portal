import { Facility, FacilityDTO, FacilityStatus } from '@/types/facility';

/**
 * Service Response Type
 * Generic type for consistent service responses with success/error handling
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * IFacilityService Interface
 * 
 * Following Interface Segregation Principle by defining focused service operations
 * Following Dependency Inversion Principle by depending on abstractions
 */
export interface IFacilityService {
  /**
   * Get all facilities with localization
   */
  getAllFacilities(): Promise<ServiceResponse<Facility[]>>;
  
  /**
   * Get facility by ID with localization
   */
  getFacilityById(id: string): Promise<ServiceResponse<Facility>>;
  
  /**
   * Create a new facility
   */
  createFacility(facilityData: FacilityDTO): Promise<ServiceResponse<Facility>>;
  
  /**
   * Update an existing facility
   */
  updateFacility(id: string, facilityData: Partial<FacilityDTO>): Promise<ServiceResponse<Facility>>;
  
  /**
   * Delete a facility
   */
  deleteFacility(id: string): Promise<ServiceResponse<boolean>>;
  
  /**
   * Get facilities by area
   */
  getFacilitiesByArea(areaId: string): Promise<ServiceResponse<Facility[]>>;
  
  /**
   * Update facility status
   */
  updateFacilityStatus(id: string, status: string | FacilityStatus): Promise<ServiceResponse<Facility>>;
}
