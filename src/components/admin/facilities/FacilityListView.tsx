import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Grid3X3, List, Table, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FacilityService } from "@/services/facilityService";
import { EnhancedFacilityForm } from "./form/EnhancedFacilityForm";
import { FacilityCalendarView } from "./calendar/FacilityCalendarView";
import { FacilityDetailView } from "./detail/FacilityDetailView";

interface FacilityListViewProps {
  selectedFacilityId?: number;
  onFacilitySelect?: (id: number) => void;
}

type ViewMode = 'list' | 'form' | 'calendar' | 'detail';
type DisplayMode = 'grid' | 'list' | 'table';

export const FacilityListView: React.FC<FacilityListViewProps> = ({
  selectedFacilityId,
  onFacilitySelect
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: facilitiesResponse, isLoading, refetch } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => FacilityService.getFacilities(
      { page: 1, limit: 50 },
      {},
      {}
    ),
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

  const renderFacilityGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFacilities.map((facility) => (
        <Card key={facility.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2">{facility.name}</CardTitle>
              <Badge
                variant={facility.status === 'active' ? 'default' : 
                        facility.status === 'maintenance' ? 'secondary' : 'destructive'}
              >
                {facility.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1">
              {facility.address_street}, {facility.address_city}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{facility.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{facility.capacity} people</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{facility.price_per_hour} NOK/hour</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleView(facility)} className="flex-1">
                <Grid3X3 className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCalendar(facility)}>
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(facility)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFacilityList = () => (
    <div className="space-y-4">
      {filteredFacilities.map((facility) => (
        <Card key={facility.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{facility.name}</h3>
                    <p className="text-sm text-gray-600">
                      {facility.address_street}, {facility.address_city}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-1 font-medium">{facility.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Capacity:</span>
                      <span className="ml-1 font-medium">{facility.capacity} people</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <span className="ml-1 font-medium">{facility.price_per_hour} NOK/hour</span>
                    </div>
                    <Badge
                      variant={facility.status === 'active' ? 'default' : 
                              facility.status === 'maintenance' ? 'secondary' : 'destructive'}
                    >
                      {facility.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => handleView(facility)}>
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCalendar(facility)}>
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(facility)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFacilityTable = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Location</th>
                <th className="text-left p-4 font-medium">Capacity</th>
                <th className="text-left p-4 font-medium">Price/Hour</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map((facility) => (
                <tr key={facility.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{facility.name}</div>
                      <div className="text-sm text-gray-500">{facility.area}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{facility.type}</td>
                  <td className="p-4 text-sm">
                    {facility.address_street}, {facility.address_city}
                  </td>
                  <td className="p-4 text-sm">{facility.capacity} people</td>
                  <td className="p-4 text-sm">{facility.price_per_hour} NOK</td>
                  <td className="p-4">
                    <Badge
                      variant={facility.status === 'active' ? 'default' : 
                              facility.status === 'maintenance' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {facility.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleView(facility)}>
                        <Grid3X3 className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCalendar(facility)}>
                        <Calendar className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(facility)}>
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderFacilityContent = () => {
    if (isLoading) {
      return <div className="text-center py-8">Loading facilities...</div>;
    }
    
    if (filteredFacilities.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No facilities found matching your criteria.
        </div>
      );
    }

    switch (displayMode) {
      case 'grid':
        return renderFacilityGrid();
      case 'list':
        return renderFacilityList();
      case 'table':
        return renderFacilityTable();
      default:
        return renderFacilityGrid();
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
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facilities Management</h1>
          <p className="text-gray-600">Manage facility information, availability, and settings</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Facility
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fotballhall">Football Hall</SelectItem>
                  <SelectItem value="idrettshall">Sports Hall</SelectItem>
                  <SelectItem value="gymsal">Gymnasium</SelectItem>
                  <SelectItem value="svømmehall">Swimming Pool</SelectItem>
                  <SelectItem value="møterom">Meeting Room</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup 
                type="single" 
                value={displayMode} 
                onValueChange={(value) => value && setDisplayMode(value as DisplayMode)}
                className="border border-gray-300 rounded-lg"
              >
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view">
                  <Table className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Content */}
      {renderFacilityContent()}
    </div>
  );
};
