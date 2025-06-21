
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FacilityFiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    facilityType: string;
    status: string;
    area: string;
  }) => void;
  facilityTypes: string[];
  areas: string[];
}

const FacilityFilters: React.FC<FacilityFiltersProps> = ({
  onFiltersChange,
  facilityTypes,
  areas
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [status, setStatus] = useState("");
  const [area, setArea] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update filters when any value changes
  useEffect(() => {
    onFiltersChange({
      searchTerm,
      facilityType,
      status,
      area
    });
  }, [searchTerm, facilityType, status, area, onFiltersChange]);

  const clearFilters = () => {
    setSearchTerm("");
    setFacilityType("");
    setStatus("");
    setArea("");
  };

  const hasActiveFilters = searchTerm || facilityType || status || area;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Søk etter fasiliteter..."
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* Filter toggles */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-base px-4 py-2"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Skjul filtre' : 'Vis filtre'}
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-base px-4 py-2"
              >
                <X className="w-4 h-4 mr-2" />
                Nullstill filtre
              </Button>
            )}
          </div>

          {/* Advanced filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="block text-base font-medium text-gray-700">
                  Type fasiliteter
                </label>
                <Select value={facilityType} onValueChange={setFacilityType}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Alle typer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle typer</SelectItem>
                    {facilityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-gray-700">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Alle statuser" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle statuser</SelectItem>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="maintenance">Vedlikehold</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium text-gray-700">
                  Område
                </label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Alle områder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle områder</SelectItem>
                    {areas.map((areaOption) => (
                      <SelectItem key={areaOption} value={areaOption}>
                        {areaOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityFilters;
