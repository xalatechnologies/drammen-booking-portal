
import React from 'react';
import { useTranslatedFacilities } from '@/hooks/useTranslatedFacilities';
import { TranslatedFacilityCard } from './TranslatedFacilityCard';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export const TranslatedFacilityGrid: React.FC = () => {
  const { data: facilities, isLoading, error } = useTranslatedFacilities();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Feil ved lasting av lokaler: {error.message}</p>
      </div>
    );
  }

  if (!facilities || facilities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Ingen lokaler funnet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility) => (
        <TranslatedFacilityCard
          key={facility.id}
          facility={facility}
          onClick={() => navigate(`/facilities/${facility.id}`)}
        />
      ))}
    </div>
  );
};
