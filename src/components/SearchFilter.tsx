

import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchInput from "@/components/search/SearchInput";
import DateRangePicker from "@/components/search/DateRangePicker";
import FilterSelects from "@/components/search/FilterSelects";
import ViewModeToggle from "@/components/search/ViewModeToggle";
import ActiveFilters from "@/components/search/ActiveFilters";

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

  return (
    <div className="mb-8">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-3">
              <SearchInput 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>

            <div className="lg:col-span-3">
              <DateRangePicker 
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>

            <div className="lg:col-span-4">
              <FilterSelects 
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

            <div className="lg:col-span-2 flex justify-end">
              <ViewModeToggle 
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters} 
                className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600 rounded-full transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

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
    </div>
  );
};

export default SearchFilter;

