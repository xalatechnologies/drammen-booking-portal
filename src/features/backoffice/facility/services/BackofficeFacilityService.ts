import { ServiceResponse } from '@/core/types/ServiceResponse';
import { Facility } from '@/features/facility/types/facility';
import { FacilityService } from '@/features/facility/services/FacilityService';
import { LocalizedText } from '@/core/localization/types';
import { BackofficeFacilityRepository } from './BackofficeFacilityRepository';

/**
 * FacilityAdminStatusType represents the possible administrative statuses
 * of a facility
 */
export type FacilityAdminStatusType = 'active' | 'inactive' | 'maintenance' | 'pending';

/**
 * BackofficeUpdateFacilityDto - Data transfer object for facility updates
 * Following Interface Segregation Principle with a focused interface
 */
export interface BackofficeUpdateFacilityDto {
  name?: LocalizedText;
  description?: LocalizedText;
  type?: LocalizedText;
  capacity?: number;
  area?: number;
  pricePerHour?: number;
  amenities?: string[];
  images?: { image_url: string; alt: string; }[];
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  status?: FacilityAdminStatusType;
}

/**
 * IBackofficeFacilityService Interface
 * 
 * Following Interface Segregation Principle by defining specific operations
 * needed for backoffice facility management
 */
export interface IBackofficeFacilityService {
  getAllFacilities(): Promise<ServiceResponse<Facility[]>>;
  getFacilityDetails(id: string): Promise<ServiceResponse<Facility>>;
  createFacility(facility: BackofficeUpdateFacilityDto): Promise<ServiceResponse<Facility>>;
  updateFacility(id: string, facility: BackofficeUpdateFacilityDto): Promise<ServiceResponse<Facility>>;
  deleteFacility(id: string): Promise<ServiceResponse<boolean>>;
  updateFacilityStatus(id: string, status: FacilityAdminStatusType): Promise<ServiceResponse<boolean>>;
  translateFacilityData(facility: Facility): Facility;
}

/**
 * BackofficeFacilityService class
 * 
 * Implementation of the IBackofficeFacilityService interface
 * Following Single Responsibility Principle by focusing on backoffice facility operations
 * Following Dependency Inversion Principle by depending on repository abstraction
 * Following Open/Closed Principle by being open for extension
 * Following DRY principle by leveraging core facility service
 */
export class BackofficeFacilityService implements IBackofficeFacilityService {
  private repository: BackofficeFacilityRepository;
  private coreService: FacilityService;
  private currentLanguage: string;

  constructor(repository: BackofficeFacilityRepository, language: string, coreService?: FacilityService) {
    this.repository = repository;
    this.currentLanguage = language;
    this.coreService = coreService || new FacilityService();
  }

