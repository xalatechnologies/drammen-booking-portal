/**
 * Facility Service Tests
 * 
 * Tests for the FacilityService implementation to validate
 * SOLID principles and proper functionality.
 */

import { FacilityService } from '../implementations/FacilityService';
import { IFacilityRepository } from '../../repositories/interfaces/IFacilityRepository';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { Facility, FacilityFilters, CreateFacilityRequest, UpdateFacilityRequest } from '@/features/facility/types/facility';
import { ErrorType } from '@/core/utils/error-handling';
import { RepositoryResponse } from '@/types/api';

// Mock facility repository for testing
class MockFacilityRepository implements IFacilityRepository {
  private facilities: Record<string, Facility> = {
    'facility-1': {
      id: 'facility-1',
      name: { 
        EN: 'Main Hall', 
        NO: 'Hovedhall' 
      },
      type: 'hall',
      area: 'downtown',
      status: 'active',
      capacity: 100,
      pricePerHour: 500,
      accessibilityFeatures: ['wheelchair', 'hearing_loop'],
      allowedBookingTypes: ['private', 'public'],
      amenities: ['wifi', 'projector'],
      location: {
        latitude: 59.9139,
        longitude: 10.7522
      },
      openingHours: {
        monday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        tuesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        wednesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        thursday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        friday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        saturday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
        sunday: { isOpen: false, openTime: '', closeTime: '' }
      },
      timeSlotDuration: 1
    },
    'facility-2': {
      id: 'facility-2',
      name: { 
        EN: 'Meeting Room A', 
        NO: 'Møterom A' 
      },
      type: 'meeting_room',
      area: 'downtown',
      status: 'active',
      capacity: 20,
      pricePerHour: 200,
      accessibilityFeatures: ['wheelchair'],
      allowedBookingTypes: ['private'],
      amenities: ['wifi', 'whiteboard'],
      location: {
        latitude: 59.9110,
        longitude: 10.7500
      },
      openingHours: {
        monday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
        tuesday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
        wednesday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
        thursday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
        friday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
        saturday: { isOpen: false, openTime: '', closeTime: '' },
        sunday: { isOpen: false, openTime: '', closeTime: '' }
      },
      timeSlotDuration: 1
    }
  };
  
  async getFacilityById(id: string): Promise<RepositoryResponse<Facility>> {
    const facility = this.facilities[id];
    
    if (!facility) {
      return {
        success: false,
        error: {
          type: ErrorType.NOT_FOUND,
          message: `Facility with ID ${id} not found`,
          localizationKey: 'errors:facilityNotFound',
          parameters: { id },
          details: {}
        }
      };
    }
    
    return {
      success: true,
      data: facility
    };
  }
  
