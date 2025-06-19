
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search/SearchInput";
import DateRangePicker from "@/components/search/DateRangePicker";
import FilterSelects from "@/components/search/FilterSelects";
import ViewModeToggle from "@/components/search/ViewModeToggle";
import ActiveFilters from "@/components/search/ActiveFilters";
import AdvancedFilters from "@/components/search/AdvancedFilters";
import { useTranslation } from "@/i18n/hooks/useTranslation";

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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  availableNow: boolean;
  setAvailableNow: (available: boolean) => void;
  hasEquipment: boolean;
  setHasEquipment: (has: boolean) => void;
  hasParking: boolean;
  setHasParking: (has: boolean) => void;
  hasWifi: boolean;
  setHasWifi: (has: boolean) => void;
  allowsPhotography: boolean;
  setAllowsPhotography: (allows: boolean) => void;
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
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  availableNow,
  setAvailableNow,
  hasEquipment,
  setHasEquipment,
  hasParking,
  setHasParking,
  hasWifi,
  setHasWifi,
  allowsPhotography,
  setAllowsPhotography,
}) => {
  const { t } = useTranslation();
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
    setPriceRange([0, 5000]);
    setAvailableNow(false);
    setHasEquipment(false);
    setHasParking(false);
    setHasWifi(false);
    setAllowsPhotography(false);
  };

  const hasActiveFilters = date || dateRange || (facilityType && facilityType !== "all") || (location && location !== "all") || (accessibility && accessibility !== "all") || capacity[0] > 0 || capacity[1] < 200 || searchTerm || priceRange[0] > 0 || priceRange[1] < 5000 || availableNow || hasEquipment || hasParking || hasWifi || allowsPhotography;

  return (
    <div className="mb-8">
      {/* Main Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-md border">
        {/* Search Input */}
        <div className="mb-6">
          <SearchInput 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
          {/* Filters */}
          <div className="lg:col-span-2">
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t('search.actions.moreFilters')}
            </Button>
            
            <ViewModeToggle 
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t">
            <AdvancedFilters 
              accessibility={accessibility}
              setAccessibility={setAccessibility}
              capacity={capacity}
              setCapacity={setCapacity}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availableNow={availableNow}
              setAvailableNow={setAvailableNow}
              hasEquipment={hasEquipment}
              setHasEquipment={setHasEquipment}
              hasParking={hasParking}
              setHasParking={setHasParking}
              hasWifi={hasWifi}
              setHasWifi={setHasWifi}
              allowsPhotography={allowsPhotography}
              setAllowsPhotography={setAllowsPhotography}
            />
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4">
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
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availableNow={availableNow}
              setAvailableNow={setAvailableNow}
              hasEquipment={hasEquipment}
              setHasEquipment={setHasEquipment}
              hasParking={hasParking}
              setHasParking={setHasParking}
              hasWifi={hasWifi}
              setHasWifi={setHasWifi}
              allowsPhotography={allowsPhotography}
              setAllowsPhotography={setAllowsPhotography}
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
              className="text-gray-500 hover:text-red-600"
            >
              <X className="h-4 w-4 mr-2" />
              {t('search.actions.clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
