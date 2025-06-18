import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { X, ChevronDown, ChevronUp, Sliders } from "lucide-react";
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const clearFilters = () => {
    setDate(undefined);
    setDateRange(undefined);
    setFacilityType("all");
    setLocation("all");
    setAccessibility("all");
    setCapacity([0, 200]);
    setSearchTerm("");
  };
  
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const hasActiveFilters = date || dateRange || (facilityType && facilityType !== "all") || (location && location !== "all") || (accessibility && accessibility !== "all") || capacity[0] > 0 || capacity[1] < 200 || searchTerm;

  return (
    <div className="mb-8">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 lg:col-span-5">
              <SearchInput 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>

            <div className="md:col-span-4 lg:col-span-4">
              <DateRangePicker 
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>

            <div className="md:col-span-2 lg:col-span-2 flex justify-end">
              <Button 
                variant="outline" 
                onClick={toggleAdvancedFilters}
                className="mr-2 border-2 border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-blue-100 rounded-full text-base shadow-sm transition-all duration-200 px-4 h-12 flex items-center gap-2"
              >
                <Sliders className="h-4 w-4" />
                <span className="hidden sm:inline">Filtre</span>
                {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              <ViewModeToggle 
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FilterSelects 
                    facilityType={facilityType}
                    setFacilityType={setFacilityType}
                    location={location}
                    setLocation={setLocation}
                  />
                </div>
                <div>
                  <AdvancedFilters
                    accessibility={accessibility}
                    setAccessibility={setAccessibility}
                    capacity={capacity}
                    setCapacity={setCapacity}
                  />
                </div>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-500">Aktive filtre</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-9 text-sm hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  <span>Fjern alle</span>
                </Button>
              </div>
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