import { renderHook, waitFor } from '@testing-library/react';
import { useFacility } from './useFacility';
import { useFacilityServiceProvider } from './useFacilityServiceProvider';

// Mock the service provider hook
jest.mock('./useFacilityServiceProvider', () => ({
  useFacilityServiceProvider: jest.fn()
}));

describe('useFacility', () => {
  // Mock facility data
  const mockFacility = {
    id: '123',
    name: { EN: 'Test Facility', NO: 'Test Anlegg' },
    description: { EN: 'Test Description', NO: 'Test Beskrivelse' },
    images: [{ image_url: 'test.jpg', alt: 'Test Image' }],
    capacity: 10,
    area: 100,
    amenities: ['wifi', 'parking']
  };

  // Success response from service
  const mockSuccessResponse = {
    success: true,
    data: mockFacility
  };

  // Error response from service
  const mockErrorResponse = {
    success: false,
    error: { message: 'Error fetching facility' }
  };

  // Not found response
  const mockNotFoundResponse = {
    success: false,
    error: { message: 'Facility not found' }
  };

  // Mock service implementation
  const mockFacilityService = {
    getFacilityById: jest.fn()
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation returns the facility
    (useFacilityServiceProvider as jest.Mock).mockReturnValue({
      facilityService: mockFacilityService
    });
  });

  it('should return loading state initially', () => {
    mockFacilityService.getFacilityById.mockResolvedValueOnce(mockSuccessResponse);
    
    const { result } = renderHook(() => useFacility('123'));
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.facility).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.notFound).toBe(false);
  });

  it('should fetch and return facility data', async () => {
    mockFacilityService.getFacilityById.mockResolvedValueOnce(mockSuccessResponse);
    
    const { result } = renderHook(() => useFacility('123'));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.facility).toEqual(mockFacility);
    expect(result.current.error).toBeUndefined();
    expect(result.current.notFound).toBe(false);
    expect(mockFacilityService.getFacilityById).toHaveBeenCalledWith('123');
  });

  it('should handle error response', async () => {
    mockFacilityService.getFacilityById.mockResolvedValueOnce(mockErrorResponse);
    
    const { result } = renderHook(() => useFacility('123'));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.facility).toBeUndefined();
    expect(result.current.error).toBe('Error fetching facility');
    expect(result.current.notFound).toBe(false);
  });

  it('should handle not found error', async () => {
    mockFacilityService.getFacilityById.mockResolvedValueOnce(mockNotFoundResponse);
    
    const { result } = renderHook(() => useFacility('123'));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.facility).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.notFound).toBe(true);
  });

  it('should handle undefined facility ID', () => {
    const { result } = renderHook(() => useFacility(undefined));
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.facility).toBeUndefined();
    expect(result.current.error).toBe('No facility ID provided');
    expect(result.current.notFound).toBe(false);
    expect(mockFacilityService.getFacilityById).not.toHaveBeenCalled();
  });

  it('should handle numeric facility ID by converting to string', async () => {
    mockFacilityService.getFacilityById.mockResolvedValueOnce(mockSuccessResponse);
    
    const { result } = renderHook(() => useFacility(123));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(mockFacilityService.getFacilityById).toHaveBeenCalledWith('123');
    expect(result.current.facility).toEqual(mockFacility);
  });

  it('should handle exception during fetch', async () => {
    mockFacilityService.getFacilityById.mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useFacility('123'));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.facility).toBeUndefined();
    expect(result.current.error).toBe('An unexpected error occurred');
    expect(result.current.notFound).toBe(false);
  });
});
