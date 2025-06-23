import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGenericEntityStore } from '@/stores/createGenericEntityStore';
import { GenericEntityService } from '@/services/GenericEntityService';
import { act } from '@testing-library/react';

// Mock the service
vi.mock('@/services/GenericEntityService', () => {
  return {
    GenericEntityService: vi.fn().mockImplementation(() => ({
      getList: vi.fn(),
      getById: vi.fn(),
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

describe('createGenericEntityStore', () => {
  let useStore: ReturnType<typeof createGenericEntityStore<TestEntity>>;
  let mockService: {
    getList: ReturnType<typeof vi.fn>;
    getById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Create a new store instance before each test
    useStore = createGenericEntityStore<TestEntity>('test_table', {
      related: ['related_table'],
      idField: 'id',
      statusField: 'status',
      activeValue: 'active',
    });
    
    // Get the mocked service instance
    mockService = (GenericEntityService as unknown as ReturnType<typeof vi.fn>).mock.results[0].value;
  });
  
  describe('fetchList', () => {
    it('should update items state when successful', async () => {
      // Arrange
      const mockEntities = [
        { id: '1', name: 'Test Entity 1' },
        { id: '2', name: 'Test Entity 2' },
      ];
      mockService.getList.mockResolvedValueOnce({ data: mockEntities });
      
      // Act
      let store = useStore.getState();
      await act(async () => {
        await store.fetchList({ page: 1, limit: 10 });
      });
      
      // Assert
      store = useStore.getState();
      expect(mockService.getList).toHaveBeenCalledTimes(1);
      expect(mockService.getList).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(store.items).toEqual(mockEntities);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
    
    it('should update error state when unsuccessful', async () => {
      // Arrange
      mockService.getList.mockResolvedValueOnce({ error: 'Failed to fetch items' });
      
      // Act
      let store = useStore.getState();
      await act(async () => {
        await store.fetchList();
      });
      
      // Assert
      store = useStore.getState();
      expect(store.error).toBe('Failed to fetch items');
      expect(store.isLoading).toBe(false);
    });
    
    it('should handle exceptions', async () => {
      // Arrange
      mockService.getList.mockRejectedValueOnce(new Error('Network error'));
      
      // Act
      let store = useStore.getState();
      await act(async () => {
        await store.fetchList();
      });
      
      // Assert
      store = useStore.getState();
      expect(store.error).toBe('Network error');
      expect(store.isLoading).toBe(false);
    });
  });
  
  describe('fetchById', () => {
    it('should update selectedItem state when successful', async () => {
      // Arrange
      const mockEntity = { id: '1', name: 'Test Entity' };
      mockService.getById.mockResolvedValueOnce({ data: mockEntity });
      
      // Act
      let store = useStore.getState();
      await act(async () => {
        await store.fetchById('1');
      });
      
      // Assert
      store = useStore.getState();
      expect(mockService.getById).toHaveBeenCalledTimes(1);
      expect(mockService.getById).toHaveBeenCalledWith('1');
      expect(store.selectedItem).toEqual(mockEntity);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });
  
  describe('create', () => {
    it('should add new entity to items when successful', async () => {
      // Arrange
      const newEntity = { name: 'New Entity' };
      const createdEntity = { id: '3', name: 'New Entity' };
      mockService.create.mockResolvedValueOnce({ data: createdEntity });
      
      // Act
      let store = useStore.getState();
      let result;
      await act(async () => {
        result = await store.create(newEntity);
      });
      
      // Assert
      store = useStore.getState();
      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(mockService.create).toHaveBeenCalledWith(newEntity);
      expect(store.items).toContainEqual(createdEntity);
      expect(store.selectedItem).toEqual(createdEntity);
      expect(result).toEqual(createdEntity);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });
  
  describe('update', () => {
    it('should update entity in items when successful', async () => {
      // Arrange
      const initialItems = [
        { id: '1', name: 'Test Entity 1' },
        { id: '2', name: 'Test Entity 2' },
      ];
      useStore.setState({ items: initialItems });
      
      const updateData = { name: 'Updated Entity' };
      const updatedEntity = { id: '1', name: 'Updated Entity' };
      mockService.update.mockResolvedValueOnce({ data: updatedEntity });
      
      // Act
      let store = useStore.getState();
      let result;
      await act(async () => {
        result = await store.update('1', updateData);
      });
      
      // Assert
      store = useStore.getState();
      expect(mockService.update).toHaveBeenCalledTimes(1);
      expect(mockService.update).toHaveBeenCalledWith('1', updateData);
      expect(store.items).toContainEqual(updatedEntity);
      expect(store.items.find(item => item.id === '1')).toEqual(updatedEntity);
      expect(result).toEqual(updatedEntity);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });
  
  describe('delete', () => {
    it('should remove entity from items when successful', async () => {
      // Arrange
      const initialItems = [
        { id: '1', name: 'Test Entity 1' },
        { id: '2', name: 'Test Entity 2' },
      ];
      useStore.setState({ items: initialItems, selectedItem: initialItems[0] });
      
      mockService.delete.mockResolvedValueOnce({ data: true });
      
      // Act
      let store = useStore.getState();
      let result;
      await act(async () => {
        result = await store.delete('1');
      });
      
      // Assert
      store = useStore.getState();
      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith('1');
      expect(store.items).toHaveLength(1);
      expect(store.items.find(item => item.id === '1')).toBeUndefined();
      expect(store.selectedItem).toBeNull();
      expect(result).toBe(true);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });
  
  describe('setSelectedItem', () => {
    it('should update selectedItem state', () => {
      // Arrange
      const entity = { id: '1', name: 'Test Entity' };
      
      // Act
      let store = useStore.getState();
      act(() => {
        store.setSelectedItem(entity);
      });
      
      // Assert
      store = useStore.getState();
      expect(store.selectedItem).toEqual(entity);
    });
    
    it('should set selectedItem to null', () => {
      // Arrange
      useStore.setState({ selectedItem: { id: '1', name: 'Test Entity' } });
      
      // Act
      let store = useStore.getState();
      act(() => {
        store.setSelectedItem(null);
      });
      
      // Assert
      store = useStore.getState();
      expect(store.selectedItem).toBeNull();
    });
  });
  
  describe('clearError', () => {
    it('should clear error state', () => {
      // Arrange
      useStore.setState({ error: 'Test error' });
      
      // Act
      let store = useStore.getState();
      act(() => {
        store.clearError();
      });
      
      // Assert
      store = useStore.getState();
      expect(store.error).toBeNull();
    });
  });
});
