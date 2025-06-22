/**
 * Booking Repository Integration Tests
 *
 * Tests BookingRepository with actual Prisma client implementation
 * following SOLID principles and clean architecture.
 */

import { BookingRepository } from '../implementations/BookingRepository';
import { PrismaClient } from '@/core/database/implementations/PrismaClient';
import { IDatabaseClient } from '@/core/database/interfaces/IDatabaseClient';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { Booking, BookingStatus, CreateBookingRequest } from '@/features/booking/types/booking';
import { IDatabaseConfig } from '@/core/database/config/DatabaseConfig';
import { FacilityRepository } from '@/features/facility/repositories/implementations/FacilityRepository';
import { CreateFacilityRequest, FacilityStatus } from '@/features/facility/types/facility';

// Setup test database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/drammen_booking?schema=public';

// Real localization service mock (implements full interface)
class TestLocalizationService implements ILocalizationService {
  translate(key: string, params?: Record<string, any>): string {
    if (key === 'errors:bookingNotFound') {
      return `Booking with ID ${params?.id} not found`;
    }
    if (key === 'errors:bookingUpdateFailed') {
      return `Failed to update booking with ID ${params?.id}`;
    }
    if (key === 'errors:bookingDeleteFailed') {
      return `Failed to delete booking with ID ${params?.id}`;
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
let bookingRepository: BookingRepository;
let facilityRepository: FacilityRepository;
let localizationService: ILocalizationService;
let createdFacilityId: string;
let createdBookingId: string;
let testUserId: string = 'test-user-id'; // Mock user ID for testing

// Test facility data
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

// Setup and teardown functions
beforeAll(async () => {
  // Create repositories with real database client
  localizationService = new TestLocalizationService();
  bookingRepository = new BookingRepository(databaseClient, localizationService);
  facilityRepository = new FacilityRepository(databaseClient, localizationService);
  
  // Clean up any existing test data
  await cleanupTestData();
  
  // Create test facility
  const facilityResult = await facilityRepository.createFacility(testFacility);
  if (facilityResult.isSuccess && facilityResult.value) {
    createdFacilityId = facilityResult.value.id;
  } else {
    throw new Error('Failed to create test facility');
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
    // Delete test data in reverse order of dependencies using Prisma methods
    await (databaseClient as any).prisma.booking.deleteMany({
      where: {
        description: {
          contains: 'Integration Test'
        }
      }
    });
    
    await (databaseClient as any).prisma.facility.deleteMany({
      where: {
        nameEn: {
          contains: 'Integration Test'
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

describe('BookingRepository Integration Tests', () => {
  describe('createBooking', () => {
    it('should create a new booking in the database', async () => {
      // Set up start and end times for booking
      const startTime = new Date();
      startTime.setHours(10, 0, 0, 0); // 10:00 AM
      
      const endTime = new Date(startTime);
      endTime.setHours(12, 0, 0, 0); // 12:00 PM
      
      const testBooking: CreateBookingRequest = {
        facilityId: createdFacilityId,
        userId: testUserId,
        startTime,
        endTime,
        purpose: 'Integration Test'
      };
      
      const result = await bookingRepository.createBooking(testBooking);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.id).toBeDefined();
      expect(result.value?.facilityId).toBe(createdFacilityId);
      expect(result.value?.userId).toBe(testUserId);
      expect(new Date(result.value!.startTime).getHours()).toBe(10);
      expect(new Date(result.value!.endTime).getHours()).toBe(12);
      
      // Store ID for later tests
      createdBookingId = result.value!.id;
    });
    
    it('should not allow overlapping bookings', async () => {
      // Create booking that overlaps with existing booking
      const startTime = new Date();
      startTime.setHours(11, 0, 0, 0); // 11:00 AM (overlaps with existing 10:00-12:00)
      
      const endTime = new Date(startTime);
      endTime.setHours(13, 0, 0, 0); // 1:00 PM
      
      const overlappingBooking: CreateBookingRequest = {
        facilityId: createdFacilityId,
        userId: testUserId,
        startTime,
        endTime,
        purpose: 'Overlapping Test'
      };
      
      const result = await bookingRepository.createBooking(overlappingBooking);
      
      // Should fail because of overlap
      expect(result.isSuccess).toBe(false);
    });
  });
  
  describe('getBookingById', () => {
    it('should retrieve a booking by ID', async () => {
      const result = await bookingRepository.getBookingById(createdBookingId);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.id).toBe(createdBookingId);
      expect(result.value?.facilityId).toBe(createdFacilityId);
      expect(result.value?.purpose).toBe('Integration Test');
    });
    
    it('should return an error when booking is not found', async () => {
      const result = await bookingRepository.getBookingById('non-existent-id');
      
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Booking with ID non-existent-id not found');
    });
  });
  
  describe('updateBooking', () => {
    it('should update an existing booking', async () => {
      const updateData = {
        purpose: 'Updated Test',
        attendees: 25
      };
      
      const result = await bookingRepository.updateBooking(createdBookingId, updateData);
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.value?.purpose).toBe('Updated Test');
      expect(result.value?.attendees).toBe(25);
    });
    
    it('should not allow updates that create conflicts', async () => {
      // First create another non-conflicting booking
      const startTime = new Date();
      startTime.setHours(14, 0, 0, 0); // 2:00 PM
      
      const endTime = new Date(startTime);
      endTime.setHours(16, 0, 0, 0); // 4:00 PM
      
      const anotherBookingRequest: CreateBookingRequest = {
        facilityId: createdFacilityId,
        userId: testUserId,
        startTime,
        endTime,
        purpose: 'Another Test Booking'
      };
      
      const createResult = await bookingRepository.createBooking(anotherBookingRequest);
      expect(createResult.success).toBe(true);
      
      // Try to update this booking to conflict with the first booking
      const conflictStartTime = new Date();
      conflictStartTime.setHours(11, 0, 0, 0); // 11:00 AM (conflicts with first booking)
      
      const conflictEndTime = new Date(conflictStartTime);
      conflictEndTime.setHours(13, 0, 0, 0); // 1:00 PM
      
      const updateResult = await bookingRepository.updateBooking(createResult.value?.id, {
        startTime: conflictStartTime,
        endTime: conflictEndTime
      });
      
      // Should fail due to conflict
      expect(updateResult.isSuccess).toBe(false);
    });
  });
  
  describe('getAllBookings', () => {
    it('should retrieve all bookings matching filters', async () => {
      // Test with no filters
      const allResult = await bookingRepository.getAllBookings({});
      expect(allResult.isSuccess).toBe(true);
      expect(allResult.value?.length).toBeGreaterThanOrEqual(2); // At least our 2 test bookings
      
      // Test with facility filter
      const facilityResult = await bookingRepository.getAllBookings({ facilityId: createdFacilityId });
      expect(facilityResult.success).toBe(true);
      expect(facilityResult.data?.length).toBeGreaterThanOrEqual(2);
      expect(facilityResult.data?.every(b => b.facilityId === createdFacilityId)).toBe(true);
      
      // Test with user filter
      const userResult = await bookingRepository.getAllBookings({ userId: testUserId });
      expect(userResult.isSuccess).toBe(true);
      expect(userResult.value?.every(b => b.userId === testUserId)).toBe(true);
      
      // Test with status filter
      const statusResult = await bookingRepository.getAllBookings({ status: BookingStatus.PENDING });
      expect(statusResult.success).toBe(true);
      expect(statusResult.data?.every(b => b.status === BookingStatus.PENDING)).toBe(true);
    });
  });
  
  describe('deleteFacility', () => {
    it('should delete an existing booking', async () => {
      const result = await bookingRepository.deleteBooking(createdBookingId);
      
      expect(result.isSuccess).toBe(true);
      
      // Verify booking is deleted
      const checkResult = await bookingRepository.getBookingById(createdBookingId);
      expect(checkResult.isSuccess).toBe(false);
    });
  });
});
