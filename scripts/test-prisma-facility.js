#!/usr/bin/env node

/**
 * Test script for Prisma implementation of Facility feature
 * This tests the Prisma client directly with basic CRUD operations
 */
import { PrismaClient as BasePrismaClient } from '@prisma/client';

// Initialize the prisma client
const prisma = new BasePrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🚀 Starting Prisma Facility test');
  
  try {
    // Clean up any existing test data
    await cleanup();
    
    // Create a test facility
    const facility = await createFacility();
    console.log('✅ Created facility:', facility.id);
    
    // Read the facility back
    const retrieved = await getFacility(facility.id);
    console.log('✅ Retrieved facility:', retrieved.name);
    
    // Update the facility
    const updated = await updateFacility(facility.id);
    console.log('✅ Updated facility capacity:', updated.capacity);
    
    // List all facilities
    const facilities = await listFacilities();
    console.log('✅ Found facilities:', facilities.length);
    
    // Delete the facility
    await deleteFacility(facility.id);
    console.log('✅ Deleted facility');
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await cleanup();
    await prisma.$disconnect();
  }
}

async function cleanup() {
  console.log('🧹 Cleaning test data...');
  await prisma.facility.deleteMany({
    where: {
      nameEn: { contains: 'Test Facility' }
    }
  });
}

async function createFacility() {
  return await prisma.facility.create({
    data: {
      nameEn: 'Test Facility EN',
      nameNo: 'Test Facility NO',
      description: {
        en: 'Test Description EN',
        no: 'Test Description NO'
      },
      type: 'hall',
      area: 'downtown',
      status: 'active',
      capacity: 100,
      pricePerHour: 500,
      timeSlotDuration: 1,
      accessibilityFeatures: ['wheelchair', 'hearing_loop'],
      allowedBookingTypes: ['private', 'public'],
      amenities: ['wifi', 'projector'],
      location: {
        latitude: 59.9138,
        longitude: 10.7522
      },
      openingHours: {
        monday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        tuesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        wednesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        thursday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        friday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
        saturday: { isOpen: false },
        sunday: { isOpen: false }
      }
    }
  });
}

async function getFacility(id) {
  return await prisma.facility.findUnique({
    where: { id }
  });
}

async function updateFacility(id) {
  return await prisma.facility.update({
    where: { id },
    data: {
      capacity: 150,
      pricePerHour: 600
    }
  });
}

async function listFacilities() {
  return await prisma.facility.findMany();
}

async function deleteFacility(id) {
  return await prisma.facility.delete({
    where: { id }
  });
}

main();
