// Jest setup file

// Set default timeout for tests (useful for database operations)
jest.setTimeout(30000);

// Mock global environment variables
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/drammen_booking?schema=public';
