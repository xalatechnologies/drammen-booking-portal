import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FacilityService } from "@/services/facilityService";
import { EnhancedFacilityForm } from "./form/EnhancedFacilityForm";
import { FacilityCalendarView } from "./calendar/FacilityCalendarView";
import { FacilityDetailView } from "./detail/FacilityDetailView";
import { FacilityFiltersBar } from "./views/FacilityFiltersBar";
import { FacilityViewToggle } from "./views/FacilityViewToggle";
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
  const {
    tSync
  } = useTranslation();
  const {
    data: facilitiesResponse,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => FacilityService.getFacilities({
      page: 1,
      limit: 50
    }, {}, {})
  });
  const facilities = facilitiesResponse?.success ? facilitiesResponse.data?.data || [] : [];
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) || facility.area?.toLowerCase().includes(searchTerm.toLowerCase());
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
  const renderFacilityContent = () => {
    if (isLoading) {
      return <div className="text-center py-8">
          {tSync("admin.common.loading", "Laster...")}
        </div>;
    }
    if (filteredFacilities.length === 0) {
      return <div className="text-center py-8 text-gray-500">
          {tSync("admin.facilities.search.noResults", "Ingen lokaler funnet som matcher dine kriterier.")}
        </div>;
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
    return <EnhancedFacilityForm facility={selectedFacility} onSuccess={handleFormSuccess} onCancel={handleBack} />;
  }
  if (viewMode === 'calendar' && selectedFacility) {
    return <FacilityCalendarView facility={selectedFacility} onBack={handleBack} />;
  }
  if (viewMode === 'detail' && selectedFacility) {
    return <FacilityDetailView facility={selectedFacility} onBack={handleBack} onEdit={() => handleEdit(selectedFacility)} onCalendar={() => handleCalendar(selectedFacility)} />;
  }
  return <div className="w-full space-y-6 p-6 py-[27px] my-[23px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {tSync("admin.facilities.management", "Facilities Management")}
          </h1>
          <p className="text-gray-600">
            {tSync("admin.facilities.pageDescription", "Administrer lokalinformasjon, tilgjengelighet og innstillinger")}
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {tSync("admin.facilities.addNew", "Add New Facility")}
        </Button>
      </div>

      {/* Filters and Search */}
      <FacilityFiltersBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterType={filterType} setFilterType={setFilterType} filterStatus={filterStatus} setFilterStatus={setFilterStatus}>
        <FacilityViewToggle displayMode={displayMode} setDisplayMode={setDisplayMode} />
      </FacilityFiltersBar>

      {/* Facilities Content */}
      {renderFacilityContent()}
    </div>;
};