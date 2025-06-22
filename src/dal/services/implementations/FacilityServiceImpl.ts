/**
 * Facility Service Implementation
 * 
 * Implements the IFacilityService interface for facility business logic
 * following SOLID principles with localization support.
 */

import { ServiceResponse } from '@/types/api';
import { IFacilityService } from '../interfaces/IFacilityService';
import { IFacilityRepository } from '../../repositories/interfaces/IFacilityRepository';
import { Facility, FacilityStatus } from '@/types/facility';
import { createServiceError, createServiceSuccess } from '@/core/utils/service-response';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { CreateFacilityRequest, UpdateFacilityRequest, FacilityFilters } from '../../repositories/implementations/FacilityRepositoryImpl';

/**
 * Service implementation for facility business logic
 * Following SOLID principles:
 * - Single Responsibility: Only handles facility business logic
 * - Open/Closed: Can be extended without modification
 * - Liskov Substitution: Follows interface contract
 * - Interface Segregation: Implements focused interface
 * - Dependency Inversion: Depends on abstractions (IFacilityRepository, ILocalizationService)
 */
export class FacilityService implements IFacilityService {
  /**
   * Constructor with dependency injection
   * following Dependency Inversion Principle
   */
  constructor(
    private readonly facilityRepository: IFacilityRepository,
    private readonly localizationService: ILocalizationService
  ) {}
  
  /**
   * Get a facility by ID
   */
  async getFacilityById(id: string): Promise<ServiceResponse<Facility>> {
    const result = await this.facilityRepository.getById(id);
    
    if (!result.success) {
      return createServiceError(result.error);
    }
    
    return createServiceSuccess(result.data);
  }
  
  /**
   * Get all facilities matching the provided filters
   */
  async getAllFacilities(filters?: FacilityFilters): Promise<ServiceResponse<Facility[]>> {
    const result = await this.facilityRepository.getAll(filters);
    
    if (!result.success) {
      return createServiceError(result.error);
    }
    
    return createServiceSuccess(result.data);
  }
  
  /**
   * Create a new facility
   */
  async createFacility(facility: CreateFacilityRequest): Promise<ServiceResponse<Facility>> {
    // Validate the facility data before creating
    const validationError = this.validateFacility(facility);
    if (validationError) {
      return createServiceError({
        type: 'VALIDATION_ERROR',
        message: validationError
      });
    }
    
    const result = await this.facilityRepository.create(facility);
    
    if (!result.success) {
      return createServiceError(result.error);
    }
    
    return createServiceSuccess(result.data);
  }
  
  /**
   * Update an existing facility
   */
  async updateFacility(id: string, facility: UpdateFacilityRequest): Promise<ServiceResponse<Facility>> {
    // Check if facility exists
    const existingFacility = await this.facilityRepository.getById(id);
    if (!existingFacility.success) {
      return createServiceError(existingFacility.error);
    }
    
    // Validate the update data
    const validationError = this.validateFacilityUpdate(facility);
    if (validationError) {
      return createServiceError({
        type: 'VALIDATION_ERROR',
        message: validationError
      });
    }
    
    const result = await this.facilityRepository.update(id, facility);
    
    if (!result.success) {
      return createServiceError(result.error);
    }
    
    return createServiceSuccess(result.data);
  }
  
  /**
   * Delete a facility by ID
   */
  async deleteFacility(id: string): Promise<ServiceResponse<boolean>> {
    // Check if facility exists
    const existingFacility = await this.facilityRepository.getById(id);
    if (!existingFacility.success) {
      return createServiceError(existingFacility.error);
    }
    
    // Check if facility can be deleted (e.g., no active bookings)
    const canDelete = await this.canDeleteFacility(id);
    if (!canDelete.success) {
      return canDelete;
    }
    
    const result = await this.facilityRepository.delete(id);
    
    if (!result.success) {
      return createServiceError(result.error);
    }
    
    return createServiceSuccess(true);
  }
  
  /**
   * Update facility status
   */
  async updateFacilityStatus(id: string, status: string): Promise<ServiceResponse<Facility>> {
    // Check if facility exists
    const existingFacility = await this.facilityRepository.getById(id);
    if (!existingFacility.success) {
      return createServiceError(existingFacility.error);
    }
    
    // Validate status
    if (!this.isValidStatus(status)) {
      return createServiceError({
        type: 'VALIDATION_ERROR',
        message: this.localizationService.t('facility.validation.invalidStatus')
      });
    }
    
    const result = await this.facilityRepository.updateStatus(id, status);
    
    if (!result.success) {
      return createServiceError(result.error);
    }
    
    return createServiceSuccess(result.data);
  }
  
