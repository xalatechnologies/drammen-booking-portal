
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FacilityService } from "@/services/facilityService";
import { FacilityFormView } from "./FacilityFormView";
import { 
  Plus, Edit, Trash2, Search, Filter, Download, 
  Upload, MoreHorizontal, Eye, MapPin, Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FacilityListViewProps {
  selectedFacilityId?: number;
  onFacilitySelect?: (id: number) => void;
}

interface FacilityFilters {
  searchTerm: string;
  status: string;
  type: string;
  area: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const FacilityListView: React.FC<FacilityListViewProps> = ({
  selectedFacilityId,
  onFacilitySelect
}) => {
  const [filters, setFilters] = useState<FacilityFilters>({
    searchTerm: "",
    status: "all",
    type: "all", 
    area: "all",
    sortBy: "name",
    sortOrder: "asc"
  });
  const [showForm, setShowForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const queryClient = useQueryClient();

  const { data: facilitiesResponse, isLoading, error } = useQuery({
    queryKey: ['admin-facilities', filters],
    queryFn: () => FacilityService.getFacilities(
      { page: 1, limit: 100 },
      { 
        searchTerm: filters.searchTerm,
        facilityType: filters.type !== 'all' ? filters.type : undefined,
        location: filters.area !== 'all' ? filters.area : undefined
      },
      {}
    ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => FacilityService.deleteFacility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
      toast({
        title: "Success",
        description: "Facility deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete facility",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await FacilityService.deleteFacility(id.toString());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
      setSelectedFacilities([]);
      toast({
        title: "Success",
        description: `${selectedFacilities.length} facilities deleted successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete facilities",
        variant: "destructive",
      });
    },
  });

  const facilities = facilitiesResponse?.success ? facilitiesResponse.data?.data || [] : [];

  const filteredFacilities = useMemo(() => {
    let filtered = [...facilities];

    if (filters.status !== 'all') {
      filtered = filtered.filter(f => f.status === filters.status);
    }

    // Sort facilities
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof typeof a];
      const bValue = b[filters.sortBy as keyof typeof b];
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [facilities, filters]);

  const uniqueTypes = useMemo(() => {
    return [...new Set(facilities.map(f => f.type))];
  }, [facilities]);

  const uniqueAreas = useMemo(() => {
    return [...new Set(facilities.map(f => f.area))];
  }, [facilities]);

  const handleEdit = (facility: any) => {
    setEditingFacility(facility);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this facility?")) {
      deleteMutation.mutate(id.toString());
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedFacilities.length} facilities?`)) {
      bulkDeleteMutation.mutate(selectedFacilities);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFacilities(filteredFacilities.map(f => f.id));
    } else {
      setSelectedFacilities([]);
    }
  };

  const handleSelectFacility = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedFacilities(prev => [...prev, id]);
    } else {
      setSelectedFacilities(prev => prev.filter(fId => fId !== id));
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Name', 'Type', 'Area', 'Status', 'Capacity', 'Price/Hour'].join(','),
      ...filteredFacilities.map(f => 
        [f.id, f.name, f.type, f.area, f.status, f.capacity, f.pricePerHour || 0].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'facilities.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const updateFilter = (key: keyof FacilityFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      status: "all",
      type: "all", 
      area: "all",
      sortBy: "name",
      sortOrder: "asc"
    });
  };

  if (showForm) {
    return (
      <FacilityFormView
        facility={editingFacility}
        onSuccess={() => {
          setShowForm(false);
          setEditingFacility(null);
          queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingFacility(null);
        }}
      />
    );
  }

  return (
    <div className="w-full space-y-8 p-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Facility Management</h1>
          <p className="text-xl text-muted-foreground">
            {filteredFacilities.length} of {facilities.length} facilities
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" onClick={handleExport} className="text-base px-6 py-3">
            <Download className="w-5 h-5 mr-2" />
            Export Data
          </Button>
          <Button size="lg" onClick={() => setShowForm(true)} className="text-base px-6 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Add New Facility
          </Button>
        </div>
      </div>

      {/* Enhanced Filters Card */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-2xl font-semibold">
              <Filter className="w-6 h-6 mr-3 text-blue-600" />
              Search & Filters
            </CardTitle>
            <Button variant="ghost" size="lg" onClick={clearFilters} className="text-base">
              Clear All Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search facilities by name, location..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="pl-12 h-12 text-base border-2 focus:border-blue-500"
                />
              </div>
            </div>
            
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="h-12 text-base border-2">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger className="h-12 text-base border-2">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.area} onValueChange={(value) => updateFilter('area', value)}>
              <SelectTrigger className="h-12 text-base border-2">
                <SelectValue placeholder="Filter by Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {uniqueAreas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
            }}>
              <SelectTrigger className="h-12 text-base border-2">
                <SelectValue placeholder="Sort Options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="capacity-asc">Capacity Low-High</SelectItem>
                <SelectItem value="capacity-desc">Capacity High-Low</SelectItem>
                <SelectItem value="pricePerHour-asc">Price Low-High</SelectItem>
                <SelectItem value="pricePerHour-desc">Price High-Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Bulk Actions */}
      {selectedFacilities.length > 0 && (
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">
                {selectedFacilities.length} facilities selected
              </span>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="lg" onClick={() => setSelectedFacilities([])} className="text-base">
                  Clear Selection
                </Button>
                <Button 
                  variant="destructive" 
                  size="lg" 
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                  className="text-base px-6"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading/Error States */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="text-2xl text-gray-600">Loading facilities...</div>
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <div className="text-2xl text-red-600">
            Error loading facilities: {error.message}
          </div>
        </div>
      )}

      {/* Enhanced Facilities Table */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b-2">
                <TableHead className="w-16 py-6">
                  <Checkbox
                    checked={selectedFacilities.length === filteredFacilities.length && filteredFacilities.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="w-5 h-5"
                  />
                </TableHead>
                <TableHead className="text-base font-semibold text-gray-900 py-6">Facility Details</TableHead>
                <TableHead className="text-base font-semibold text-gray-900 py-6">Type</TableHead>
                <TableHead className="text-base font-semibold text-gray-900 py-6">Area</TableHead>
                <TableHead className="text-base font-semibold text-gray-900 py-6">Status</TableHead>
                <TableHead className="text-base font-semibold text-gray-900 py-6">Capacity</TableHead>
                <TableHead className="text-base font-semibold text-gray-900 py-6">Price/Hour</TableHead>
                <TableHead className="w-24 text-base font-semibold text-gray-900 py-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacilities.map((facility: any) => (
                <TableRow 
                  key={facility.id}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                    selectedFacilityId === facility.id ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => onFacilitySelect?.(facility.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()} className="py-6">
                    <Checkbox
                      checked={selectedFacilities.includes(facility.id)}
                      onCheckedChange={(checked) => handleSelectFacility(facility.id, checked as boolean)}
                      className="w-5 h-5"
                    />
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900 mb-1">{facility.name}</div>
                        <div className="text-base text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {facility.address_street || facility.address}, {facility.address_city || facility.city}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-base py-6">{facility.type}</TableCell>
                  <TableCell className="text-base py-6">{facility.area}</TableCell>
                  <TableCell className="py-6">
                    <Badge 
                      variant={facility.status === 'active' ? 'default' : 'secondary'}
                      className="text-sm px-3 py-1"
                    >
                      {facility.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-base py-6 font-medium">{facility.capacity}</TableCell>
                  <TableCell className="text-base py-6 font-medium">{facility.pricePerHour || 0} kr</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()} className="py-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-10 w-10">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onFacilitySelect?.(facility.id)} className="text-base py-3">
                          <Eye className="w-4 h-4 mr-3" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(facility)} className="text-base py-3">
                          <Edit className="w-4 h-4 mr-3" />
                          Edit Facility
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(facility.id)}
                          className="text-destructive text-base py-3"
                        >
                          <Trash2 className="w-4 h-4 mr-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredFacilities.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="text-2xl text-muted-foreground mb-2">No facilities found</div>
              {filters.searchTerm && (
                <div className="text-lg text-gray-500">Try adjusting your search terms or filters</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
