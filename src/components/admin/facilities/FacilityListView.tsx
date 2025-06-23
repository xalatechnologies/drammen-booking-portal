import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, FiltersBar, ViewToggle } from "@/components/layouts";
import { FacilityCalendarView } from "./calendar/FacilityCalendarView";
import { FacilityDetailView } from "./detail/FacilityDetailView";
import { FacilityGridView } from "./views/FacilityGridView";
import { FacilityListViewDisplay } from "./views/FacilityListViewDisplay";
import { FacilityTableView } from "./views/FacilityTableView";
import { FacilityMapView } from "./views/FacilityMapView";
import { useTranslation } from "@/hooks/useTranslation";
import { useFacilityAdminStore } from "@/stores/useFacilityAdminStore";

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
  const [selectedFacility, setSelectedFacility] = React.useState<any>(null);
  const { tSync } = useTranslation();

  // Zustand store
  const {
    facilities,
    isLoading,
    error,
    filters,
    viewMode: displayMode,
    setViewMode,
    setFilters,
    loadFacilities
  } = useFacilityAdminStore();

  // Local search/filter state
  const [searchTerm, setSearchTerm] = React.useState(filters.searchTerm || "");
  const [filterType, setFilterType] = React.useState(filters.facilityType || "all");
  const [filterStatus, setFilterStatus] = React.useState("all");

  // Load facilities on mount and when filters change
  useEffect(() => {
    loadFacilities();
    // eslint-disable-next-line
  }, [filters]);

  // Filter facilities locally (can be moved to store if needed)
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
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

  const handleView = (facility: any) => {
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
    setViewMode(viewId as any); // Zustand store for display mode
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
        setFilters({ facilityType: val === 'all' ? undefined : val });
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
      onChange: (val: string) => setFilterStatus(val),
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
      onView: handleView,
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
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-b-lg">
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
      </div>
      <div className="pt-2">
        {renderFacilityContent()}
      </div>
    </div>
  );
};