  /**
   * Get all facilities with administrative details
   * Leverages core facility service but adds admin-specific data
   */
  async getAllFacilities(): Promise<ServiceResponse<Facility[]>> {
    try {
      const facilities = await this.repository.getAllFacilities();
      // Translate facilities based on current language if needed
      const translatedFacilities = facilities.map(facility => this.translateFacilityData(facility));
      
      return {
        success: true,
        data: translatedFacilities
      };
    } catch (error) {
      console.error('Error in BackofficeFacilityService.getAllFacilities:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error fetching facilities'
        }
      };
    }
  }

  /**
   * Get detailed facility information for administrative purposes
   */
  async getFacilityDetails(id: string): Promise<ServiceResponse<Facility>> {
    try {
      const facility = await this.repository.getFacilityById(id);
      
      if (!facility) {
        return {
          success: false,
          error: {
            message: `Facility with ID ${id} not found`
          }
        };
      }

      // Translate facility based on current language
      const translatedFacility = this.translateFacilityData(facility);

      return {
        success: true,
        data: translatedFacility
      };
    } catch (error) {
      console.error(`Error in BackofficeFacilityService.getFacilityDetails for ID ${id}:`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error fetching facility details'
        }
      };
    }
  }

  /**
   * Create a new facility
   */
  async createFacility(facilityDto: BackofficeUpdateFacilityDto): Promise<ServiceResponse<Facility>> {
    try {
      // Ensure localized fields are properly structured
      const facilityData = this.prepareFacilityData(facilityDto);
      
      const newFacility = await this.repository.createFacility(facilityData);
      const translatedFacility = this.translateFacilityData(newFacility);
      
      return {
        success: true,
        data: translatedFacility
      };
    } catch (error) {
      console.error('Error in BackofficeFacilityService.createFacility:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error creating facility'
        }
      };
    }
  }

  /**
   * Update an existing facility
   */
  async updateFacility(id: string, facilityDto: BackofficeUpdateFacilityDto): Promise<ServiceResponse<Facility>> {
    try {
      // Ensure localized fields are properly structured
      const facilityData = this.prepareFacilityData(facilityDto);
      
      const updatedFacility = await this.repository.updateFacility(id, facilityData);
      
      if (!updatedFacility) {
        return {
          success: false,
          error: {
            message: `Facility with ID ${id} not found`
          }
        };
      }

      const translatedFacility = this.translateFacilityData(updatedFacility);

      return {
        success: true,
        data: translatedFacility
      };
    } catch (error) {
      console.error(`Error in BackofficeFacilityService.updateFacility for ID ${id}:`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error updating facility'
        }
      };
    }
  }

  /**
   * Delete a facility
   */
  async deleteFacility(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const result = await this.repository.deleteFacility(id);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error(`Error in BackofficeFacilityService.deleteFacility for ID ${id}:`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error deleting facility'
        }
      };
    }
  }

  /**
   * Update facility status - admin specific operation
   */
  async updateFacilityStatus(id: string, status: FacilityAdminStatusType): Promise<ServiceResponse<boolean>> {
    try {
      const result = await this.repository.updateFacilityStatus(id, status);
      
      if (!result) {
        return {
          success: false,
          error: {
            message: `Facility with ID ${id} not found`
          }
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error(`Error in BackofficeFacilityService.updateFacilityStatus for ID ${id}:`, error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error updating facility status'
        }
      };
    }
  }
  
  /**
   * Helper method to prepare facility data ensuring localization fields are properly formatted
   * Private method as it's an implementation detail
   */
  private prepareFacilityData(facilityDto: BackofficeUpdateFacilityDto): Partial<Facility> {
    // Make a copy to avoid mutating the input
    const facilityData = { ...facilityDto };
    
    // Ensure localized fields have proper structure for all supported languages
    // This is a simplified example, in reality would check against all supported languages
    const supportedLanguages = ['EN', 'NO'];
    
    // Ensure name has all supported languages
    if (facilityData.name) {
      supportedLanguages.forEach(lang => {
        if (!facilityData.name![lang]) {
          // If language is missing, copy from another language or set placeholder
          const existingLang = Object.keys(facilityData.name!)[0];
          facilityData.name![lang] = facilityData.name![existingLang] || '';
        }
      });
    }
    
    // Same for description
    if (facilityData.description) {
      supportedLanguages.forEach(lang => {
        if (!facilityData.description![lang]) {
          const existingLang = Object.keys(facilityData.description!)[0];
          facilityData.description![lang] = facilityData.description![existingLang] || '';
        }
      });
    }
    
    // Same for type
    if (facilityData.type) {
      supportedLanguages.forEach(lang => {
        if (!facilityData.type![lang]) {
          const existingLang = Object.keys(facilityData.type!)[0];
          facilityData.type![lang] = facilityData.type![existingLang] || '';
        }
      });
    }
    
    return facilityData;
  }
  
  /**
   * Translate facility data based on current language context
   * Public method that can be used by components to get localized data
   */
  translateFacilityData(facility: Facility): Facility {
    // In a real application, this might do more complex processing
    // For now, we just return the facility as is since components will use localization hooks
    return facility;
  }
}
