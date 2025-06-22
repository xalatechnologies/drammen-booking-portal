import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingState } from '@/components/layouts';
import { SimplifiedFacilityForm } from '../components/SimplifiedFacilityForm';
import { useFacilityDetail } from '../hooks/useFacilityDetail';

/**
 * FacilityFormPage
 * 
 * Administrative page for adding or editing facility details
 * Following Single Responsibility Principle by focusing only on form coordination
 * Following Dependency Inversion Principle by depending on abstractions (hooks)
 * Following Open/Closed Principle by being open for extension but closed for modification
 */
export function FacilityFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  // Use custom hook for fetching facility data - following SRP and DIP
  const { facility, isLoading } = useFacilityDetail(isEditing ? id : undefined);

  const handleSuccess = () => {
    navigate('/admin/facilities');
  };

  const handleCancel = () => {
    navigate('/admin/facilities');
  };

  if (isLoading && isEditing) {
    return <LoadingState />;
  }

  return (
    <SimplifiedFacilityForm 
      facility={facility}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      isEditing={isEditing}
    />
  );
}

export default FacilityFormPage;
