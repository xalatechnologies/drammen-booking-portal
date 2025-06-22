/**
 * Facility Repository Integration Tests
 *
 * Tests FacilityRepository with actual Prisma client implementation
 * following SOLID principles and clean architecture.
 */

import { FacilityRepository } from '../implementations/FacilityRepository';
import { PrismaClient } from '@/core/database/implementations/PrismaClient';
import { IDatabaseClient } from '@/core/database/interfaces/IDatabaseClient';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { Facility, FacilityFilters, FacilityStatus, CreateFacilityRequest } from '@/features/facility/types/facility';
import { IDatabaseConfig } from '@/core/database/config/DatabaseConfig';

// Setup test database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/drammen_booking?schema=public';

// Real localization service mock (implements full interface)
class TestLocalizationService implements ILocalizationService {
  translate(key: string, params?: Record<string, any>): string {
    if (key === 'errors.facility.notFound') {
      return `Facility with ID ${params?.id} not found`;
    }
    if (key === 'errors.facility.updateFailed') {
      return `Failed to update facility with ID ${params?.id}`;
    }
    if (key === 'errors.facility.deleteFailed') {
      return `Failed to delete facility with ID ${params?.id}`;
    }
    if (key === 'errors.facility.createFailed') {
      return 'Failed to create facility';
    }
    return key;
  }
  
  setLanguage(language: string): void {
    // Not needed for testing
  }
  
  hasTranslation(key: string): boolean {
    return true; // Always return true for testing
  }
  
  getNamespace(namespace: string): Record<string, any> {
    return {}; // Empty object for testing
  }
  
  changeLanguage(language: string): void {
    // Not needed for testing
  }
  
  getLanguage(): string {
    return 'en'; // Default to English for testing
  }
  
  getCurrentLanguage(): string {
    return 'en'; // Default to English for testing
  }
  
  getAvailableLanguages(): string[] {
    return ['en', 'no']; // Available languages for testing
  }
}

// Test configuration
const config: IDatabaseConfig = {
  getDatabaseUrl: () => DATABASE_URL,
  getProvider: () => 'prisma',
  getEnableLogging: () => true
};

// Create a new PrismaClient instance for testing
// Using type assertion to handle constructor pattern
const databaseClient = new PrismaClient();

// Test data
const testFacility: CreateFacilityRequest = {
  name: {
    EN: 'Integration Test Facility',
    NO: 'Integrasjonstest Anlegg'
  },
  description: {
    EN: 'Test Description EN',
    NO: 'Test Beskrivelse NO'
  },
  type: 'integration_test',
  area: 'test_area',
  status: FacilityStatus.ACTIVE,
  capacity: 50,
  pricePerHour: 300,
  accessibilityFeatures: ['test_feature'],
  allowedBookingTypes: ['test_booking'],
  amenities: ['test_amenity']
};

// Global variables for test state
let repository: FacilityRepository;
let localizationService: ILocalizationService;
let createdFacilityId: string;

// Setup and teardown functions for the entire test suite
beforeAll(async () => {
  // Create repository with real database client
  localizationService = new TestLocalizationService();
  repository = new FacilityRepository(databaseClient, localizationService);
  
  // Clean up any existing test data
  await cleanupTestData();
  
  // Create a test facility that all tests can use
  const createResult = await repository.createFacility(testFacility);
  if (createResult.isSuccess && createResult.value) {
    createdFacilityId = createResult.value.id;
    console.log(`Created test facility with ID: ${createdFacilityId}`);
  } else {
    console.error('Failed to create test facility:', createResult.error);
  }
});

afterAll(async () => {
  // Clean up test data
  await cleanupTestData();
  
  // Close database connection
  await (databaseClient as PrismaClient).disconnect?.();
});

