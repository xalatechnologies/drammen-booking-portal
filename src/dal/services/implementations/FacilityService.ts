import { Facility, FacilityDTO, FacilityStatus } from '@/types/facility';
import { IFacilityRepository } from '../../repositories/interfaces/IFacilityRepository';
import { IFacilityService, ServiceResponse } from '../interfaces/IFacilityService';
import { FacilityRepository } from '../../repositories/implementations/FacilityRepository';

/**
 * FacilityService Class
 * 
 * Responsible for facility business logic with proper error handling and validation
 * Following Single Responsibility Principle by focusing only on facility operations
 * Following Open/Closed Principle by implementing an interface
 * Following Dependency Inversion Principle by depending on repository interface
 * Following Liskov Substitution Principle by properly implementing the service interface
 */
export class FacilityService implements IFacilityService {
  private repository: IFacilityRepository;
  private language: string;

  /**
   * Constructor with dependency injection
   * Allows for easier testing and flexibility in repository implementation
   */
  constructor(language: string = 'EN', repository?: IFacilityRepository) {
    this.repository = repository || new FacilityRepository();
    this.language = language;
  }

  /**
   * Get all facilities from the repository with proper error handling
   */
  async getAllFacilities(): Promise<ServiceResponse<Facility[]>> {
    try {
      const facilities = await this.repository.getAllFacilities();
      return { 
        success: true, 
        data: facilities 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: { message: error.message || 'Failed to fetch facilities' } 
      };
    }
  }

  /**
   * Get facility by ID with proper error handling
   */
  async getFacilityById(id: string): Promise<ServiceResponse<Facility>> {
    try {
      const facility = await this.repository.getFacilityById(id);
      if (!facility) {
        return {
          success: false,
          error: { message: 'Facility not found' }
        };
      }
      return {
        success: true,
        data: facility
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Failed to fetch facility' }
      };
    }
  }

  /**
   * Create a new facility with validation and error handling
   */
  async createFacility(facilityData: FacilityDTO): Promise<ServiceResponse<Facility>> {
    try {
      // Validate required fields
      this.validateFacilityData(facilityData);
      
      const facility = await this.repository.createFacility(facilityData);
      return {
        success: true,
        data: facility
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Failed to create facility' }
      };
    }
  }

  /**
   * Update an existing facility with validation and error handling
   */
  async updateFacility(id: string, facilityData: Partial<FacilityDTO>): Promise<ServiceResponse<Facility>> {
    try {
      // Check if facility exists
      const existingResponse = await this.getFacilityById(id);
      if (!existingResponse.success) {
        return existingResponse;
      }

      // Update the facility
      const updatedFacility = await this.repository.updateFacility(id, facilityData);
      return {
        success: true,
        data: updatedFacility
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Failed to update facility' }
      };
    }
  }

  /**
   * Delete a facility with error handling
   */
  async deleteFacility(id: string): Promise<ServiceResponse<boolean>> {
    try {
      // Check if facility exists
      const existingResponse = await this.getFacilityById(id);
      if (!existingResponse.success) {
        return {
          success: false,
          error: { message: 'Facility not found' }
        };
      }

      await this.repository.deleteFacility(id);
      return {
        success: true,
        data: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Failed to delete facility' }
      };
    }
  }

  /**
   * Get facilities by area with error handling
   */
  async getFacilitiesByArea(areaId: string): Promise<ServiceResponse<Facility[]>> {
    try {
      const facilities = await this.repository.getFacilitiesByArea(areaId);
      return {
        success: true,
        data: facilities
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Failed to fetch facilities by area' }
      };
    }
  }

  /**
   * Update facility status with validation and error handling
   */
  async updateFacilityStatus(id: string, status: string | FacilityStatus): Promise<ServiceResponse<Facility>> {
    try {
      // Validate status
      if (!this.isValidStatus(status)) {
        return {
          success: false,
          error: { message: 'Invalid status' }
        };
      }
      
      // Check if facility exists
      const existingResponse = await this.getFacilityById(id);
      if (!existingResponse.success) {
        return existingResponse;
      }

      const updatedFacility = await this.repository.updateFacilityStatus(id, status);
      return {
        success: true,
        data: updatedFacility
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message || 'Failed to update facility status' }
      };
    }
  }

  /**
   * Validate facility data
   */
  private validateFacilityData(data: Partial<FacilityDTO>): void {
    const requiredFields = ['name', 'type'];
    const errors: string[] = [];
    
    // Check required fields
    for (const field of requiredFields) {
      if (!data[field as keyof FacilityDTO]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    if (errors.length) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Validate status
   */
  private isValidStatus(status: string | FacilityStatus): boolean {
    const validStatuses = Object.values(FacilityStatus);
    return validStatuses.includes(status as FacilityStatus);
  }
}
