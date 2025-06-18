
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
    <div className="mb-8">
      <Card className="border-0 shadow-lg bg-white overflow-hidden">
        <CardContent className="p-0">
          {/* Main Search Bar */}
          <div className="border-b border-gray-100">
            <div className="p-8">
              {/* Primary Search Row */}
              <div className="flex flex-col lg:flex-row gap-6 items-stretch mb-6">
                {/* Search Input - Takes most space */}
                <div className="lg:flex-1">
                  <SearchInput 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>

                {/* Date Range Picker */}
                <div className="lg:w-72">
                  <DateRangePicker 
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                  />
                </div>

                {/* Filters Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`h-14 px-8 border-2 transition-all text-lg font-medium ${
                    showAdvanced || hasAdvancedFilters
                      ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Filter className="h-6 w-6 mr-3" />
                  Filtre
                </Button>

                {/* View Mode Toggle */}
                <ViewModeToggle 
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              </div>

              {/* Quick Filters Row */}
              <div className="flex flex-col lg:flex-row gap-4 items-stretch">
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

                {/* Search Button */}
                <Button className="h-14 px-10 bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-sm text-lg">
                  <Search className="h-6 w-6 mr-3" />
                  Søk
                </Button>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex justify-end mt-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 text-lg"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Nullstill filtre
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Filters - Expandable */}
          {showAdvanced && (
            <div className="border-b border-gray-100 bg-gray-50">
              <div className="p-8">
                <h3 className="font-semibold text-gray-900 mb-6 text-xl">Avanserte filtre</h3>
                <AdvancedFilters 
                  accessibility={accessibility}
                  setAccessibility={setAccessibility}
                  capacity={capacity}
                  setCapacity={setCapacity}
                />
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="p-8 pt-6">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilter;