async function cleanupTestData() {
  try {
    console.log('Cleaning up test facilities...');
    // Access the Prisma client directly with the proper model name
    // Note: In Prisma, model names are typically PascalCase in client access
    await (databaseClient as any).prisma.facility.deleteMany({
      where: {
        type: 'integration_test'
      }
    });
    console.log('Test cleanup complete');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

describe('FacilityRepository Integration Tests', () => {
  // Tests follow the Single Responsibility Principle by focusing on one aspect of functionality each
  describe('createFacility', () => {
    it('should create a new facility in the database', async () => {
      // This test doesn't rely on the facility created in beforeAll - it creates its own
      const newTestFacility = {
        ...testFacility,
        name: {
          EN: 'Create Test Facility',
          NO: 'Opprett Test Anlegg'
        }
      };
      
      const result = await repository.createFacility(newTestFacility);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.id).toBeDefined();
      expect(result.value?.name.EN).toBe('Create Test Facility');
    });
  });
  
  describe('getFacilityById', () => {
    it('should retrieve a facility by ID', async () => {
      // Create a new facility specifically for this test
      const facilityForGet = {
        ...testFacility,
        name: {
          EN: 'Get Test Facility',
          NO: 'Hent Test Anlegg'
        }
      };
      
      const createResult = await repository.createFacility(facilityForGet);
      expect(createResult.isSuccess).toBe(true);
      expect(createResult.value).toBeDefined();
      const facilityId = createResult.value!.id;
      
      const result = await repository.getFacilityById(facilityId);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.id).toBe(facilityId);
      expect(result.value?.name.EN).toBe('Get Test Facility');
    });
    
    it('should return an error when facility is not found', async () => {
      const result = await repository.getFacilityById('non-existent-id');
      
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Facility with ID non-existent-id not found');
    });
  });
  
  describe('updateFacility', () => {
    it('should update an existing facility', async () => {
      // Create a new facility specifically for the update test
      const facilityForUpdate = {
        ...testFacility,
        name: {
          EN: 'Update Test Facility',
          NO: 'Oppdater Test Anlegg'
        },
        capacity: 50
      };
      
      const createResult = await repository.createFacility(facilityForUpdate);
      expect(createResult.isSuccess).toBe(true);
      expect(createResult.value).toBeDefined();
      const facilityId = createResult.value!.id;
      
      const updateData = {
        capacity: 150,
        pricePerHour: 600
      };
      
      const result = await repository.updateFacility(facilityId, updateData);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.capacity).toBe(150);
      expect(result.value?.pricePerHour).toBe(600);
    });
  });
  
  describe('getAllFacilities', () => {
    it('should retrieve all facilities matching filters', async () => {
      // Create two new facilities specifically for this test
      const firstFacility = {
        ...testFacility,
        name: {
          EN: 'Filter Test Facility 1',
          NO: 'Filter Test Anlegg 1'
        }
      };
      
      const secondFacility = {
        ...testFacility,
        name: {
          EN: 'Filter Test Facility 2',
          NO: 'Filter Test Anlegg 2'
        }
      };
      
      // Create both facilities for this specific test
      await repository.createFacility(firstFacility);
      await repository.createFacility(secondFacility);
      
      // Test retrieval of all facilities
      const allResult = await repository.getAllFacilities({
        types: ['integration_test']
      });
      
      expect(allResult.isSuccess).toBe(true);
      expect(allResult.value?.length).toBeGreaterThanOrEqual(2);
      
      // Test with name filter
      const nameFilter: FacilityFilters = {
        name: 'Filter'
      };
      const filteredResult = await repository.getAllFacilities(nameFilter);
      expect(filteredResult.isSuccess).toBe(true);
      expect(filteredResult.value?.length).toBeGreaterThanOrEqual(2);
      expect(filteredResult.value?.[0].name.EN).toContain('Filter');
    });
  });
  
  describe('deleteFacility', () => {
    it('should delete an existing facility', async () => {
      // Create a new facility specifically for the delete test
      const facilityForDeletion = {
        ...testFacility,
        name: {
          EN: 'Delete Test Facility',
          NO: 'Slett Test Anlegg'
        }
      };
      
      const createResult = await repository.createFacility(facilityForDeletion);
      expect(createResult.isSuccess).toBe(true);
      expect(createResult.value).toBeDefined();
      const facilityId = createResult.value!.id;
      
      const result = await repository.deleteFacility(facilityId);
      
      expect(result.isSuccess).toBe(true);
      
      // Verify facility is deleted
      const checkResult = await repository.getFacilityById(facilityId);
      expect(checkResult.isSuccess).toBe(false);
    });
  });
});
