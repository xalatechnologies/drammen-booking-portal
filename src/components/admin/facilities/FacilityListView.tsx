
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, Calendar, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, FiltersBar, ViewToggle } from "@/components/layouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facility } from "@/types/facility";
import { useJsonTranslation } from "@/hooks/useJsonTranslation";
import { useFacilityAdmin } from "@/hooks/useFacilityAdmin";
import { FacilityDataUtils } from "@/utils/facilityDataUtils";

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

  // Use the real facility admin hook instead of mock data
  const {
    facilities,
    isLoading,
    error,
    filters,
    fetchFacilities,
    setSearchFilter,
    setStatusFilter,
    setCategoryFilter,
  } = useFacilityAdmin();

  // Local display mode
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('list');

  // Load facilities on component mount
  useEffect(() => {
    fetchFacilities();
  }, []);

  // Transform facilities to ensure they have proper images using FacilityDataUtils
  const transformedFacilities = React.useMemo(() => {
    return facilities.map(facility => ({
      ...facility,
      image: FacilityDataUtils.getImageUrl(facility.images),
      address: FacilityDataUtils.computeAddress(facility),
      openingHours: FacilityDataUtils.transformOpeningHours(facility.opening_hours),
      zones: FacilityDataUtils.transformZones(facility.zones),
      // Ensure these properties exist with defaults
      nextAvailable: facility.next_available || 'Available now',
      accessibility: facility.accessibility_features || [],
      suitableFor: facility.suitable_for || [],
      equipment: facility.equipment || [],
      availableTimes: facility.available_times || []
    }));
  }, [facilities]);

  // Filter facilities based on current filters
  const filteredFacilities = React.useMemo(() => {
    return transformedFacilities.filter(facility => {
      const matchesSearch = !filters.search || 
                           facility.name?.toLowerCase().includes(filters.search.toLowerCase()) || 
                           facility.address?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || !filters.status || facility.status === filters.status;
      const matchesCategory = filters.category === 'all' || !filters.category || facility.type === filters.category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [transformedFacilities, filters]);

  const handleAddNew = () => {
    navigate('/admin/facilities/new');
  };

  const handleEdit = (facility: Facility) => {
    navigate(`/admin/facilities/${facility.id}`);
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
    setLocalViewMode('detail');
    if (onFacilitySelect) {
      onFacilitySelect(facility.id);
    }
  };

  const handleCalendar = (facility: Facility) => {
    setSelectedFacility(facility);
    setLocalViewMode('calendar');
  };

  const handleBack = () => {
    setLocalViewMode('list');
    setSelectedFacility(null);
  };

  const handleViewModeChange = (viewId: string) => {
    setLocalViewMode(viewId as ViewMode);
    setDisplayMode(viewId as DisplayMode);
  };

  const viewOptions = [
    { id: 'table', label: tSync("admin.facilities.views.table", "Table"), icon: () => <div>📊</div> },
    { id: 'grid', label: tSync("admin.facilities.views.grid", "Grid"), icon: () => <div>⬜</div> },
    { id: 'list', label: tSync("admin.facilities.views.list", "List"), icon: () => <div>📋</div> },
    { id: 'map', label: tSync("admin.facilities.views.map", "Map"), icon: () => <div>🗺️</div> }
  ];

  const filterOptions = [
    {
      id: 'status',
      label: tSync("admin.facilities.filters.status", "Status"),
      value: filters.status || 'all',
      onChange: (val: string) => {
        setStatusFilter(val === 'all' ? undefined : val);
      },
      options: [
        { value: 'all', label: tSync("admin.facilities.filters.allStatuses", "All Status") },
        { value: 'active', label: tSync("admin.facilities.status.active", "Active") },
        { value: 'inactive', label: tSync("admin.facilities.status.inactive", "Inactive") },
        { value: 'maintenance', label: tSync("admin.facilities.status.maintenance", "Maintenance") }
      ]
    },
    {
      id: 'category',
      label: tSync("admin.facilities.filters.type", "Type"),
      value: filters.category || 'all',
      onChange: (val: string) => {
        setCategoryFilter(val === 'all' ? undefined : val);
      },
      options: [
        { value: 'all', label: tSync("admin.facilities.filters.allTypes", "All Types") },
        { value: 'Gymsal', label: 'Gymsal' },
        { value: 'Aktivitetshall', label: 'Aktivitetshall' },
        { value: 'Auditorium', label: 'Auditorium' },
        { value: 'Møterom', label: 'Møterom' },
        { value: 'Svømmehall', label: 'Svømmehall' },
        { value: 'Fotballhall', label: 'Fotballhall' }
      ]
    }
  ];

  const renderFacilityContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          {tSync("admin.common.loading", "Loading...")}
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      );
    }
    if (filteredFacilities.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {tSync("admin.facilities.search.noResults", "No facilities found")}
        </div>
      );
    }
    const commonProps = {
      facilities: filteredFacilities,
      onView: handleFacilitySelect,
      onCalendar: handleCalendar,
      onEdit: handleEdit
    };
    switch (displayMode) {
      case 'table':
        return <FacilityTableView {...commonProps} />;
      case 'grid':
        return <FacilityGridView {...commonProps} />;
      case 'list':
        return <FacilityListViewDisplay {...commonProps} />;
      case 'map':
        return <FacilityMapViewComponent facilities={filteredFacilities} isLoading={isLoading} />;
      default:
        return <FacilityTableView {...commonProps} />;
    }
  };

  if (viewMode === 'calendar' && selectedFacility) {
    return (
      <FacilityCalendarViewComponent 
        facility={selectedFacility} 
        onBack={handleBack} 
      />
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
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm rounded-t-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{tSync("admin.facilities.management", "Facility Management")}</h1>
          <p className="text-gray-500 text-sm mt-1">{tSync("admin.facilities.pageDescription", "Manage facilities and their configurations")}</p>
        </div>
        <Button onClick={handleAddNew} size="sm" className="mt-3 sm:mt-0 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {tSync("admin.facilities.addNew", "Add New Facility")}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
        <FiltersBar
          searchTerm={filters.search || ''}
          onSearchChange={setSearchFilter}
          searchPlaceholder={tSync("admin.facilities.search.placeholder", "Search facilities...")}
          selectFilters={filterOptions}
          className="flex-1"
        >
          <ViewToggle
            views={viewOptions}
            activeView={displayMode}
            onViewChange={handleViewModeChange}
          />
        </FiltersBar>
        </CardHeader>
      <CardContent>
        {renderFacilityContent()}
      </CardContent>
      </Card>

    </div>
  );
};
