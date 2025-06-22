import React from 'react';
import { PageLayout } from '@/components/layouts';
import { FacilityManagementDashboard } from '../components/management/FacilityManagementDashboard';
import { FacilityProvider } from '@/contexts/facility/FacilityContext';
import { useLocalization } from '@/core/localization/hooks/useLocalization';

/**
 * FacilityManagementPage
 * 
 * Administrative page for managing facilities
 * Following Single Responsibility Principle by focusing only on page structure
 * Following Open/Closed Principle by being extensible through composition
 * Following Dependency Inversion Principle by depending on abstractions (context)
 */
export function FacilityManagementPage() {
  const { translate } = useLocalization();
  
  return (
    <PageLayout maxWidth="max-w-none">
      <h1 className="text-2xl font-bold mb-2">{translate('admin.facilities.management.title')}</h1>
      <p className="text-muted-foreground mb-6">{translate('admin.facilities.management.description')}</p>
      <FacilityProvider>
        <FacilityManagementDashboard />
      </FacilityProvider>
    </PageLayout>
  );
}

export default FacilityManagementPage;
