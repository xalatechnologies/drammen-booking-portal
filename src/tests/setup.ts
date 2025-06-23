import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables for tests
vi.mock('@/utils/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.com',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  },
}));

// Mock global fetch
vi.stubGlobal('fetch', vi.fn());