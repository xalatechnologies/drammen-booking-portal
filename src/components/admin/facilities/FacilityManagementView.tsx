
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Grid, List, Map, Calendar } from 'lucide-react';
import { useFacilities } from '@/hooks/useFacilities';
import { Facility } from '@/types/facility';
import FacilityTableView from './FacilityTableView';
import FacilityGridView from './FacilityGridView';
import FacilityListViewDisplay from './FacilityListViewDisplay';
import FacilityMapViewComponent from './FacilityMapViewComponent';
import FacilityDetailViewComponent from './FacilityDetailViewComponent';
import FacilityCalendarViewComponent from './FacilityCalendarViewComponent';
import { useTranslation } from '@/i18n/hooks/useTranslation';

type ViewMode = 'table' | 'grid' | 'list' | 'map';
type DetailMode = 'detail' | 'calendar' | null;

interface FacilityManagementViewProps {
  onCreateNew?: () => void;
  onEdit?: (facilityId: number) => void;
}

export function FacilityManagementView({ onCreateNew, onEdit }: FacilityManagementViewProps) {
  const { t } = useTranslation();
  const { data: facilities = [], isLoading } = useFacilities();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [detailMode, setDetailMode] = useState<DetailMode>(null);

  const handleView = (facility: Facility) => {
    setSelectedFacility(facility);
    setDetailMode('detail');
  };

  const handleCalendar = (facility: Facility) => {
    setSelectedFacility(facility);
    setDetailMode('calendar');
  };

  const handleEdit = (facility: Facility) => {
    onEdit?.(facility.id);
  };

  const handleBack = () => {
    setSelectedFacility(null);
    setDetailMode(null);
  };

  if (selectedFacility && detailMode === 'detail') {
    return (
      <FacilityDetailViewComponent
        facility={selectedFacility}
        onBack={handleBack}
        onEdit={() => handleEdit(selectedFacility)}
        onCalendar={() => handleCalendar(selectedFacility)}
      />
    );
  }

  if (selectedFacility && detailMode === 'calendar') {
    return (
      <FacilityCalendarViewComponent
        facility={selectedFacility}
        onBack={handleBack}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        {t('admin.common.loading', 'Loading facilities...')}
      </div>
    );
  }

  const renderViewModeButtons = () => (
    <div className="flex gap-2">
      <Button
        variant={viewMode === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('table')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('grid')}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('list')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'map' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('map')}
      >
        <Map className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'grid':
        return (
          <FacilityGridView
            facilities={facilities}
            onView={handleView}
            onCalendar={handleCalendar}
            onEdit={handleEdit}
          />
        );
      case 'list':
        return (
          <FacilityListViewDisplay
            facilities={facilities}
            onView={handleView}
            onCalendar={handleCalendar}
            onEdit={handleEdit}
          />
        );
      case 'map':
        return (
          <FacilityMapViewComponent
            facilities={facilities}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <FacilityTableView
            facilities={facilities}
            onView={handleView}
            onCalendar={handleCalendar}
            onEdit={handleEdit}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.facilities.title', 'Facility Management')}</h1>
        <div className="flex items-center gap-4">
          {renderViewModeButtons()}
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.facilities.actions.create', 'New Facility')}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.facilities.allFacilities', 'All Facilities')}</CardTitle>
        </CardHeader>
        <CardContent>
          {facilities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {t('admin.facilities.noFacilities', 'No facilities found')}
            </p>
          ) : (
            renderContent()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
