
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facility } from "@/types/facility";
import { useJsonTranslation } from "@/hooks/useJsonTranslation";
import { useFacilities } from "@/hooks/useFacilities";
import { useUIStore } from "@/stores/useUIStore";
import { transformFacilitiesForUI } from "@/utils/facilityTransforms";

// Import the components we created
import FacilityTableView from "./FacilityTableView";
import FacilityGridView from "./FacilityGridView";
import FacilityListViewDisplay from "./FacilityListViewDisplay";
import FacilityMapViewComponent from "./FacilityMapViewComponent";
import FacilityCalendarViewComponent from "./FacilityCalendarViewComponent";
import FacilityDetailViewComponent from "./FacilityDetailViewComponent";

interface FacilityListViewProps {
  selectedFacilityId?: number;
  onFacilitySelect?: (id: number) => void;
}

type ViewMode = 'list' | 'calendar' | 'detail';
type DisplayMode = 'table' | 'grid' | 'list' | 'map';

export const FacilityListView: React.FC<FacilityListViewProps> = ({
  selectedFacilityId,
  onFacilitySelect
}) => {
  const navigate = useNavigate();
  const [viewMode, setLocalViewMode] = React.useState<ViewMode>('list');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { tSync } = useJsonTranslation();
  const { currentView, setCurrentView } = useUIStore();

  // Use the simplified facilities hook
  const { data: facilities = [], isLoading, error } = useFacilities();

  // Local state for filters
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Local display mode
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('list');

  // Transform facilities to ensure they have proper structure for UI
  const transformedFacilities = React.useMemo(() => {
    if (!facilities || facilities.length === 0) {
      console.log('FacilityListView - No facilities to transform');
      return [];
    }

    return transformFacilitiesForUI(facilities);
  }, [facilities]);

  // Apply filters
  const filteredFacilities = React.useMemo(() => {
    let filtered = transformedFacilities;

    if (searchFilter) {
      filtered = filtered.filter(facility =>
        facility.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        facility.description?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        facility.area.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(facility => facility.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(facility => facility.type === categoryFilter);
    }

    return filtered;
  }, [transformedFacilities, searchFilter, statusFilter, categoryFilter]);

  const handleView = (facility: Facility) => {
    setSelectedFacility(facility);
    setLocalViewMode('detail');
  };

  const handleCalendar = (facility: Facility) => {
    setSelectedFacility(facility);
    setLocalViewMode('calendar');
  };

  const handleEdit = (facility: Facility) => {
    navigate(`/admin/facilities/edit/${facility.id}`);
  };

  const handleBack = () => {
    setSelectedFacility(null);
    setLocalViewMode('list');
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading facilities: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'detail' && selectedFacility) {
    return (
      <FacilityDetailViewComponent
        facility={selectedFacility}
        onBack={handleBack}
        onEdit={() => handleEdit(selectedFacility)}
        onCalendar={() => handleCalendar(selectedFacility)}
      />
    );
  }

  if (viewMode === 'calendar' && selectedFacility) {
    return (
      <FacilityCalendarViewComponent
        facility={selectedFacility}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {tSync('admin.facilities.title', 'Facilities Management')}
          </h1>
          <p className="text-gray-600 mt-1">
            {tSync('admin.facilities.subtitle', 'Manage facility listings, availability, and settings')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/admin/facilities/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {tSync('admin.facilities.addNew', 'Add New Facility')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder={tSync('admin.facilities.search', 'Search facilities...')}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{tSync('admin.facilities.allStatuses', 'All Statuses')}</option>
              <option value="active">{tSync('admin.facilities.status.active', 'Active')}</option>
              <option value="maintenance">{tSync('admin.facilities.status.maintenance', 'Maintenance')}</option>
              <option value="inactive">{tSync('admin.facilities.status.inactive', 'Inactive')}</option>
            </select>

            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="list">{tSync('admin.facilities.view.list', 'List View')}</option>
              <option value="table">{tSync('admin.facilities.view.table', 'Table View')}</option>
              <option value="grid">{tSync('admin.facilities.view.grid', 'Grid View')}</option>
              <option value="map">{tSync('admin.facilities.view.map', 'Map View')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              {tSync('admin.common.loading', 'Loading...')}
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchFilter ? 
                tSync('admin.facilities.noResults', 'No facilities match your search criteria') :
                tSync('admin.facilities.empty', 'No facilities found')
              }
            </div>
          ) : (
            <>
              {displayMode === 'table' && (
                <FacilityTableView
                  facilities={filteredFacilities}
                  onView={handleView}
                  onCalendar={handleCalendar}
                  onEdit={handleEdit}
                />
              )}
              {displayMode === 'grid' && (
                <FacilityGridView
                  facilities={filteredFacilities}
                  onView={handleView}
                  onCalendar={handleCalendar}
                  onEdit={handleEdit}
                />
              )}
              {displayMode === 'list' && (
                <FacilityListViewDisplay
                  facilities={filteredFacilities}
                  onView={handleView}
                  onCalendar={handleCalendar}
                  onEdit={handleEdit}
                />
              )}
              {displayMode === 'map' && (
                <FacilityMapViewComponent
                  facilities={filteredFacilities}
                  isLoading={false}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
