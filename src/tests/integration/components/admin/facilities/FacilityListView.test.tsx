import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FacilityListView } from '@/components/admin/facilities/FacilityListView';
import { useFacilityAdmin } from '@/hooks/useFacilityAdmin';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

// Mock the router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock the facility admin hook
vi.mock('@/hooks/useFacilityAdmin', () => ({
  useFacilityAdmin: vi.fn(),
}));

// Mock the translation hook
vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    tSync: (key: string, fallback: string) => fallback,
  }),
}));

describe('FacilityListView Integration Tests', () => {
  const mockFacilities = [
    {
      id: 1,
      name: 'Test Facility 1',
      description: 'Description 1',
      status: 'active',
      type: 'sports',
      area: 'Downtown',
      address: '123 Main St',
      image: 'test1.jpg',
      nextAvailable: '2025-07-01',
    },
    {
      id: 2,
      name: 'Test Facility 2',
      description: 'Description 2',
      status: 'inactive',
      type: 'meeting',
      area: 'Uptown',
      address: '456 Second St',
      image: 'test2.jpg',
      nextAvailable: '2025-07-02',
    },
  ];

  const mockFacilityAdmin = {
    facilities: mockFacilities,
    isLoading: false,
    error: null,
    filters: {
      search: '',
      status: 'all',
      category: 'all',
    },
    viewMode: 'list',
    formState: {
      isOpen: false,
      isEdit: false,
    },
    fetchFacilities: vi.fn().mockResolvedValue(mockFacilities),
    setViewMode: vi.fn(),
    setFilters: vi.fn(),
    handleFacilitySelect: vi.fn(),
    setSearchFilter: vi.fn(),
    setStatusFilter: vi.fn(),
    setCategoryFilter: vi.fn(),
    resetFilters: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useFacilityAdmin as ReturnType<typeof vi.fn>).mockReturnValue(mockFacilityAdmin);
  });

  const renderComponent = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <FacilityListView {...props} />
      </I18nextProvider>
    );
  };

  it('should render the facility list view with facilities', async () => {
    // Act
    renderComponent();

    // Assert
    expect(screen.getByText('Facilities')).toBeInTheDocument();
    expect(screen.getByText('Test Facility 1')).toBeInTheDocument();
    expect(screen.getByText('Test Facility 2')).toBeInTheDocument();
    expect(mockFacilityAdmin.fetchFacilities).toHaveBeenCalledTimes(1);
  });

  it('should filter facilities by search term', async () => {
    // Arrange
    renderComponent();
    
    // Act
    const searchInput = screen.getByPlaceholderText('Search...');
    await userEvent.type(searchInput, 'Facility 1');
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    // Assert
    await waitFor(() => {
      expect(mockFacilityAdmin.setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Facility 1' })
      );
    });
  });

  it('should filter facilities by type', async () => {
    // Arrange
    renderComponent();
    
    // Act
    const typeFilter = screen.getByText('All Types');
    await userEvent.click(typeFilter);
    await userEvent.click(screen.getByText('Sports'));
    
    // Assert
    await waitFor(() => {
      expect(mockFacilityAdmin.setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'sports' })
      );
    });
  });

  it('should filter facilities by status', async () => {
    // Arrange
    renderComponent();
    
    // Act
    const statusFilter = screen.getByText('All Statuses');
    await userEvent.click(statusFilter);
    await userEvent.click(screen.getByText('Active'));
    
    // Assert
    await waitFor(() => {
      expect(mockFacilityAdmin.setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' })
      );
    });
  });

  it('should change view mode', async () => {
    // Arrange
    renderComponent();
    
    // Act
    await userEvent.click(screen.getByText('Grid'));
    
    // Assert
    expect(mockFacilityAdmin.setViewMode).toHaveBeenCalledWith('grid');
  });

  it('should navigate to add new facility page when clicking Add New button', async () => {
    // Arrange
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    
    renderComponent();
    
    // Act
    await userEvent.click(screen.getByText('Add New'));
    
    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/admin/facilities/new');
  });

  it('should show loading state when loading facilities', async () => {
    // Arrange
    (useFacilityAdmin as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockFacilityAdmin,
      isLoading: true,
      facilities: [],
    });
    
    // Act
    renderComponent();
    
    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error state when there is an error', async () => {
    // Arrange
    const errorMessage = 'Failed to load facilities';
    (useFacilityAdmin as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockFacilityAdmin,
      error: errorMessage,
      facilities: [],
    });
    
    // Act
    renderComponent();
    
    // Assert
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show empty state when no facilities match filters', async () => {
    // Arrange
    (useFacilityAdmin as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockFacilityAdmin,
      facilities: [],
    });
    
    // Act
    renderComponent();
    
    // Assert
    expect(screen.getByText('No facilities found matching your criteria.')).toBeInTheDocument();
  });
});