  // Private helper methods
  
  /**
   * Validate facility data for creation
   */
  private validateFacility(facility: CreateFacilityRequest): string | null {
    // Check required fields with localized error messages
    if (!facility.name || Object.keys(facility.name).length === 0) {
      return this.localizationService.t('facility.validation.nameRequired');
    }
    
    if (!facility.type || Object.keys(facility.type).length === 0) {
      return this.localizationService.t('facility.validation.typeRequired');
    }
    
    // Check capacity is a positive number if provided
    if (facility.capacity !== undefined && (isNaN(facility.capacity) || facility.capacity < 0)) {
      return this.localizationService.t('facility.validation.invalidCapacity');
    }
    
    // Validate price if provided
    if (facility.pricePerHour !== undefined && (isNaN(facility.pricePerHour) || facility.pricePerHour < 0)) {
      return this.localizationService.t('facility.validation.invalidPrice');
    }
    
    // Validate time slot duration if provided
    if (facility.timeSlotDuration !== undefined && (isNaN(facility.timeSlotDuration) || facility.timeSlotDuration <= 0)) {
      return this.localizationService.t('facility.validation.invalidTimeSlotDuration');
    }
    
    // Validate location coordinates if provided
    if (facility.location) {
      if (
        facility.location.latitude === undefined || 
        facility.location.longitude === undefined ||
        isNaN(facility.location.latitude) || 
        isNaN(facility.location.longitude) ||
        facility.location.latitude < -90 || 
        facility.location.latitude > 90 || 
        facility.location.longitude < -180 || 
        facility.location.longitude > 180
      ) {
        return this.localizationService.t('facility.validation.invalidLocation');
      }
    }
    
    return null; // No validation errors
  }
  
  /**
   * Validate facility data for update
   */
  private validateFacilityUpdate(facility: UpdateFacilityRequest): string | null {
    // Check name format if provided
    if (facility.name && Object.keys(facility.name).length === 0) {
      return this.localizationService.t('facility.validation.invalidName');
    }
    
    // Check type format if provided
    if (facility.type && Object.keys(facility.type).length === 0) {
      return this.localizationService.t('facility.validation.invalidType');
    }
    
    // Check capacity is a positive number if provided
    if (facility.capacity !== undefined && (isNaN(facility.capacity) || facility.capacity < 0)) {
      return this.localizationService.t('facility.validation.invalidCapacity');
    }
    
    // Validate price if provided
    if (facility.pricePerHour !== undefined && (isNaN(facility.pricePerHour) || facility.pricePerHour < 0)) {
      return this.localizationService.t('facility.validation.invalidPrice');
    }
    
    // Validate time slot duration if provided
    if (facility.timeSlotDuration !== undefined && (isNaN(facility.timeSlotDuration) || facility.timeSlotDuration <= 0)) {
      return this.localizationService.t('facility.validation.invalidTimeSlotDuration');
    }
    
    // Validate location coordinates if provided
    if (facility.location) {
      if (
        (facility.location.latitude !== undefined && isNaN(facility.location.latitude)) || 
        (facility.location.longitude !== undefined && isNaN(facility.location.longitude)) ||
        (facility.location.latitude !== undefined && (facility.location.latitude < -90 || facility.location.latitude > 90)) || 
        (facility.location.longitude !== undefined && (facility.location.longitude < -180 || facility.location.longitude > 180))
      ) {
        return this.localizationService.t('facility.validation.invalidLocation');
      }
    }
    
    return null; // No validation errors
  }
  
  /**
   * Check if status is valid
   */
  private isValidStatus(status: string): boolean {
    // We should compare with the enum values in FacilityStatus
    // This is a simplified check for now
    return ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DRAFT', 'PENDING_APPROVAL'].includes(status);
  }
  
  /**
   * Check if a facility can be deleted
   */
  private async canDeleteFacility(id: string): Promise<ServiceResponse<boolean>> {
    // This would check for related resources like bookings
    // For now, just return true
    return createServiceSuccess(true);
    
    // Example implementation checking for active bookings:
    /*
    try {
      // Check if there are active bookings for this facility
      const activeBookings = await this.bookingRepository.countActiveBookingsForFacility(id);
      
      if (activeBookings > 0) {
        return createServiceError({
          type: 'BUSINESS_RULE_VIOLATION',
          message: this.localizationService.t('facility.errors.cannotDeleteWithActiveBookings')
        });
      }
      
      return createServiceSuccess(true);
    } catch (error) {
      return createServiceError({
        type: 'UNKNOWN_ERROR',
        message: this.localizationService.t('facility.errors.unknownError'),
        details: error
      });
    }
    */
  }
}
