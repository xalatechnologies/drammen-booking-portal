/**
 * User Repository Integration Tests
 *
 * Tests UserRepository with actual Prisma client implementation
 * following SOLID principles and clean architecture.
 */

import { UserRepository } from '../implementations/UserRepository';
import { PrismaClient } from '@/core/database/implementations/PrismaClient';
import { IDatabaseClient } from '@/core/database/interfaces/IDatabaseClient';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { UserProfile, CreateUserProfileRequest, UserPreferences } from '@/features/user/types/user';
import { IDatabaseConfig } from '@/core/database/config/DatabaseConfig';

// Setup test database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/drammen_booking?schema=public';

// Real localization service mock (implements full interface)
class TestLocalizationService implements ILocalizationService {
  translate(key: string, params?: Record<string, any>): string {
    if (key === 'errors:userProfileNotFound') {
      return `User profile with ID ${params?.id} not found`;
    }
    if (key === 'errors:userProfileNotFoundByUserId') {
      return `User profile with user ID ${params?.userId} not found`;
    }
    if (key === 'errors:userProfileUpdateFailed') {
      return `Failed to update user profile with ID ${params?.id}`;
    }
    if (key === 'errors:userProfileDeleteFailed') {
      return `Failed to delete user profile with ID ${params?.id}`;
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

// Global variables for test state
let repository: UserRepository;
let localizationService: ILocalizationService;
let createdUserProfileId: string;
const testUserId = `test-user-${Date.now()}`; // Unique ID for testing

// Test user preferences
const testPreferences: UserPreferences = {
  language: 'EN',
  notifications: {
    email: true,
    sms: false,
    pushNotifications: true
  },
  accessibility: ['larger-text'],
  theme: 'light'
};

// Test user profile data
const testUserProfile: CreateUserProfileRequest = {
  userId: testUserId,
  firstName: 'Integration',
  lastName: 'Test',
  email: `integration.test.${Date.now()}@example.com`,
  phoneNumber: '+4712345678',
  preferences: testPreferences
};

// Setup and teardown functions
beforeAll(async () => {
  // Create repository with real database client
  localizationService = new TestLocalizationService();
  repository = new UserRepository(databaseClient, localizationService);
  
  // Clean up any existing test data
  await cleanupTestData();
});

afterAll(async () => {
  // Clean up test data
  await cleanupTestData();
  
  // Close database connection
  await (databaseClient as PrismaClient).disconnect?.();
});

async function cleanupTestData() {
  try {
    // Use Prisma methods instead of raw SQL for reliable cleanup
    await (databaseClient as any).prisma.userProfile.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

describe('UserRepository Integration Tests', () => {
  describe('createUserProfile', () => {
    it('should create a new user profile in the database', async () => {
      const result = await repository.createUserProfile(testUserProfile);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.id).toBeDefined();
      expect(result.value?.userId).toBe(testUserId);
      expect(result.value?.firstName).toBe('Integration');
      expect(result.value?.lastName).toBe('Test');
      expect(result.value?.email).toBe(testUserProfile.email);
      expect(result.value?.preferences?.language).toBe('EN');
      
      // Store ID for later tests
      createdUserProfileId = result.value!.id;
    });
    
    it('should not allow duplicate user IDs', async () => {
      // Try to create another user with the same userId
      const duplicateUser: CreateUserProfileRequest = {
        userId: testUserId, // Same userId
        firstName: 'Duplicate',
        lastName: 'User',
        email: `duplicate.${Date.now()}@example.com`
      };
      
      // This should fail due to unique constraint on userId
      const result = await repository.createUserProfile(duplicateUser);
      expect(result.isSuccess).toBe(false);
    });
    
    it('should not allow duplicate emails', async () => {
      // Try to create another user with the same email
      const duplicateEmail: CreateUserProfileRequest = {
        userId: `different-user-${Date.now()}`,
        firstName: 'Different',
        lastName: 'User',
        email: testUserProfile.email // Same email
      };
      
      // This should fail due to unique constraint on email
      const result = await repository.createUserProfile(duplicateEmail);
      expect(result.isSuccess).toBe(false);
    });
  });
  
  describe('getUserProfileById', () => {
    it('should retrieve a user profile by ID', async () => {
      const result = await repository.getUserProfileById(createdUserProfileId);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.id).toBe(createdUserProfileId);
      expect(result.value?.firstName).toBe('Integration');
      expect(result.value?.lastName).toBe('Test');
    });
    
    it('should return an error when user profile is not found', async () => {
      const result = await repository.getUserProfileById('non-existent-id');
      
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('User profile with ID non-existent-id not found');
    });
  });
  
  describe('getUserProfileByUserId', () => {
    it('should retrieve a user profile by user ID', async () => {
      const result = await repository.getUserProfileByUserId(testUserId);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.userId).toBe(testUserId);
      expect(result.value?.firstName).toBe('Integration');
      expect(result.value?.lastName).toBe('Test');
    });
    
    it('should return an error when user profile is not found by user ID', async () => {
      const result = await repository.getUserProfileByUserId('non-existent-user-id');
      
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('User profile with user ID non-existent-user-id not found');
    });
  });
  
  describe('updateUserProfile', () => {
    it('should update an existing user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Profile',
        preferences: {
          theme: 'dark' as 'dark' // Type assertion to ensure correct literal type
        }
      };
      
      const result = await repository.updateUserProfile(createdUserProfileId, updateData);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.firstName).toBe('Updated');
      expect(result.value?.lastName).toBe('Profile');
      expect(result.value?.preferences?.theme).toBe('dark');
      // Should preserve other preferences
      expect(result.value?.preferences?.language).toBe('EN');
    });
  });
  
  describe('getAllUserProfiles', () => {
    it('should retrieve all user profiles matching filters', async () => {
      // Create a second user profile for filtering tests
      const secondUser: CreateUserProfileRequest = {
        userId: `second-user-${Date.now()}`,
        firstName: 'Second',
        lastName: 'Integration',
        email: `second.integration.${Date.now()}@example.com`
      };
      
      await repository.createUserProfile(secondUser);
      
      // Test with no filters
      const allResult = await repository.getAllUserProfiles({});
      expect(allResult.isSuccess).toBe(true);
      expect(allResult.value?.length).toBeGreaterThanOrEqual(2);
      
      // Test with email filter
      const emailFilter = { email: 'integration.test' };
      const emailResult = await repository.getAllUserProfiles(emailFilter);
      expect(emailResult.isSuccess).toBe(true);
      expect(emailResult.value?.some(u => u.email.includes('integration.test'))).toBe(true);
      
      // Test with name filter
      const nameFilter = { name: 'Integration' };
      const nameResult = await repository.getAllUserProfiles(nameFilter);
      expect(nameResult.isSuccess).toBe(true);
      // Should match both users with 'Integration' in first or last name
      expect(nameResult.value?.length).toBeGreaterThanOrEqual(2);
    });
  });
  
  describe('deleteUserProfile', () => {
    it('should delete an existing user profile', async () => {
      const result = await repository.deleteUserProfile(createdUserProfileId);
      
      expect(result.isSuccess).toBe(true);
      
      // Verify user profile is deleted
      const checkResult = await repository.getUserProfileById(createdUserProfileId);
      expect(checkResult.isSuccess).toBe(false);
    });
  });
});
