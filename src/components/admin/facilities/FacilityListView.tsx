import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, FiltersBar, ViewToggle } from "@/components/layouts";
import { FacilityCalendarView } from "./calendar/FacilityCalendarView";
import { FacilityDetailView } from "./detail/FacilityDetailView";
import { FacilityGridView } from "./views/FacilityGridView";
import { FacilityListViewDisplay } from "./views/FacilityListViewDisplay";
import { FacilityTableView } from "./views/FacilityTableView";
import { FacilityMapView } from "./views/FacilityMapView";
import { useTranslation } from "@/hooks/useTranslation";
import { useFacilityAdmin } from "@/hooks/useFacilityAdmin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FacilityListViewProps {
  selectedFacilityId?: number;
  onFacilitySelect?: (id: number) => void;
}

type ViewMode = 'list' | 'calendar' | 'detail';
type DisplayMode = 'table' | 'grid' | 'list' | 'map';
type StoreViewMode = 'table' | 'grid' | 'list';

export const FacilityListView: React.FC<FacilityListViewProps> = ({
  selectedFacilityId,
  onFacilitySelect
}) => {
  const navigate = useNavigate();
  const [viewMode, setLocalViewMode] = React.useState<ViewMode>('list');
  const [selectedFacility, setSelectedFacility] = React.useState<any>(null);
  const { tSync } = useTranslation();

  // Use our combined hook for both entity data and UI state
  const {
    facilities,
    isLoading,
    error,
    filters,
    viewMode: storeViewMode,
    setViewMode,
    setFilters,
    fetchFacilities,
    handleFacilitySelect: selectFacility
  } = useFacilityAdmin();
  
  // Local display mode that can include 'map' which isn't in the store
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>(storeViewMode as DisplayMode || 'list');

  // Local search/filter state
  const [searchTerm, setSearchTerm] = React.useState(filters.search || "");
  const [filterType, setFilterType] = React.useState(filters.category || "all");
  const [filterStatus, setFilterStatus] = React.useState(filters.status || "all");

  // Load facilities on mount and when filters change
  useEffect(() => {
    fetchFacilities();
    // eslint-disable-next-line
  }, [filters]);

  // Filter facilities locally (can be moved to store if needed)
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = !searchTerm || 
                         facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         facility.area?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || facility.type === filterType;
    const matchesStatus = filterStatus === "all" || facility.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddNew = () => {
    navigate('/admin/facilities/new');
  };

  const handleEdit = (facility: any) => {
    navigate(`/admin/facilities/${facility.id}`);
  };

  const handleFacilitySelect = (facility: any) => {
    selectFacility(facility); // Use the combined action from our hook
    setSelectedFacility(facility);
    setLocalViewMode('detail');
    if (onFacilitySelect) {
      onFacilitySelect(facility.id);
    }
  };

  const handleCalendar = (facility: any) => {
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
    
    // Only set store viewMode if it's a valid store view mode (not 'map')
    if (['list', 'grid', 'table'].includes(viewId)) {
      setViewMode(viewId as StoreViewMode);
    }
  };

  const viewOptions = [
    { id: 'table', label: tSync("admin.facilities.views.table", "Table"), icon: () => <div>📊</div> },
    { id: 'grid', label: tSync("admin.facilities.views.grid", "Grid"), icon: () => <div>⬜</div> },
    { id: 'list', label: tSync("admin.facilities.views.list", "List"), icon: () => <div>📋</div> },
    { id: 'map', label: tSync("admin.facilities.views.map", "Map"), icon: () => <div>🗺️</div> }
  ];

  const filterOptions = [
    {
      id: 'type',
      label: tSync("admin.facilities.filters.type", "Type"),
      value: filterType,
      onChange: (val: string) => {
        setFilterType(val);
        setFilters({ category: val === 'all' ? undefined : val });
      },
      options: [
        { value: 'all', label: tSync("admin.facilities.filters.allTypes", "All Types") },
        { value: 'sports', label: tSync("admin.facilities.filters.sports", "Sports") },
        { value: 'meeting', label: tSync("admin.facilities.filters.meeting", "Meeting") }
      ]
    },
    {
      id: 'status',
      label: tSync("admin.facilities.filters.status", "Status"),
      value: filterStatus,
      onChange: (val: string) => {
        setFilterStatus(val);
        setFilters({ status: val === 'all' ? undefined : val });
      },
      options: [
        { value: 'all', label: tSync("admin.facilities.filters.allStatuses", "All Statuses") },
        { value: 'active', label: tSync("admin.facilities.filters.active", "Active") },
        { value: 'inactive', label: tSync("admin.facilities.filters.inactive", "Inactive") }
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
          {tSync("admin.facilities.search.noResults", "No facilities found matching your criteria.")}
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
        return <FacilityMapView facilities={filteredFacilities} isLoading={isLoading} />;
      default:
        return <FacilityTableView {...commonProps} />;
    }
  };

  if (viewMode === 'calendar' && selectedFacility) {
    return (
      <FacilityCalendarView 
        facility={selectedFacility} 
        onBack={handleBack} 
      />
    );
  }
  if (viewMode === 'detail' && selectedFacility) {
    return (
      <FacilityDetailView 
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
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{tSync("admin.facilities.management", "Facilities Management")}</h1>
          <p className="text-gray-500 text-sm mt-1">{tSync("admin.facilities.pageDescription", "Manage facility information, availability and settings")}</p>
        </div>
        <Button onClick={handleAddNew} size="sm" className="mt-3 sm:mt-0 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {tSync("admin.facilities.addNew", "Add New Facility")}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
        <FiltersBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
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
