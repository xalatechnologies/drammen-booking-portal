import { Facility } from '@/types/facility';

// Using the types as defined in the existing facility types file
type FacilityDTO = Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * IFacilityRepository Interface
 * 
 * Following Interface Segregation Principle by defining focused repository operations
 * Following Dependency Inversion Principle by depending on abstractions
 */
export interface IFacilityRepository {
  /**
   * Get all facilities
   */
  getAllFacilities(): Promise<Facility[]>;
  
  /**
   * Get facility by ID
   */
  getFacilityById(id: string): Promise<Facility | null>;
  
  /**
   * Create a new facility
   */
  createFacility(facilityData: FacilityDTO): Promise<Facility>;
  
  /**
   * Update an existing facility
   */
  updateFacility(id: string, facilityData: Partial<FacilityDTO>): Promise<Facility>;
  
  /**
   * Delete a facility
   */
  deleteFacility(id: string): Promise<boolean>;
  
  /**
   * Get facilities by area
   */
  getFacilitiesByArea(areaId: string): Promise<Facility[]>;
  
  /**
   * Update facility status
   */
  updateFacilityStatus(id: string, status: string): Promise<Facility>;
}
