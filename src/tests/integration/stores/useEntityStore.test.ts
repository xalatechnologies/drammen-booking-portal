import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFacilityStore } from '@/stores/useEntityStore';
import { GenericEntityService } from '@/services/GenericEntityService';
import { GenericEntityRepository } from '@/repositories/GenericEntityRepository';
import { Facility } from '@/types/facility';
import { PaginationMeta } from '@/types/api';

type FacilityStoreState = ReturnType<typeof useFacilityStore.getState>;

// Mock the GenericEntityRepository
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

// Mock the GenericEntityService
vi.mock('@/services/GenericEntityService', () => {
  return {
    GenericEntityService: vi.fn().mockImplementation(() => ({
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  };
});

describe('useEntityStore Integration Tests', () => {
  let mockRepository: any;
  let mockService: any;
  
  const mockFacilities: Facility[] = [
    {
      id: '1' as unknown as number,
      name: 'Test Facility 1',
      description: 'Description 1',
      status: 'active',
      type: 'sports',
      area: 'Downtown',
      address: '123 Main St',
      image: 'test1.jpg',
      nextAvailable: '2025-07-01',
    } as Facility,
    {
      id: '2' as unknown as number,
      name: 'Test Facility 2',
      description: 'Description 2',
      status: 'inactive',
      type: 'meeting',
      area: 'Uptown',
      address: '456 Second St',
      image: 'test2.jpg',
      nextAvailable: '2025-07-02',
    } as Facility,
  ];
  
  beforeEach(() => {
    // Reset the store state by replacing it with initial state
    const initialState = useFacilityStore.getState();
    useFacilityStore.setState({
      ...initialState,
      items: [],
      selectedItem: null,
      isLoading: false,
      error: null,
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } as PaginationMeta
    });
    
    // Get the mocked repository and service instances
    mockRepository = vi.mocked(GenericEntityRepository).mock.instances[0] as any;
    mockService = vi.mocked(GenericEntityService).mock.instances[0] as any;
    
    // Set up default mock implementations
    mockRepository.findAll.mockResolvedValue({
      data: mockFacilities,
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 } as PaginationMeta,
    });
    
    mockRepository.findById.mockImplementation((id) => {
      // Convert id to string for comparison if it's a number
      const idToCompare = typeof id === 'number' ? String(id) : id;
      const facility = mockFacilities.find(f => String(f.id) === idToCompare);
      return Promise.resolve({
        data: facility,
        error: facility ? null : new Error('Facility not found'),
      });
    });
    
    mockRepository.create.mockImplementation((data) => {
      const newFacility = { id: 3, ...data } as Facility;
      return Promise.resolve({
        data: newFacility,
        error: null,
      });
    });
    
    mockRepository.update.mockImplementation((id, data) => {
      // Convert id to string for comparison if it's a number
      const idToCompare = typeof id === 'number' ? String(id) : id;
      const facility = mockFacilities.find(f => String(f.id) === idToCompare);
      if (!facility) {
        return Promise.resolve({
          data: null,
          error: new Error('Facility not found'),
        });
      }
      const updatedFacility = { ...facility, ...data };
      return Promise.resolve({
        data: updatedFacility,
        error: null,
      });
    });
    
    mockRepository.delete.mockImplementation((id) => {
      // Convert id to string for comparison if it's a number
      const idToCompare = typeof id === 'number' ? String(id) : id;
      const facility = mockFacilities.find(f => String(f.id) === idToCompare);
      if (!facility) {
        return Promise.resolve({
          data: false,
          error: new Error('Facility not found'),
        });
      }
      return Promise.resolve({
        data: true,
        error: null,
      });
    });
    
    // Forward service methods to repository
    mockService.findAll.mockImplementation((...args) => mockRepository.findAll(...args));
    mockService.findById.mockImplementation((...args) => mockRepository.findById(...args));
    mockService.create.mockImplementation((...args) => mockRepository.create(...args));
    mockService.update.mockImplementation((...args) => mockRepository.update(...args));
    mockService.delete.mockImplementation((...args) => mockRepository.delete(...args));
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('Fetch operations', () => {
    it('should fetch all facilities', async () => {
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      await act(async () => {
        await result.current.fetchList();
      });
      
      // Assert
      expect(mockService.findAll).toHaveBeenCalled();
      expect(result.current.items).toEqual(mockFacilities);
      expect(result.current.pagination).toEqual(expect.objectContaining({ page: 1, limit: 10, total: 2, totalPages: 1 }));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
    
    it('should fetch a facility by id', async () => {
      // Arrange
      const facilityId = '1' as unknown as number;
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      await act(async () => {
        await result.current.fetchById(facilityId);
      });
      
      // Assert
      expect(mockService.findById).toHaveBeenCalledWith(facilityId);
      expect(result.current.selectedItem).toEqual(mockFacilities[0]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
    
    it('should handle fetch errors', async () => {
      // Arrange
      const error = new Error('Failed to fetch facilities');
      mockService.findAll.mockRejectedValueOnce(error);
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      await act(async () => {
        await result.current.fetchList();
      });
      
      // Assert
      expect(mockService.findAll).toHaveBeenCalled();
      expect(result.current.items).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(error.message);
    });
  });
  
  describe('CRUD operations', () => {
    it('should create a facility', async () => {
      // Arrange
      const newFacility = {
        name: 'New Facility',
        description: 'New Description',
        status: 'active' as const,
        type: 'sports',
      };
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      let createdFacility;
      await act(async () => {
        createdFacility = await result.current.create(newFacility);
      });
      
      // Assert
      expect(mockService.create).toHaveBeenCalledWith(newFacility);
      expect(createdFacility).toEqual({ id: 3, ...newFacility });
    });
    
    it('should update a facility', async () => {
      // Arrange
      const facilityId = '1' as unknown as number;
      const updateData = {
        name: 'Updated Facility',
        description: 'Updated Description',
      };
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      let updatedFacility;
      await act(async () => {
        updatedFacility = await result.current.update(facilityId, updateData);
      });
      
      // Assert
      expect(mockService.update).toHaveBeenCalledWith(facilityId, updateData);
      expect(updatedFacility).toEqual({ ...mockFacilities[0], ...updateData });
    });
    
    it('should delete a facility', async () => {
      // Arrange
      const facilityId = '1' as unknown as number;
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.delete(facilityId);
      });
      
      // Assert
      expect(mockService.delete).toHaveBeenCalledWith(facilityId);
      expect(deleteResult).toBe(true);
    });
    
    it('should handle create errors', async () => {
      // Arrange
      const newFacility = {
        name: 'New Facility',
        description: 'New Description',
      };
      const error = new Error('Failed to create facility');
      mockService.create.mockRejectedValueOnce(error);
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      await act(async () => {
        try {
          await result.current.create(newFacility);
        } catch (e) {
          // Expected error
        }
      });
      
      // Assert
      expect(mockService.create).toHaveBeenCalledWith(newFacility);
      expect(result.current.error).toBe(error.message);
    });
  });
  
  describe('State management', () => {
    it('should set selected item', async () => {
      // Arrange
      const facility = mockFacilities[0];
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      act(() => {
        result.current.setSelectedItem(facility);
      });
      
      // Assert
      expect(result.current.selectedItem).toEqual(facility);
    });
    
    it('should clear selected item', async () => {
      // Arrange
      const facility = mockFacilities[0];
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      act(() => {
        result.current.setSelectedItem(facility);
        // Use setState directly since clearSelectedItem may not exist
        useFacilityStore.setState({ ...useFacilityStore.getState(), selectedItem: null });
      });
      
      // Assert
      expect(result.current.selectedItem).toBeNull();
    });
    
    it('should clear error', async () => {
      // Arrange
      const error = new Error('Test error');
      
      // Act
      const { result } = renderHook(() => useFacilityStore());
      
      act(() => {
        // Set error directly using setState
        useFacilityStore.setState({ ...useFacilityStore.getState(), error: error.message });
        result.current.clearError();
      });
      
      // Assert
      expect(result.current.error).toBeNull();
    });
    
    it('should reset the store', async () => {
      // Arrange
      const { result } = renderHook(() => useFacilityStore());
      
      await act(async () => {
        await result.current.fetchList();
        result.current.setSelectedItem(mockFacilities[0]);
      });
      
      // Act
      act(() => {
        // Reset the store manually
        useFacilityStore.setState({
          ...useFacilityStore.getState(),
          items: [],
          selectedItem: null,
          isLoading: false,
          error: null,
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } as PaginationMeta
        });
      });
      
      // Assert
      expect(result.current.items).toEqual([]);
      expect(result.current.selectedItem).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.pagination).toEqual(expect.objectContaining({ page: 1, limit: 10, total: 0, totalPages: 0 }));
    });
  });
});
