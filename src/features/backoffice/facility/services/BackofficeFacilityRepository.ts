import { FacilityRepository } from '@/features/facility/services/FacilityRepository';
import { Facility } from '@/features/facility/types/facility';

/**
 * IBackofficeFacilityRepository Interface
 * 
 * Following Interface Segregation Principle by defining specific data access operations
 * needed for backoffice facility management
 * Extending the core facility repository interface for admin-specific operations
 */
export interface IBackofficeFacilityRepository {
  getAllFacilities(): Promise<Facility[]>;
  getFacilityById(id: string): Promise<Facility | null>;
  createFacility(facility: Partial<Facility>): Promise<Facility>;
  updateFacility(id: string, facility: Partial<Facility>): Promise<Facility | null>;
  deleteFacility(id: string): Promise<boolean>;
  updateFacilityStatus(id: string, status: string): Promise<boolean>;
}

/**
 * BackofficeFacilityRepository class
 * 
 * Extends the core FacilityRepository to leverage existing implementation
 * while adding admin-specific functionality
 * 
 * Following Single Responsibility Principle by focusing on admin data access
 * Following Open/Closed Principle by extending rather than modifying core repository
 * Following DRY principle by reusing existing implementation
 */
export class BackofficeFacilityRepository implements IBackofficeFacilityRepository {
  private coreRepository: FacilityRepository;

  constructor(coreRepository: FacilityRepository) {
    this.coreRepository = coreRepository;
  }

  /**
   * Get all facilities with admin fields
   */
  async getAllFacilities(): Promise<Facility[]> {
    try {
      // Use core repository to get facilities, potentially with admin-specific filters
      return this.coreRepository.getAllFacilities();
    } catch (error) {
      console.error('Error in BackofficeFacilityRepository.getAllFacilities:', error);
      throw error;
    }
  }

  /**
   * Get a single facility by ID
   */
  async getFacilityById(id: string): Promise<Facility | null> {
    try {
      // Leverage core repository implementation
      return this.coreRepository.getFacilityById(id);
    } catch (error) {
      console.error(`Error in BackofficeFacilityRepository.getFacilityById for ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new facility
   */
  async createFacility(facility: Partial<Facility>): Promise<Facility> {
    try {
      // Use core repository to create facility
      return this.coreRepository.createFacility(facility);
    } catch (error) {
      console.error('Error in BackofficeFacilityRepository.createFacility:', error);
      throw error;
    }
  }

  /**
   * Update an existing facility
   */
  async updateFacility(id: string, facilityData: Partial<Facility>): Promise<Facility | null> {
    try {
      // Use core repository to update facility
      return this.coreRepository.updateFacility(id, facilityData);
    } catch (error) {
      console.error(`Error in BackofficeFacilityRepository.updateFacility for ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a facility
   */
  async deleteFacility(id: string): Promise<boolean> {
    try {
      // Use core repository to delete facility
      return this.coreRepository.deleteFacility(id);
    } catch (error) {
      console.error(`Error in BackofficeFacilityRepository.deleteFacility for ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update facility status - admin-specific operation
   */
  async updateFacilityStatus(id: string, status: string): Promise<boolean> {
    try {
      // This might be admin-specific operation that extends core functionality
      const result = await this.coreRepository.updateFacility(id, { status: status as any });
      return !!result;
    } catch (error) {
      console.error(`Error in BackofficeFacilityRepository.updateFacilityStatus for ID ${id}:`, error);
      throw error;
    }
  }
}
