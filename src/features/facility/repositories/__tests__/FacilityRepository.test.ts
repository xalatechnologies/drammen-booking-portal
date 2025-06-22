/**
 * Facility Repository Tests
 * 
 * Tests for the FacilityRepository implementation to validate
 * SOLID principles and proper functionality.
 */

import { FacilityRepository } from '../implementations/FacilityRepository';
import { IDatabaseClient } from '@/core/database/interfaces/IDatabaseClient';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { Facility, FacilityFilters, FacilityStatus } from '@/features/facility/types/facility';
import { ErrorType } from '@/core/utils/error-handling';

// Mock database client for testing
class MockDatabaseClient implements IDatabaseClient {
  private facilities: Record<string, any> = {
    'facility-1': {
      id: 'facility-1',
      name: { 
        EN: 'Main Hall', 
        NO: 'Hovedhall' 
      },
      type: 'hall',
      area: 'downtown',
      status: FacilityStatus.ACTIVE,
      capacity: 100,
      pricePerHour: 500,
      accessibility_features: ['wheelchair', 'hearing_loop'],
      allowed_booking_types: ['private', 'public'],
      amenities: ['wifi', 'projector']
    },
    'facility-2': {
      id: 'facility-2',
      name: { 
        EN: 'Meeting Room A', 
        NO: 'Møterom A' 
      },
      type: 'meeting_room',
      area: 'downtown',
      status: FacilityStatus.ACTIVE,
      capacity: 20,
      pricePerHour: 200,
      accessibility_features: ['wheelchair'],
      allowed_booking_types: ['private'],
      amenities: ['wifi', 'whiteboard']
    }
  };
  
  async getById<T>(table: string, id: string): Promise<T | null> {
    if (table === 'facilities' && this.facilities[id]) {
      return this.facilities[id] as unknown as T;
    }
    return null;
  }
  
  async getMany<T>(table: string, options?: any): Promise<T[]> {
    if (table !== 'facilities') return [];
    
    // Filter facilities based on the provided options
    let results = Object.values(this.facilities);
    
    if (options?.filters) {
      // Apply filters
      Object.entries(options.filters).forEach(([key, value]) => {
        if (key.includes(':')) {
          const [operator, field] = key.split(':', 2);
          
          switch (operator) {
            case 'eq':
              results = results.filter(item => item[field] === value);
              break;
            case 'gte':
              results = results.filter(item => item[field] >= value);
              break;
            case 'lte':
              results = results.filter(item => item[field] <= value);
              break;
            case 'in':
              results = results.filter(item => (value as any[]).includes(item[field]));
              break;
            case 'contains':
              results = results.filter(item => {
                if (Array.isArray(item[field]) && Array.isArray(value)) {
                  return value.every(v => item[field].includes(v));
                }
                return false;
              });
              break;
            case 'multilingual':
              if (field === 'name') {
                const searchTerm = value as string;
                results = results.filter(item => 
                  item.name.NO?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.name.EN?.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }
              break;
          }
        }
      });
    }
    
    return results as unknown as T[];
  }
  
  async insert<T>(table: string, data: Partial<T>): Promise<T> {
    const id = `facility-${Object.keys(this.facilities).length + 1}`;
    const newFacility = { id, ...data };
    this.facilities[id] = newFacility;
    return newFacility as unknown as T;
  }
  
  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    if (!this.facilities[id]) {
      throw new Error(`Facility with ID ${id} not found`);
    }
    
    this.facilities[id] = {
      ...this.facilities[id],
      ...data
    };
    
    return this.facilities[id] as unknown as T;
  }
  
  async delete(table: string, id: string): Promise<boolean> {
    if (!this.facilities[id]) {
      return false;
    }
    
    delete this.facilities[id];
    return true;
  }
  
  async executeQuery<T>(query: string | object): Promise<T[]> {
    // Not implemented for this mock
    return [] as unknown as T[];
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
    return key;
  }

  setLanguage(language: string): void {
    // Not needed for mock
  }
  
  hasTranslation(key: string): boolean {
    return true; // Always return true for testing
  }
  
  getNamespace(namespace: string): Record<string, any> {
    return {}; // Empty object for testing
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

describe('FacilityRepository', () => {
  let repository: FacilityRepository;
  let databaseClient: IDatabaseClient;
  let localizationService: ILocalizationService;
  
  beforeEach(() => {
    databaseClient = new MockDatabaseClient();
    localizationService = new MockLocalizationService();
    repository = new FacilityRepository(databaseClient, localizationService);
  });
  
  describe('getFacilityById', () => {
    it('should return a facility when it exists', async () => {
      const result = await repository.getFacilityById('facility-1');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('facility-1');
    });
    
    it('should return an error when facility does not exist', async () => {
      const result = await repository.getFacilityById('non-existent');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(ErrorType.NOT_FOUND);
      expect(result.error?.message).toContain('Facility with ID non-existent not found');
    });
  });
  
  describe('getAllFacilities', () => {
    it('should return all facilities when no filters are provided', async () => {
      const result = await repository.getAllFacilities();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.length).toBe(2);
    });
    
    it('should filter facilities by type', async () => {
      const filters: FacilityFilters = {
        types: ['meeting_room']
      };
      
      const result = await repository.getAllFacilities(filters);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].type).toBe('meeting_room');
    });
    
    it('should filter facilities by minimum capacity', async () => {
      const filters: FacilityFilters = {
        minCapacity: 50
      };
      
      const result = await repository.getAllFacilities(filters);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].id).toBe('facility-1');
    });
    
    it('should filter facilities by amenities', async () => {
      const filters: FacilityFilters = {
        amenities: ['whiteboard']
      };
      
      const result = await repository.getAllFacilities(filters);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].id).toBe('facility-2');
    });
  });
  
  describe('createFacility', () => {
    it('should create a new facility', async () => {
      const newFacility = {
        name: {
          EN: 'Conference Room',
          NO: 'Konferanserom'
        },
        type: 'conference',
        area: 'suburban',
        status: FacilityStatus.ACTIVE,
        capacity: 50,
        pricePerHour: 300,
        accessibility_features: ['wheelchair'],
        allowed_booking_types: ['private', 'public'],
        amenities: ['wifi', 'projector', 'catering']
      };
      
      const result = await repository.createFacility(newFacility);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBeDefined();
      expect(result.data?.name.EN).toBe('Conference Room');
    });
  });
  
  describe('updateFacility', () => {
    it('should update an existing facility', async () => {
      const updateData = {
        capacity: 150,
        pricePerHour: 600
      };
      
      const result = await repository.updateFacility('facility-1', updateData);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.capacity).toBe(150);
      expect(result.data?.pricePerHour).toBe(600);
    });
    
    it('should return an error when trying to update a non-existent facility', async () => {
      const updateData = {
        capacity: 150
      };
      
      const result = await repository.updateFacility('non-existent', updateData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Failed to update facility with ID non-existent');
    });
  });
  
  describe('deleteFacility', () => {
    it('should delete an existing facility', async () => {
      const result = await repository.deleteFacility('facility-1');
      
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      
      // Verify the facility is no longer retrievable
      const getResult = await repository.getFacilityById('facility-1');
      expect(getResult.success).toBe(false);
    });
  });
});
