import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useFacilityStore } from '@/stores/useGenericFacilityStore';
import { createGenericEntityStore } from '@/stores/createGenericEntityStore';

// Mock the generic entity store
vi.mock('@/stores/createGenericEntityStore', () => {
  const mockStore = {
    getState: vi.fn(),
    setState: vi.fn(),
    subscribe: vi.fn(),
    fetchList: vi.fn(),
    fetchById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setSelectedItem: vi.fn(),
    clearError: vi.fn(),
  };
  
  return {
    createGenericEntityStore: vi.fn().mockReturnValue(() => mockStore),
  };
});

describe('useGenericFacilityStore', () => {
  let mockGenericStore: ReturnType<typeof createGenericEntityStore>;
  
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Reset the store state
    useFacilityStore.setState({
      // UI state
      viewMode: 'list',
      filters: {
        search: '',
        status: 'all',
        category: 'all',
      },
      formState: {
        isOpen: false,
        isEdit: false,
      },
    }, true);
    
    // Get the mocked generic store
    mockGenericStore = (createGenericEntityStore as unknown as ReturnType<typeof vi.fn>).mock.results[0].value();
  });
  
  describe('UI state management', () => {
    it('should set view mode correctly', () => {
      // Act
      act(() => {
        useFacilityStore.getState().setViewMode('grid');
      });
      
      // Assert
      expect(useFacilityStore.getState().viewMode).toBe('grid');
    });
    
    it('should update filters correctly', () => {
      // Act
      act(() => {
        useFacilityStore.getState().setFilters({
          search: 'test',
          status: 'active',
          category: 'sports',
        });
      });
      
      // Assert
      expect(useFacilityStore.getState().filters).toEqual({
        search: 'test',
        status: 'active',
        category: 'sports',
      });
    });
    
    it('should update search filter correctly', () => {
      // Act
      act(() => {
        useFacilityStore.getState().setSearchFilter('test search');
      });
      
      // Assert
      expect(useFacilityStore.getState().filters.search).toBe('test search');
    });
    
    it('should update status filter correctly', () => {
      // Act
      act(() => {
        useFacilityStore.getState().setStatusFilter('inactive');
      });
      
      // Assert
      expect(useFacilityStore.getState().filters.status).toBe('inactive');
    });
    
    it('should update category filter correctly', () => {
      // Act
      act(() => {
        useFacilityStore.getState().setCategoryFilter('meeting');
      });
      
      // Assert
      expect(useFacilityStore.getState().filters.category).toBe('meeting');
    });
    
    it('should reset filters correctly', () => {
      // Arrange
      useFacilityStore.setState({
        filters: {
          search: 'test',
          status: 'active',
          category: 'sports',
        },
      });
      
      // Act
      act(() => {
        useFacilityStore.getState().resetFilters();
      });
      
      // Assert
      expect(useFacilityStore.getState().filters).toEqual({
        search: '',
        status: 'all',
        category: 'all',
      });
    });
  });
  
  describe('Form state management', () => {
    it('should open create form correctly', () => {
      // Act
      act(() => {
        useFacilityStore.getState().openCreateForm();
      });
      
      // Assert
      expect(useFacilityStore.getState().formState).toEqual({
        isOpen: true,
        isEdit: false,
      });
    });
    
    it('should open edit form correctly', () => {
      // Act
      act(() => {
        useFacilityStore.getState().openEditForm();
      });
      
      // Assert
      expect(useFacilityStore.getState().formState).toEqual({
        isOpen: true,
        isEdit: true,
      });
    });
    
    it('should close form correctly', () => {
      // Arrange
      useFacilityStore.setState({
        formState: {
          isOpen: true,
          isEdit: true,
        },
      });
      
      // Act
      act(() => {
        useFacilityStore.getState().closeForm();
      });
      
      // Assert
      expect(useFacilityStore.getState().formState).toEqual({
        isOpen: false,
        isEdit: false,
      });
    });
  });
  
  describe('Facility selection', () => {
    it('should handle facility selection correctly', () => {
      // Arrange
      const facility = { id: '1', name: 'Test Facility' };
      
      // Act
      act(() => {
        useFacilityStore.getState().handleFacilitySelect(facility);
      });
      
      // Assert
      expect(mockGenericStore.setSelectedItem).toHaveBeenCalledWith(facility);
      expect(useFacilityStore.getState().formState).toEqual({
        isOpen: true,
        isEdit: true,
      });
    });
  });
  
  describe('CRUD operations', () => {
    it('should fetch facilities with filters', async () => {
      // Arrange
      useFacilityStore.setState({
        filters: {
          search: 'test',
          status: 'active',
          category: 'sports',
        },
      });
      
      // Act
      await act(async () => {
        await useFacilityStore.getState().fetchFacilities();
      });
      
      // Assert
      expect(mockGenericStore.fetchList).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'test',
          status: 'active',
          category: 'sports',
        })
      );
    });
    
    it('should create facility and close form on success', async () => {
      // Arrange
      const newFacility = { name: 'New Facility' };
      const createdFacility = { id: '1', name: 'New Facility' };
      mockGenericStore.create.mockResolvedValueOnce(createdFacility);
      
      // Act
      let result;
      await act(async () => {
        result = await useFacilityStore.getState().createFacility(newFacility);
      });
      
      // Assert
      expect(mockGenericStore.create).toHaveBeenCalledWith(newFacility);
      expect(result).toEqual(createdFacility);
      expect(useFacilityStore.getState().formState.isOpen).toBe(false);
    });
    
    it('should update facility and close form on success', async () => {
      // Arrange
      const updateData = { name: 'Updated Facility' };
      const updatedFacility = { id: '1', name: 'Updated Facility' };
      mockGenericStore.update.mockResolvedValueOnce(updatedFacility);
      
      // Act
      let result;
      await act(async () => {
        result = await useFacilityStore.getState().updateFacility('1', updateData);
      });
      
      // Assert
      expect(mockGenericStore.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedFacility);
      expect(useFacilityStore.getState().formState.isOpen).toBe(false);
    });
    
    it('should delete facility', async () => {
      // Arrange
      mockGenericStore.delete.mockResolvedValueOnce(true);
      
      // Act
      let result;
      await act(async () => {
        result = await useFacilityStore.getState().deleteFacility('1');
      });
      
      // Assert
      expect(mockGenericStore.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});
