import { ApiResponse, PaginatedResponse, QueryParams } from '../../types/entity';
import { Facility, FacilityFilters } from '../../types/facility';
import { GenericStoreApi } from '../createGenericStore';

/**
 * Facility API adapter that implements GenericStoreApi
 * This is where all the actual API calls would be made
 */
export class FacilityApi implements GenericStoreApi<Facility> {
  private baseUrl: string;
  
  constructor(baseUrl = '/api/facilities') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get a list of facilities with optional filtering, pagination, and sorting
   */
  async getList(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll simulate a successful response with mock data
      
      const pagination = params?.pagination || { page: 1, limit: 10 };
      const filters = params?.filters as FacilityFilters | undefined;
      
      // Mock data
      const mockFacilities: Facility[] = [
        {
          id: '1',
          name: 'Sports Arena',
          description: 'Large sports facility with multiple courts',
          address: '123 Sports Lane',
          city: 'Drammen',
          postalCode: '3000',
          imageUrl: '/images/sports-arena.jpg',
          status: 'active',
          facilityType: 'sports',
          capacity: 500,
          amenities: ['parking', 'showers', 'lockers']
        },
        {
          id: '2',
          name: 'Community Center',
          description: 'Multi-purpose community facility',
          address: '456 Community Road',
          city: 'Drammen',
          postalCode: '3001',
          imageUrl: '/images/community-center.jpg',
          status: 'active',
          facilityType: 'multipurpose',
          capacity: 200,
          amenities: ['parking', 'kitchen', 'wifi']
        }
      ];
      
      // Apply filters if provided
      let filteredFacilities = [...mockFacilities];
      if (filters) {
        if (filters.name) {
          filteredFacilities = filteredFacilities.filter(f => 
            f.name.toLowerCase().includes(filters.name!.toLowerCase())
          );
        }
        
        if (filters.facilityType) {
          filteredFacilities = filteredFacilities.filter(f => 
            f.facilityType === filters.facilityType
          );
        }
        
        if (filters.status) {
          filteredFacilities = filteredFacilities.filter(f => 
            f.status === filters.status
          );
        }
        
        if (filters.city) {
          filteredFacilities = filteredFacilities.filter(f => 
            f.city.toLowerCase().includes(filters.city!.toLowerCase())
          );
        }
        
        if (filters.capacity) {
          if (filters.capacity.min !== undefined) {
            filteredFacilities = filteredFacilities.filter(f => 
              f.capacity !== undefined && f.capacity >= filters.capacity!.min!
            );
          }
          
          if (filters.capacity.max !== undefined) {
            filteredFacilities = filteredFacilities.filter(f => 
              f.capacity !== undefined && f.capacity <= filters.capacity!.max!
            );
          }
        }
        
        if (filters.amenities && filters.amenities.length > 0) {
          filteredFacilities = filteredFacilities.filter(f => 
            f.amenities !== undefined && 
            filters.amenities!.every(a => f.amenities!.includes(a))
          );
        }
      }
      
      // Apply pagination
      const start = (pagination.page - 1) * pagination.limit;
      const end = start + pagination.limit;
      const paginatedFacilities = filteredFacilities.slice(start, end);
      
      return {
        status: 200,
        data: {
          items: paginatedFacilities,
          total: filteredFacilities.length,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(filteredFacilities.length / pagination.limit)
        }
      };
    } catch (error) {
      return {
        status: 500,
        error: (error as Error).message || 'Failed to fetch facilities'
      };
    }
  }
  
  /**
   * Get a facility by ID
   */
  async getById(id: string | number): Promise<ApiResponse<Facility>> {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll simulate a successful response with mock data
      
      // Mock data
      const mockFacility: Facility = {
        id: String(id),
        name: 'Sports Arena',
        description: 'Large sports facility with multiple courts',
        address: '123 Sports Lane',
        city: 'Drammen',
        postalCode: '3000',
        imageUrl: '/images/sports-arena.jpg',
        status: 'active',
        facilityType: 'sports',
        capacity: 500,
        amenities: ['parking', 'showers', 'lockers'],
        zones: [
          {
            id: '101',
            name: 'Main Court',
            description: 'Basketball court',
            facilityId: String(id),
            capacity: 100,
            status: 'active'
          },
          {
            id: '102',
            name: 'Side Court',
            description: 'Volleyball court',
            facilityId: String(id),
            capacity: 50,
            status: 'active'
          }
        ]
      };
      
      return {
        status: 200,
        data: mockFacility
      };
    } catch (error) {
      return {
        status: 500,
        error: (error as Error).message || 'Failed to fetch facility'
      };
    }
  }
  
  /**
   * Create a new facility
   */
  async create(data: Partial<Facility>): Promise<ApiResponse<Facility>> {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll simulate a successful response with the data provided
      
      const newFacility: Facility = {
        id: String(Date.now()), // Generate a unique ID
        name: data.name || 'New Facility',
        description: data.description || '',
        address: data.address || '',
        city: data.city || '',
        postalCode: data.postalCode || '',
        imageUrl: data.imageUrl,
        status: data.status || 'inactive',
        facilityType: data.facilityType || 'other',
        capacity: data.capacity,
        amenities: data.amenities || [],
        zones: data.zones || []
      };
      
      return {
        status: 201,
        data: newFacility
      };
    } catch (error) {
      return {
        status: 500,
        error: (error as Error).message || 'Failed to create facility'
      };
    }
  }
  
  /**
   * Update an existing facility
   */
  async update(id: string | number, data: Partial<Facility>): Promise<ApiResponse<Facility>> {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll simulate a successful response with the data provided
      
      // First, get the existing facility (mock)
      const existingFacility: Facility = {
        id: String(id),
        name: 'Sports Arena',
        description: 'Large sports facility with multiple courts',
        address: '123 Sports Lane',
        city: 'Drammen',
        postalCode: '3000',
        imageUrl: '/images/sports-arena.jpg',
        status: 'active',
        facilityType: 'sports',
        capacity: 500,
        amenities: ['parking', 'showers', 'lockers']
      };
      
      // Update with new data
      const updatedFacility: Facility = {
        ...existingFacility,
        ...data,
        id: String(id) // Ensure ID doesn't change
      };
      
      return {
        status: 200,
        data: updatedFacility
      };
    } catch (error) {
      return {
        status: 500,
        error: (error as Error).message || 'Failed to update facility'
      };
    }
  }
  
  /**
   * Remove a facility
   */
  async remove(id: string | number): Promise<ApiResponse<boolean>> {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll simulate a successful response
      
      return {
        status: 200,
        data: true
      };
    } catch (error) {
      return {
        status: 500,
        error: (error as Error).message || 'Failed to delete facility'
      };
    }
  }
}
