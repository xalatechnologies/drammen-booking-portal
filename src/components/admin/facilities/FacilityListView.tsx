
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, Calendar, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, FiltersBar, ViewToggle } from "@/components/layouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facility, OpeningHours } from "@/types/facility";
import { useJsonTranslation } from "@/hooks/useJsonTranslation";

// Import the components we created
import FacilityTableView from "./FacilityTableView";
import FacilityGridView from "./FacilityGridView";
import FacilityListViewDisplay from "./FacilityListViewDisplay";
import FacilityMapViewComponent from "./FacilityMapViewComponent";
import FacilityCalendarViewComponent from "./FacilityCalendarViewComponent";
import FacilityDetailViewComponent from "./FacilityDetailViewComponent";

// Local WEEKDAYS constant for mock data
const WEEKDAYS = [
  "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"
];

// Create a helper function to generate full facility objects
const createMockFacility = (baseData: any): Facility => ({
  // Core facility fields
  id: baseData.id,
  name: baseData.name,
  type: baseData.type,
  status: baseData.status,
  capacity: baseData.capacity,
  area: baseData.area || "Drammen",
  description: baseData.description || null,
  
  // Address fields - both formats for compatibility
  address: baseData.address,
  address_street: baseData.address.split(',')[0] || baseData.address,
  address_city: baseData.address.split(',')[1]?.trim() || "Drammen",
  address_postal_code: baseData.address.match(/\d{4}/)?.[0] || "3000",
  address_country: "Norway",
  
  // Pricing and booking
  price_per_hour: 450,
  pricePerHour: 450,
  time_slot_duration: 1,
  timeSlotDuration: 1 as 1 | 2,
  has_auto_approval: false,
  hasAutoApproval: false,
  allowed_booking_types: baseData.allowed_booking_types,
  booking_lead_time_hours: 2,
  max_advance_booking_days: 365,
  cancellation_deadline_hours: 24,
  
  // Availability and features
  next_available: baseData.nextAvailable,
  nextAvailable: baseData.nextAvailable,
  rating: null,
  review_count: 0,
  is_featured: false,
  
  // Location and media
  latitude: null,
  longitude: null,
  image_url: null,
  image: "",
  
  // Arrays and features
  amenities: [],
  equipment: [],
  accessibility_features: [],
  accessibility: [],
  suitableFor: [],
  
  // Season and contact
  season_from: baseData.season?.from,
  season_to: baseData.season?.to,
  season: baseData.season,
  contact_name: null,
  contact_email: null,
  contact_phone: null,
  
  // Dates
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  area_sqm: null,
  
  // Related data
  openingHours: baseData.openingHours,
  zones: [],
  featuredImage: undefined,
  images: undefined,
  availableTimes: undefined,
});

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

  // Mock data for development - create proper Facility objects
  const mockFacilitiesBase = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      address: "Knoffs gate 8, 3044 Drammen",
      type: "Gymsal",
      status: "active" as const,
      capacity: 120,
      nextAvailable: "I dag, 18:00",
      allowed_booking_types: ["engangs", "fastlan"],
      openingHours: WEEKDAYS.map((day, index) => ({
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
      })) as OpeningHours[],
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 2,
      name: "Fjell Skole - Aktivitetshall",
      address: "Lauritz Grønlands vei 40, 3035 Drammen",
      type: "Aktivitetshall",
      status: "active" as const,
      capacity: 200,
      nextAvailable: "Fredag, 17:00",
      allowed_booking_types: ["engangs", "rammetid", "strotimer"],
      openingHours: WEEKDAYS.map((day, index) => ({
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
      })) as OpeningHours[],
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 3,
      name: "Gulskogen Skole - Auditorium",
      address: "Smithestrømsveien 13, 3048 Drammen",
      type: "Auditorium",
      status: "maintenance" as const,
      capacity: 150,
      nextAvailable: "Torsdag, 19:00",
      allowed_booking_types: ["engangs"],
      openingHours: WEEKDAYS.map((day, index) => ({
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
      })) as OpeningHours[],
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 4,
      name: "Marienlyst Stadion - Møtesal",
      address: "Marienlyst 14, 3045 Drammen",
      type: "Møterom",
      status: "active" as const,
      capacity: 80,
      nextAvailable: "Lørdag, 10:00",
      allowed_booking_types: ["fastlan", "rammetid"],
      openingHours: WEEKDAYS.map((day, index) => ({
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
      })) as OpeningHours[],
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 5,
      name: "Drammensbadet - Svømmehall",
      address: "Ormåsen 1, 3048 Drammen",
      type: "Svømmehall",
      status: "inactive" as const,
      capacity: 250,
      nextAvailable: "Søndag, 12:00",
      allowed_booking_types: ["engangs", "strotimer"],
      openingHours: WEEKDAYS.map((day, index) => ({
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
      })) as OpeningHours[],
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 6,
      name: "Åssiden Fotballhall",
      address: "Buskerudveien 54, 3024 Drammen",
      type: "Fotballhall",
      status: "active" as const,
      capacity: 300,
      nextAvailable: "Lørdag, 18:30",
      allowed_booking_types: ["engangs", "fastlan", "rammetid", "strotimer"],
      openingHours: WEEKDAYS.map((day, index) => ({
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
      })) as OpeningHours[],
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 7,
      name: "Drammen Bibliotek - Møterom",
      address: "Grønland 32, 3045 Drammen",
      type: "Møterom",
      status: "active" as const,
      capacity: 40,
      nextAvailable: "I morgen, 14:00",
      allowed_booking_types: ["engangs"],
      openingHours: WEEKDAYS.map((day, index) => ({
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
      })) as OpeningHours[],
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
  ];

  const [facilities, setFacilities] = useState<Facility[]>(() => 
    mockFacilitiesBase.map(createMockFacility)
  );

  // Mock loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local display mode
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('list');

  // Local search/filter state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");

  // Filter facilities locally
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = !searchTerm || 
                         facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         facility.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || facility.type === filterType;
    const matchesStatus = filterStatus === "all" || facility.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
      id: 'type',
      label: tSync("admin.facilities.filters.type", "Type"),
      value: filterType,
      onChange: (val: string) => {
        setFilterType(val);
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
      },
      options: [
        { value: 'all', label: tSync("admin.facilities.filters.allStatuses", "All Status") },
        { value: 'active', label: tSync("admin.facilities.status.active", "Active") },
        { value: 'inactive', label: tSync("admin.facilities.status.inactive", "Inactive") }
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

