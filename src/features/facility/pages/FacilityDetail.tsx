import React from 'react';
import { useParams } from 'react-router-dom';
import { FacilityDetailView } from '../components/detail/FacilityDetailView';
import { useFacility } from '../hooks';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { CartProvider } from '@/contexts/CartContext';

/**
 * FacilityDetailPage
 * 
 * This component is responsible for managing the data fetching logic
 * and providing proper context to the presentation components.
 * Following Single Responsibility Principle by focusing only on data fetching
 * and delegating rendering to specialized components.
 */
export function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { translate } = useLocalization();

  // Use our facility hook to get data, loading state, and errors
  // Following Dependency Inversion by depending on abstractions (hooks)
  const { facility, isLoading, error, notFound } = useFacility(id);

  return (
    <CartProvider>
      <FacilityDetailView 
        facilityId={id || ''}
        facility={facility}
        isLoading={isLoading}
        error={error}
        notFound={notFound}
      />
    </CartProvider>
  );
}

export default FacilityDetailPage;
