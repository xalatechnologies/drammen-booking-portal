import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GenericEntityRepository } from '@/repositories/GenericEntityRepository';

// Mock global fetch
const mockFetch = vi.fn();

// Mock process.env directly for the repository
vi.stubGlobal('process', {
  ...process,
  env: {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.com'
  }
});

// Define test types
interface TestEntity {
  id: string;
  name: string;
  description?: string;
  status?: string;
}

describe('GenericEntityRepository', () => {
  let repository: GenericEntityRepository<TestEntity>;
  
  beforeEach(() => {
    // Create a new repository instance before each test
    repository = new GenericEntityRepository<TestEntity>('test_table', {
      related: ['related_table'],
      idField: 'id',
      statusField: 'status',
      activeValue: 'active',
    });
    
    // Reset mock between tests
    mockFetch.mockReset();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('findAll', () => {
    it('should fetch all entities with correct parameters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Test Entity 1' },
          { id: '2', name: 'Test Entity 2' },
        ],
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      
      // Act
      const result = await repository.findAll(
        { page: 1, limit: 10 },
        { orderBy: 'name', orderDirection: 'asc' }
      );
      
      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toContain('https://example.com/functions/v1/generic-entity');
      expect(mockFetch.mock.calls[0][0]).toContain('table=test_table');
      expect(mockFetch.mock.calls[0][0]).toContain('related=related_table');
      expect(mockFetch.mock.calls[0][0]).toContain('page=1');
      expect(mockFetch.mock.calls[0][0]).toContain('limit=10');
      expect(mockFetch.mock.calls[0][0]).toContain('orderBy=name');
      expect(mockFetch.mock.calls[0][0]).toContain('orderDirection=asc');
      expect(result.data).toEqual(mockResponse.data);
      expect(result.error).toBeUndefined();
    });
    
    it('should handle fetch errors', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });
      
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Error fetching entities');
    });
    
    it('should handle JSON parsing errors', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
      });
      
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Error parsing response');
    });
  });
  
  describe('findById', () => {
    it('should fetch a single entity by ID', async () => {
      // Arrange
      const mockEntity = { id: '1', name: 'Test Entity' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntity,
      });
      
      // Act
      const result = await repository.findById('1');
      
      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toContain('https://example.com/functions/v1/generic-entity');
      expect(mockFetch.mock.calls[0][0]).toContain('table=test_table');
      expect(mockFetch.mock.calls[0][0]).toContain('id=1');
      expect(result.data).toEqual(mockEntity);
      expect(result.error).toBeUndefined();
    });
  });
  
  describe('create', () => {
    it('should create a new entity', async () => {
      // Arrange
      const newEntity = { name: 'New Entity' };
      const createdEntity = { id: '3', name: 'New Entity' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdEntity,
      });
      
      // Act
      const result = await repository.create(newEntity);
      
      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toContain('https://example.com/functions/v1/generic-entity');
      expect(mockFetch.mock.calls[0][1]).toEqual(expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          table: 'test_table',
          data: newEntity,
        }),
      }));
      expect(result.data).toEqual(createdEntity);
      expect(result.error).toBeUndefined();
    });
  });
  
  describe('update', () => {
    it('should update an existing entity', async () => {
      // Arrange
      const updateData = { name: 'Updated Entity' };
      const updatedEntity = { id: '1', name: 'Updated Entity' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedEntity,
      });
      
      // Act
      const result = await repository.update('1', updateData);
      
      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toContain('https://example.com/functions/v1/generic-entity');
      expect(mockFetch.mock.calls[0][1]).toEqual(expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          table: 'test_table',
          id: '1',
          data: updateData,
        }),
      }));
      expect(result.data).toEqual(updatedEntity);
      expect(result.error).toBeUndefined();
    });
  });
  
  describe('delete', () => {
    it('should delete an entity', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      // Act
      const result = await repository.delete('1');
      
      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toContain('https://example.com/functions/v1/generic-entity');
      expect(mockFetch.mock.calls[0][1]).toEqual(expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          table: 'test_table',
          id: '1',
        }),
      }));
      expect(result.data).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
