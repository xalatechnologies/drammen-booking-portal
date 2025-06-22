import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/PageLayout';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { FacilityListView } from '../components/FacilityListView';

/**
 * FacilitiesListPage Component
 * 
 * Displays a list of facilities for administration
 * Following Single Responsibility Principle by focusing on page-level concerns
 * Following Dependency Inversion Principle by depending on abstractions (FacilityListView)
 */
const FacilitiesListPage = () => {
  const { translate } = useLocalization();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>();
  
  // Handle facility selection
  const handleFacilitySelect = (id: string) => {
    setSelectedFacilityId(id);
  };
  
  // Handle facility deselection
  const handleFacilityDeselect = () => {
    setSelectedFacilityId(undefined);
  };

  return (
    <PageLayout maxWidth="max-w-none">
      <FacilityListView 
        selectedFacilityId={selectedFacilityId}
        onFacilitySelect={setSelectedFacilityId}
      />
    </PageLayout>
  );
}

export default FacilitiesListPage;
