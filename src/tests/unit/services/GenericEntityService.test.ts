import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenericEntityService } from '@/services/GenericEntityService';
import { GenericEntityRepository } from '@/repositories/GenericEntityRepository';

// Mock the repository
vi.mock('@/repositories/GenericEntityRepository', () => {
  return {
    GenericEntityRepository: vi.fn().mockImplementation(() => ({
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  };
});

// Define test types
interface TestEntity {
  id: string;
  name: string;
  description?: string;
  status?: string;
}

describe('GenericEntityService', () => {
  let service: GenericEntityService<TestEntity>;
  let mockRepository: {
    findAll: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Create a new service instance before each test
    service = new GenericEntityService<TestEntity>('test_table', {
      related: ['related_table'],
      idField: 'id',
      statusField: 'status',
      activeValue: 'active',
    });
    
    // Get the mocked repository instance
    mockRepository = (GenericEntityRepository as unknown as ReturnType<typeof vi.fn>).mock.results[0].value;
  });
  
  describe('getList', () => {
    it('should call repository.findAll with correct parameters', async () => {
      // Arrange
      const mockResponse = { data: [{ id: '1', name: 'Test Entity' }] };
      mockRepository.findAll.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await service.getList({
        page: 2,
        limit: 20,
        orderBy: 'name',
        orderDirection: 'desc',
        includeInactive: true,
        search: 'test',
      });
      
      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepository.findAll).toHaveBeenCalledWith(
        { page: 2, limit: 20 },
        expect.objectContaining({
          orderBy: 'name',
          orderDirection: 'desc',
          includeInactive: true,
          search: 'test',
        })
      );
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle pagination parameters correctly', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValueOnce({ data: [] });
      
      // Act
      await service.getList({ page: 1 });
      
      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        expect.any(Object)
      );
    });
    
    it('should handle undefined pagination correctly', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValueOnce({ data: [] });
      
      // Act
      await service.getList({ search: 'test' });
      
      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ search: 'test' })
      );
    });
  });
  
  describe('getById', () => {
    it('should call repository.findById with correct ID', async () => {
      // Arrange
      const mockEntity = { id: '1', name: 'Test Entity' };
      mockRepository.findById.mockResolvedValueOnce({ data: mockEntity });
      
      // Act
      const result = await service.getById('1');
      
      // Assert
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: mockEntity });
    });
  });
  
  describe('create', () => {
    it('should call repository.create with correct data', async () => {
      // Arrange
      const newEntity = { name: 'New Entity' };
      const createdEntity = { id: '1', name: 'New Entity' };
      mockRepository.create.mockResolvedValueOnce({ data: createdEntity });
      
      // Act
      const result = await service.create(newEntity);
      
      // Assert
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(newEntity);
      expect(result).toEqual({ data: createdEntity });
    });
  });
  
  describe('update', () => {
    it('should call repository.update with correct ID and data', async () => {
      // Arrange
      const updateData = { name: 'Updated Entity' };
      const updatedEntity = { id: '1', name: 'Updated Entity' };
      mockRepository.update.mockResolvedValueOnce({ data: updatedEntity });
      
      // Act
      const result = await service.update('1', updateData);
      
      // Assert
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual({ data: updatedEntity });
    });
  });
  
  describe('delete', () => {
    it('should call repository.delete with correct ID', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValueOnce({ data: true });
      
      // Act
      const result = await service.delete('1');
      
      // Assert
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ data: true });
    });
  });
});
