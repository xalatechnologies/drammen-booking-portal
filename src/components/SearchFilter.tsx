
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { X, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchInput from "@/components/search/SearchInput";
import DateRangePicker from "@/components/search/DateRangePicker";
import FilterSelects from "@/components/search/FilterSelects";
import ViewModeToggle from "@/components/search/ViewModeToggle";
import ActiveFilters from "@/components/search/ActiveFilters";
import AdvancedFilters from "@/components/search/AdvancedFilters";

interface SearchFilterProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  viewMode: "grid" | "map" | "calendar" | "list";
  setViewMode: (mode: "grid" | "map" | "calendar" | "list") => void;
  accessibility: string;
  setAccessibility: (accessibility: string) => void;
  capacity: number[];
  setCapacity: (capacity: number[]) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  date,
  setDate,
  facilityType,
  setFacilityType,
  location,
  setLocation,
  viewMode,
  setViewMode,
  accessibility,
  setAccessibility,
  capacity,
  setCapacity,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const clearFilters = () => {
    setDate(undefined);
    setDateRange(undefined);
    setFacilityType("all");
    setLocation("all");
    setAccessibility("all");
    setCapacity([0, 200]);
    setSearchTerm("");
  };

  const hasActiveFilters = date || dateRange || (facilityType && facilityType !== "all") || (location && location !== "all") || (accessibility && accessibility !== "all") || capacity[0] > 0 || capacity[1] < 200 || searchTerm;
  const hasAdvancedFilters = dateRange || (accessibility && accessibility !== "all") || capacity[0] > 0 || capacity[1] < 200;

  return (
    <Card className="mb-8 shadow-lg">
      <CardContent className="p-6">
        {/* Main Search Row */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch mb-4">
          {/* Search Input */}
          <div className="lg:flex-1">
            <SearchInput 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          {/* Date Range Picker */}
          <div className="lg:w-64">
            <DateRangePicker 
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>

          {/* Search Button */}
          <Button className="h-14 px-8 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg">
            <Search className="h-5 w-5 mr-2" />
            Søk
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch mb-4">
          <div className="lg:flex-1">
            <FilterSelects 
              facilityType={facilityType}
              setFacilityType={setFacilityType}
              location={location}
              setLocation={setLocation}
              accessibility={accessibility}
              setAccessibility={setAccessibility}
              capacity={capacity}
              setCapacity={setCapacity}
              showOnlyMain={true}
            />
          </div>

          {/* Advanced Filters Button */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`h-14 px-6 border-2 text-lg font-medium ${
              showAdvanced || hasAdvancedFilters
                ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filtre
          </Button>

          {/* View Mode Toggle */}
          <ViewModeToggle 
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        {/* Advanced Filters - Expandable */}
        {showAdvanced && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Avanserte filtre</h3>
            <AdvancedFilters 
              accessibility={accessibility}
              setAccessibility={setAccessibility}
              capacity={capacity}
              setCapacity={setCapacity}
            />
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters} 
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Nullstill filtre
            </Button>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <ActiveFilters 
            dateRange={dateRange}
            setDateRange={setDateRange}
            facilityType={facilityType}
            setFacilityType={setFacilityType}
            location={location}
            setLocation={setLocation}
            accessibility={accessibility}
            setAccessibility={setAccessibility}
            capacity={capacity}
            setCapacity={setCapacity}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