  async getAllFacilities(filters?: FacilityFilters): Promise<RepositoryResponse<Facility[]>> {
    let facilities = Object.values(this.facilities);
    
    if (filters) {
      // Apply basic filters
      if (filters.types && filters.types.length > 0) {
        facilities = facilities.filter(f => filters.types!.includes(f.type));
      }
      
      if (filters.areas && filters.areas.length > 0) {
        facilities = facilities.filter(f => filters.areas!.includes(f.area));
      }
      
      if (filters.minCapacity !== undefined) {
        facilities = facilities.filter(f => f.capacity >= filters.minCapacity!);
      }
      
      if (filters.search) {
        facilities = facilities.filter(f => 
          f.name.EN.toLowerCase().includes(filters.search!.toLowerCase()) || 
          f.name.NO.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
    }
    
    return {
      success: true,
      data: facilities
    };
  }
  
  async createFacility(facility: CreateFacilityRequest): Promise<RepositoryResponse<Facility>> {
    const id = `facility-${Object.keys(this.facilities).length + 1}`;
    const newFacility = { 
      id, 
      ...facility, 
      status: 'active',
      location: facility.location || undefined,
      openingHours: facility.openingHours || {},
      timeSlotDuration: facility.timeSlotDuration || 1
    } as Facility;
    
    this.facilities[id] = newFacility;
    
    return {
      success: true,
      data: newFacility
    };
  }
  
  async updateFacility(id: string, facility: UpdateFacilityRequest): Promise<RepositoryResponse<Facility>> {
    if (!this.facilities[id]) {
      return {
        success: false,
        error: {
          type: ErrorType.NOT_FOUND,
          message: `Facility with ID ${id} not found`,
          localizationKey: 'errors:facilityNotFound',
          parameters: { id },
          details: {}
        }
      };
    }
    
    this.facilities[id] = {
      ...this.facilities[id],
      ...facility
    };
    
    return {
      success: true,
      data: this.facilities[id]
    };
  }
  
  async deleteFacility(id: string): Promise<RepositoryResponse<boolean>> {
    if (!this.facilities[id]) {
      return {
        success: false,
        error: {
          type: ErrorType.NOT_FOUND,
          message: `Facility with ID ${id} not found`,
          localizationKey: 'errors:facilityNotFound',
          parameters: { id },
          details: {}
        }
      };
    }
    
    delete this.facilities[id];
    
    return {
      success: true,
      data: true
    };
  }
  
  async searchFacilities(query: string): Promise<RepositoryResponse<Facility[]>> {
    return this.getAllFacilities({ search: query });
  }
  
  async getFacilitiesByType(type: string): Promise<RepositoryResponse<Facility[]>> {
    return this.getAllFacilities({ types: [type] });
  }
  
  async getFacilitiesByArea(area: string): Promise<RepositoryResponse<Facility[]>> {
    return this.getAllFacilities({ areas: [area] });
  }
  
  async getFacilitiesByAmenities(amenities: string[]): Promise<RepositoryResponse<Facility[]>> {
    let facilities = Object.values(this.facilities);
    
    facilities = facilities.filter(facility => 
      amenities.every(amenity => facility.amenities.includes(amenity))
    );
    
    return {
      success: true,
      data: facilities
    };
  }
}

// Mock localization service for testing
class MockLocalizationService implements ILocalizationService {
  translate(key: string, params?: Record<string, any>): string {
    if (key === 'errors:facilityNotFound') {
      return `Facility with ID ${params?.id} not found`;
    }
    if (key === 'errors:facilityUpdateFailed') {
      return `Failed to update facility with ID ${params?.id}`;
    }
    if (key === 'errors:facilityDeleteFailed') {
      return `Failed to delete facility with ID ${params?.id}`;
    }
    if (key.startsWith('validation.facility.')) {
      return `Validation error: ${key}`;
    }
    if (key === 'errors.validation') {
      return 'Validation failed';
    }
    if (key === 'errors.validationDetails') {
      return `Validation failed for fields: ${params?.fields}`;
    }
    return key;
  }
  
  changeLanguage(language: string): void {
    // Not implemented for this mock
  }
  
  getCurrentLanguage(): string {
    return 'en';
  }
  
  getAvailableLanguages(): string[] {
    return ['en', 'no'];
  }
}

describe('FacilityService', () => {
  let service: FacilityService;
  let repository: IFacilityRepository;
  let localizationService: ILocalizationService;
  
  beforeEach(() => {
    repository = new MockFacilityRepository();
    localizationService = new MockLocalizationService();
    service = new FacilityService(repository, localizationService);
  });
  
  describe('getFacilityById', () => {
    it('should return a facility when it exists', async () => {
      const result = await service.getFacilityById('facility-1');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('facility-1');
    });
    
    it('should return an error when facility does not exist', async () => {
      const result = await service.getFacilityById('non-existent');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(ErrorType.NOT_FOUND);
    });
  });
  
  describe('getAllFacilities', () => {
    it('should return all facilities when no filters are provided', async () => {
      const result = await service.getAllFacilities();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.length).toBe(2);
    });
    
    it('should filter facilities by type', async () => {
      const result = await service.getAllFacilities({ types: ['meeting_room'] });
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].type).toBe('meeting_room');
    });
  });
  
  describe('createFacility', () => {
    it('should create a new facility with valid data', async () => {
      const newFacility = {
        name: {
          EN: 'Conference Room',
          NO: 'Konferanserom'
        },
        type: 'conference',
        area: 'suburban',
        capacity: 50,
        pricePerHour: 300,
        accessibilityFeatures: ['wheelchair'],
        allowedBookingTypes: ['private', 'public'],
        amenities: ['wifi', 'projector', 'catering']
      };
      
      const result = await service.createFacility(newFacility);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBeDefined();
      expect(result.data?.name.EN).toBe('Conference Room');
    });
    
    it('should return validation error when name is missing', async () => {
      const invalidFacility = {
        type: 'conference',
        area: 'suburban',
        capacity: 50,
        pricePerHour: 300,
        accessibilityFeatures: ['wheelchair'],
        allowedBookingTypes: ['private', 'public'],
        amenities: ['wifi', 'projector', 'catering']
      } as any; // Type assertion to bypass TypeScript's type checking
      
      const result = await service.createFacility(invalidFacility);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(ErrorType.VALIDATION);
    });
  });
  
  describe('getAvailableTimeSlots', () => {
    it('should return time slots for a valid facility', async () => {
      const startDate = new Date('2025-06-22');
      const endDate = new Date('2025-06-22');
      
      const result = await service.getAvailableTimeSlots('facility-1', startDate, endDate);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      // A Sunday, which is closed according to facility hours
      expect(result.data?.[Object.keys(result.data)[0]]).toEqual([]);
    });
    
    it('should return error for non-existent facility', async () => {
      const startDate = new Date('2025-06-22');
      const endDate = new Date('2025-06-22');
      
      const result = await service.getAvailableTimeSlots('non-existent', startDate, endDate);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(ErrorType.NOT_FOUND);
    });
  });
});
