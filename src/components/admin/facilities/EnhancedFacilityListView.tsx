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

interface EnhancedFacilityListViewProps {
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

export const EnhancedFacilityListView: React.FC<EnhancedFacilityListViewProps> = ({
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Facility Management</h2>
          <p className="text-muted-foreground">
            {filteredFacilities.length} of {facilities.length} facilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Facility
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters & Search
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search facilities..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.area} onValueChange={(value) => updateFilter('area', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Area" />
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
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
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

      {/* Bulk Actions */}
      {selectedFacilities.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedFacilities.length} facilities selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedFacilities([])}>
                  Clear Selection
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading/Error States */}
      {isLoading && (
        <div className="text-center py-8">Loading facilities...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          Error loading facilities: {error.message}
        </div>
      )}

      {/* Facilities Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedFacilities.length === filteredFacilities.length && filteredFacilities.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price/Hour</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacilities.map((facility: any) => (
                <TableRow 
                  key={facility.id}
                  className={`cursor-pointer ${
                    selectedFacilityId === facility.id ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => onFacilitySelect?.(facility.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedFacilities.includes(facility.id)}
                      onCheckedChange={(checked) => handleSelectFacility(facility.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="font-medium">{facility.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {facility.address_street || facility.address}, {facility.address_city || facility.city}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{facility.type}</TableCell>
                  <TableCell>{facility.area}</TableCell>
                  <TableCell>
                    <Badge variant={facility.status === 'active' ? 'default' : 'secondary'}>
                      {facility.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{facility.capacity}</TableCell>
                  <TableCell>{facility.pricePerHour || 0} kr</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onFacilitySelect?.(facility.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(facility)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(facility.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
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
            <div className="text-center py-8 text-muted-foreground">
              No facilities found. {filters.searchTerm && "Try adjusting your search terms."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
