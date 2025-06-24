
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFacility } from '@/hooks/useFacility';
import { FacilityDetailLayout } from '@/components/facility/detail/FacilityDetailLayout';
import { PageLayout } from '@/components/layouts';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export default function FacilityDetailPage() {
  const { id } = useParams();
  const facilityId = id ? parseInt(id, 10) : 0;
  const { facility, isLoading, error } = useFacility(facilityId);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">{t('common.loading', 'Loading facility...')}</div>
        </div>
      </PageLayout>
    );
  }

  if (error || !facility) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center text-red-600">
            {t('facility.notFound', 'Facility not found')}
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleShare = () => {
    console.log('Share facility:', facility.name);
  };

  const handleToggleFavorite = () => {
    console.log('Toggle favorite for facility:', facility.name);
  };

  return (
    <PageLayout>
      <FacilityDetailLayout
        facility={facility}
        zones={facility.zones || []}
        onShare={handleShare}
        isFavorited={false}
        onToggleFavorite={handleToggleFavorite}
      />
    </PageLayout>
  );
}
