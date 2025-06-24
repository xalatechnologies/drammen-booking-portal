
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts';
import { FacilityFormView } from '@/components/admin/facilities/FacilityFormView';

export default function FacilityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/facilities');
  };

  const handleCancel = () => {
    navigate('/admin/facilities');
  };

  return (
    <PageLayout>
      <FacilityFormView
        facility={id ? { id: parseInt(id) } : undefined}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
}
