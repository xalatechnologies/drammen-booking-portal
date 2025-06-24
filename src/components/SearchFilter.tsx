
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { useAppLocations } from "@/hooks/useAppData";

interface SearchFilterProps {
  onFilter: (filters: any) => void;
  onSearch: (query: string) => void;
}

export function SearchFilter({ onFilter, onSearch }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: locations, isLoading } = useAppLocations();

  // Extract unique types and areas from locations
  const uniqueTypes = React.useMemo(() => {
    if (!locations) return [];
    return [...new Set(locations.map(loc => loc.metadata?.type).filter(Boolean))];
  }, [locations]);

  const uniqueAreas = React.useMemo(() => {
    if (!locations) return [];
    return [...new Set(locations.map(loc => loc.metadata?.area).filter(Boolean))];
  }, [locations]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = () => {
    const filters = {
      type: selectedType || undefined,
      area: selectedArea || undefined,
      accessibility: selectedAccessibility.length > 0 ? selectedAccessibility : undefined,
    };
    onFilter(filters);
  };

  const clearFilters = () => {
    setSelectedType("");
    setSelectedArea("");
    setSelectedAccessibility([]);
    onFilter({});
  };

  const hasActiveFilters = selectedType || selectedArea || selectedAccessibility.length > 0;

  useEffect(() => {
    handleFilterChange();
  }, [selectedType, selectedArea, selectedAccessibility]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {[selectedType, selectedArea, ...selectedAccessibility].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Filter Options */}
        {isFilterOpen && (
          <div className="space-y-3 border-t pt-4">
            {/* Type Filter */}
            {uniqueTypes.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Area Filter */}
            {uniqueAreas.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Area</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedType && (
                  <Badge variant="secondary">
                    Type: {selectedType}
                    <button
                      onClick={() => setSelectedType("")}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedArea && (
                  <Badge variant="secondary">
                    Area: {selectedArea}
                    <button
                      onClick={() => setSelectedArea("")}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
