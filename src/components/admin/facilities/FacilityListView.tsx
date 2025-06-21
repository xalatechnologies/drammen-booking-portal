import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, FiltersBar, ViewToggle } from "@/components/layouts";
import { FacilityService } from "@/services/facilityService";
import { EnhancedFacilityForm } from "./form/EnhancedFacilityForm";
import { FacilityCalendarView } from "./calendar/FacilityCalendarView";
import { FacilityDetailView } from "./detail/FacilityDetailView";
import { FacilityGridView } from "./views/FacilityGridView";
import { FacilityListViewDisplay } from "./views/FacilityListViewDisplay";
import { FacilityTableView } from "./views/FacilityTableView";
import { FacilityMapView } from "./views/FacilityMapView";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityListViewProps {
  selectedFacilityId?: number;
  onFacilitySelect?: (id: number) => void;
}

type ViewMode = 'list' | 'form' | 'calendar' | 'detail';
type DisplayMode = 'table' | 'grid' | 'list' | 'map';

export const FacilityListView: React.FC<FacilityListViewProps> = ({
  selectedFacilityId,
  onFacilitySelect
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('table');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { tSync } = useTranslation();

  const { data: facilitiesResponse, isLoading, refetch } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => FacilityService.getFacilities({
      page: 1,
      limit: 50
    }, {}, {})
  });

  const facilities = facilitiesResponse?.success ? facilitiesResponse.data?.data || [] : [];

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         facility.area?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || facility.type === filterType;
    const matchesStatus = filterStatus === "all" || facility.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddNew = () => {
    setSelectedFacility(null);
    setViewMode('form');
  };

  const handleEdit = (facility: any) => {
    setSelectedFacility(facility);
    setViewMode('form');
  };

  const handleView = (facility: any) => {
    setSelectedFacility(facility);
    setViewMode('detail');
    if (onFacilitySelect) {
      onFacilitySelect(facility.id);
    }
  };

  const handleCalendar = (facility: any) => {
    setSelectedFacility(facility);
    setViewMode('calendar');
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setSelectedFacility(null);
    refetch();
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedFacility(null);
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
      onChange: setFilterType,
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
      onChange: setFilterStatus,
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

  if (viewMode === 'form') {
    return (
      <EnhancedFacilityForm 
        facility={selectedFacility} 
        onSuccess={handleFormSuccess} 
        onCancel={handleBack} 
      />
    );
  }

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
    <div className="space-y-6">
      <PageHeader
        title={tSync("admin.facilities.management", "Facilities Management")}
        description={tSync("admin.facilities.pageDescription", "Manage facility information, availability and settings")}
        actions={
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tSync("admin.facilities.addNew", "Add New Facility")}
          </Button>
        }
      />

      <FiltersBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={tSync("admin.facilities.search.placeholder", "Search facilities...")}
        selectFilters={filterOptions}
      >
        <ViewToggle
          views={viewOptions}
          activeView={displayMode}
          onViewChange={setDisplayMode}
        />
      </FiltersBar>

      {renderFacilityContent()}
    </div>
  );
};
