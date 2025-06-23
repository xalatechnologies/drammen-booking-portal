import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnhancedFacilityForm from '@/components/admin/facilities/form/EnhancedFacilityForm';
import { useFacilityStore } from '@/stores/useGenericFacilityStore';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

// Mock the facility store
vi.mock('@/stores/useGenericFacilityStore', () => {
  const createFacility = vi.fn();
  const updateFacility = vi.fn();
  const deleteFacility = vi.fn();
  
  return {
    useFacilityStore: {
      getState: vi.fn().mockReturnValue({
        selectedItem: null,
        isLoading: false,
        error: null,
        createFacility,
        updateFacility,
        deleteFacility,
      }),
      subscribe: vi.fn(),
      createFacility,
      updateFacility,
      deleteFacility,
    },
  };
});

// Mock the toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('EnhancedFacilityForm Integration Tests', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the mock store state
    (useFacilityStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedItem: null,
      isLoading: false,
      error: null,
      createFacility: useFacilityStore.createFacility,
      updateFacility: useFacilityStore.updateFacility,
      deleteFacility: useFacilityStore.deleteFacility,
    });
  });
  
  const renderComponent = (isEdit = false) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <EnhancedFacilityForm 
          isEdit={isEdit}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </I18nextProvider>
    );
  };
  
  describe('Create Mode', () => {
    it('should render the form with empty fields in create mode', () => {
      // Act
      renderComponent(false);
      
      // Assert
      expect(screen.getByText(/Add New Facility/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/i)).toHaveValue('');
      expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    });
    
    it('should call createFacility when form is submitted', async () => {
      // Arrange
      const newFacility = { 
        name: 'Test Facility',
        description: 'Test Description',
        status: 'active',
        category: 'sports'
      };
      useFacilityStore.createFacility.mockResolvedValueOnce({ id: '1', ...newFacility });
      
      // Act
      renderComponent(false);
      
      // Fill out the form
      await userEvent.type(screen.getByLabelText(/Name/i), newFacility.name);
      await userEvent.type(screen.getByLabelText(/Description/i), newFacility.description);
      
      // Submit the form
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      
      // Assert
      await waitFor(() => {
        expect(useFacilityStore.createFacility).toHaveBeenCalledWith(
          expect.objectContaining({
            name: newFacility.name,
            description: newFacility.description,
          })
        );
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
    
    it('should handle validation errors', async () => {
      // Act
      renderComponent(false);
      
      // Submit without filling required fields
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
        expect(useFacilityStore.createFacility).not.toHaveBeenCalled();
      });
    });
  });
  
  describe('Edit Mode', () => {
    const existingFacility = {
      id: '1',
      name: 'Existing Facility',
      description: 'Existing Description',
      status: 'active',
      category: 'sports',
      address: '123 Main St',
      images: [],
    };
    
    beforeEach(() => {
      // Set up the mock store with a selected facility
      (useFacilityStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        selectedItem: existingFacility,
        isLoading: false,
        error: null,
        createFacility: useFacilityStore.createFacility,
        updateFacility: useFacilityStore.updateFacility,
        deleteFacility: useFacilityStore.deleteFacility,
      });
    });
    
    it('should render the form with existing facility data in edit mode', () => {
      // Act
      renderComponent(true);
      
      // Assert
      expect(screen.getByText(/Edit Facility/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/i)).toHaveValue(existingFacility.name);
      expect(screen.getByLabelText(/Description/i)).toHaveValue(existingFacility.description);
    });
    
    it('should call updateFacility when form is submitted', async () => {
      // Arrange
      const updatedFacility = { 
        ...existingFacility,
        name: 'Updated Facility',
        description: 'Updated Description'
      };
      useFacilityStore.updateFacility.mockResolvedValueOnce(updatedFacility);
      
      // Act
      renderComponent(true);
      
      // Clear and update form fields
      await userEvent.clear(screen.getByLabelText(/Name/i));
      await userEvent.type(screen.getByLabelText(/Name/i), updatedFacility.name);
      await userEvent.clear(screen.getByLabelText(/Description/i));
      await userEvent.type(screen.getByLabelText(/Description/i), updatedFacility.description);
      
      // Submit the form
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      
      // Assert
      await waitFor(() => {
        expect(useFacilityStore.updateFacility).toHaveBeenCalledWith(
          existingFacility.id,
          expect.objectContaining({
            name: updatedFacility.name,
            description: updatedFacility.description,
          })
        );
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
    
    it('should call deleteFacility when delete button is clicked and confirmed', async () => {
      // Arrange
      useFacilityStore.deleteFacility.mockResolvedValueOnce(true);
      
      // Act
      renderComponent(true);
      
      // Click delete button
      await userEvent.click(screen.getByRole('button', { name: /Delete/i }));
      
      // Confirm deletion in the dialog
      await waitFor(() => {
        expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));
      
      // Assert
      await waitFor(() => {
        expect(useFacilityStore.deleteFacility).toHaveBeenCalledWith(existingFacility.id);
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });
  
  describe('Error Handling', () => {
    it('should display error message when create operation fails', async () => {
      // Arrange
      const errorMessage = 'Failed to create facility';
      useFacilityStore.createFacility.mockRejectedValueOnce(new Error(errorMessage));
      
      // Act
      renderComponent(false);
      
      // Fill out the form
      await userEvent.type(screen.getByLabelText(/Name/i), 'Test Facility');
      
      // Submit the form
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      
      // Assert
      await waitFor(() => {
        expect(useFacilityStore.createFacility).toHaveBeenCalled();
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
      });
    });
    
    it('should display error message when update operation fails', async () => {
      // Arrange
      const existingFacility = {
        id: '1',
        name: 'Existing Facility',
        description: 'Existing Description',
      };
      
      (useFacilityStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        selectedItem: existingFacility,
        isLoading: false,
        error: null,
        createFacility: useFacilityStore.createFacility,
        updateFacility: useFacilityStore.updateFacility,
        deleteFacility: useFacilityStore.deleteFacility,
      });
      
      const errorMessage = 'Failed to update facility';
      useFacilityStore.updateFacility.mockRejectedValueOnce(new Error(errorMessage));
      
      // Act
      renderComponent(true);
      
      // Submit the form without changes
      await userEvent.click(screen.getByRole('button', { name: /Save/i }));
      
      // Assert
      await waitFor(() => {
        expect(useFacilityStore.updateFacility).toHaveBeenCalled();
        expect(screen.getByText(/Error/i)).toBeInTheDocument();
      });
    });
  });
});
