
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
          {/* Main Search Bar - Airbnb Style */}
          <div className="border-b border-gray-100">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                {/* Search Input */}
                <div className="lg:flex-1">
                  <SearchInput 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex gap-3 items-center">
                  <div className="min-w-[140px]">
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

                  {/* View Mode Toggle */}
                  <ViewModeToggle 
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                  
                  {/* Filter Toggle Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`h-12 px-5 border-2 transition-all text-base font-medium ${
                      showAdvanced || hasAdvancedFilters
                        ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Filter className="h-5 w-5" />
                  </Button>

                  {/* Search Button */}
                  <Button className="h-12 px-7 bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-sm text-base">
                    <Search className="h-5 w-5 mr-2" />
                    Søk
                  </Button>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 text-base"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Nullstill filtre
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Filters - Expandable */}
          {showAdvanced && (
            <div className="border-b border-gray-100 bg-gray-50">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Avanserte filtre</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Range */}
                  <div>
                    <DateRangePicker 
                      dateRange={dateRange}
                      setDateRange={setDateRange}
                    />
                  </div>
                  
                  {/* Advanced Filters */}
                  <div className="md:col-span-2">
                    <AdvancedFilters 
                      accessibility={accessibility}
                      setAccessibility={setAccessibility}
                      capacity={capacity}
                      setCapacity={setCapacity}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="p-6 pt-4">
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
