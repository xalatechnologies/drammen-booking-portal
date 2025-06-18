
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
  const hasAdvancedFilters = (accessibility && accessibility !== "all") || capacity[0] > 0 || capacity[1] < 200;

  return (
    <div className="mb-8">
      <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
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

                {/* Date Range */}
                <div className="lg:w-64">
                  <DateRangePicker 
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex gap-3">
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
                  
                  {/* Filter Toggle Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`h-11 px-4 border-2 transition-all ${
                      showAdvanced || hasAdvancedFilters
                        ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>

                  {/* Search Button */}
                  <Button className="h-11 px-6 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg shadow-sm">
                    <Search className="h-4 w-4 mr-2" />
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
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Avanserte filtre</h3>
                  <ViewModeToggle 
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                </div>
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
