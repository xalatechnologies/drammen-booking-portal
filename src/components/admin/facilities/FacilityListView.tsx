import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, Calendar, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, FiltersBar, ViewToggle } from "@/components/layouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facility as BaseFacility, OpeningHours } from "@/types/facility";
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

// Extended Facility type for admin views with additional properties
type AdminFacility = {
  id: number;
  name: string;
  address: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_country: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  image_url: string | null;
  image: string;
  capacity: number;
  area: string;
  description: string | null;
  next_available: string | null;
  nextAvailable: string;
  rating: number | null;
  review_count: number | null;
  price_per_hour: number;
  pricePerHour: number;
  has_auto_approval: boolean;
  hasAutoApproval: boolean;
  amenities: string[] | null;
  time_slot_duration: number;
  latitude: number | null;
  longitude: number | null;
  accessibility_features: string[] | null;
  accessibility: string[];
  equipment: string[] | null;
  allowed_booking_types: ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[];
  season_from: string | null;
  season_to: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  booking_lead_time_hours: number;
  max_advance_booking_days: number;
  cancellation_deadline_hours: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  area_sqm: number | null;
  suitableFor: string[];
  openingHours: OpeningHours[];
  zones: any[];
  featuredImage?: any;
  // Admin-specific fields
  lastBooking?: string;
  bookingInterval?: string;
  season?: { from: string; to: string };
};

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
  const [selectedFacility, setSelectedFacility] = useState<AdminFacility | null>(null);
  const { tSync } = useJsonTranslation();

  // Mock data for development
  const mockFacilities: AdminFacility[] = [
    {
      id: 1,
      name: "Brandengen Skole - Gymsal",
      address: "Knoffs gate 8, 3044 Drammen",
      type: "Gymsal",
      status: "active",
      capacity: 120,
      lastBooking: "2025-05-20",
      nextAvailable: "I dag, 18:00",
      allowed_booking_types: ["engangs", "fastlan"],
      openingHours: WEEKDAYS.map((day, index) => ({
        id: `${Math.random().toString(36).substring(2, 9)}`,
        facility_id: 1,
        day_of_week: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
        is_closed: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      })) as OpeningHours[],
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 2,
      name: "Fjell Skole - Aktivitetshall",
      address: "Lauritz Grønlands vei 40, 3035 Drammen",
      type: "Aktivitetshall",
      status: "active",
      capacity: 200,
      lastBooking: "2025-05-21",
      nextAvailable: "Fredag, 17:00",
      allowed_booking_types: ["engangs", "rammetid", "strotimer"],
      openingHours: WEEKDAYS.map((day, index) => ({
        id: `${Math.random().toString(36).substring(2, 9)}`,
        facility_id: 1,
        day_of_week: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
        is_closed: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      })) as OpeningHours[],
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 3,
      name: "Gulskogen Skole - Auditorium",
      address: "Smithestrømsveien 13, 3048 Drammen",
      type: "Auditorium",
      status: "maintenance",
      capacity: 150,
      lastBooking: "2025-05-15",
      nextAvailable: "Torsdag, 19:00",
      allowedBookingTypes: ["engangslan"],
      openingHours: WEEKDAYS.map((day, index) => ({
        id: `${Math.random().toString(36).substring(2, 9)}`,
        facility_id: 1,
        day_of_week: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
        is_closed: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      })) as OpeningHours[],
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 4,
      name: "Marienlyst Stadion - Møtesal",
      address: "Marienlyst 14, 3045 Drammen",
      type: "Møterom",
      status: "active",
      capacity: 80,
      lastBooking: "2025-05-18",
      nextAvailable: "Lørdag, 10:00",
      allowed_booking_types: ["fastlan", "rammetid"],
      openingHours: WEEKDAYS.map((day, index) => ({
        id: `${Math.random().toString(36).substring(2, 9)}`,
        facility_id: 1,
        day_of_week: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
        is_closed: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      })) as OpeningHours[],
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 5,
      name: "Drammensbadet - Svømmehall",
      address: "Ormåsen 1, 3048 Drammen",
      type: "Svømmehall",
      status: "inactive",
      capacity: 250,
      lastBooking: "2025-05-10",
      nextAvailable: "Søndag, 12:00",
      allowed_booking_types: ["engangs", "strotimer"],
      openingHours: WEEKDAYS.map((day, index) => ({
        id: `${Math.random().toString(36).substring(2, 9)}`,
        facility_id: 1,
        day_of_week: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
        is_closed: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      })) as OpeningHours[],
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 6,
      name: "Åssiden Fotballhall",
      address: "Buskerudveien 54, 3024 Drammen",
      type: "Fotballhall",
      status: "active",
      capacity: 300,
      lastBooking: "2025-05-19",
      nextAvailable: "Lørdag, 18:30",
      allowed_booking_types: ["engangs", "fastlan", "rammetid", "strotimer"],
      openingHours: WEEKDAYS.map((day, index) => ({
        id: `${Math.random().toString(36).substring(2, 9)}`,
        facility_id: 1,
        day_of_week: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
        is_closed: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      })) as OpeningHours[],
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
    {
      id: 7,
      name: "Drammen Bibliotek - Møterom",
      address: "Grønland 32, 3045 Drammen",
      type: "Møterom",
      status: "active",
      capacity: 40,
      lastBooking: "2025-05-21",
      nextAvailable: "I morgen, 14:00",
      allowedBookingTypes: ["engangslan"],
      openingHours: WEEKDAYS.map((day, index) => ({
        id: `${Math.random().toString(36).substring(2, 9)}`,
        facility_id: 1,
        day_of_week: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        opens: "08:00",
        closes: "22:00",
        is_closed: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      })) as OpeningHours[],
      bookingInterval: "30",
      season: { from: "2025-01-01", to: "2025-12-31" },
    },
  ];

  const [facilities, setFacilities] = useState<AdminFacility[]>(mockFacilities);

  // Mock loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local display mode
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('list');

  // Local search/filter state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");

  // No need to fetch facilities since we're using mock data

  // Filter facilities locally (can be moved to store if needed)
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

  const handleEdit = (facility: AdminFacility) => {
    navigate(`/admin/facilities/${facility.id}`);
  };

  const handleFacilitySelect = (facility: AdminFacility) => {
    setSelectedFacility(facility);
    setLocalViewMode('detail');
    if (onFacilitySelect) {
      onFacilitySelect(facility.id);
    }
  };

  const handleCalendar = (facility: AdminFacility) => {
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
        { value: 'all', label: tSync("admin.facilities.filters.allTypes") },
        { value: 'sports', label: tSync("admin.facilities.filters.sports") },
        { value: 'meeting', label: tSync("admin.facilities.filters.meeting") }
      ]
    },
    {
      id: 'status',
      label: tSync("admin.facilities.filters.status"),
      value: filterStatus,
      onChange: (val: string) => {
        setFilterStatus(val);
      },
      options: [
        { value: 'all', label: tSync("admin.facilities.filters.allStatuses") },
        { value: 'active', label: tSync("admin.facilities.filters.active") },
        { value: 'inactive', label: tSync("admin.facilities.filters.inactive") }
      ]
    }
  ];

  const renderFacilityContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          {tSync("admin.common.loading")}
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
          {tSync("admin.facilities.search.noResults")}
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
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{tSync("admin.facilities.management")}</h1>
          <p className="text-gray-500 text-sm mt-1">{tSync("admin.facilities.pageDescription")}</p>
        </div>
        <Button onClick={handleAddNew} size="sm" className="mt-3 sm:mt-0 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {tSync("admin.facilities.addNew")}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
        <FiltersBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={tSync("admin.facilities.search.placeholder")}
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
