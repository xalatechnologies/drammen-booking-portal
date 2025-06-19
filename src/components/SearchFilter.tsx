
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { X, Filter, Search, MapPin, Calendar, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const hasAdvancedFilters = dateRange || (accessibility && accessibility !== "all") || capacity[0] > 0 || capacity[1] < 200 || priceRange[0] > 0 || priceRange[1] < 5000 || availableNow || hasEquipment || hasParking || hasWifi || allowsPhotography;

  return (
    <div className="mb-8">
      {/* Main Search Section */}
      <div className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Search Input */}
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
        </div>
      </div>

      {/* Filters Section */}
      <div className="mt-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg py-12 px-6">
        {/* Quick Filters Row */}
        <div className="flex flex-col lg:flex-row gap-6 items-center mb-6">
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

          {/* Action Buttons */}
          <div className="flex gap-4">
            {/* Advanced Filters Button */}
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`h-14 px-6 border-2 text-base font-semibold transition-all duration-300 rounded-xl ${
                showAdvanced || hasAdvancedFilters
                  ? 'border-slate-500 bg-slate-50 text-slate-700 hover:bg-slate-100 shadow-md' 
                  : 'border-slate-300 hover:border-slate-500 hover:bg-slate-50/50'
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              {t('search.actions.moreFilters')}
              {hasAdvancedFilters && (
                <div className="ml-2 h-2 w-2 bg-slate-500 rounded-full"></div>
              )}
            </Button>

            {/* View Mode Toggle */}
            <ViewModeToggle 
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>
        </div>

        {/* Advanced Filters - Expandable */}
        {showAdvanced && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-fade-in">
            <div className="flex items-center mb-6">
              <Settings className="h-5 w-5 text-slate-600 mr-3" />
              <h3 className="font-bold text-slate-900 text-lg">{t('search.labels.advancedFilters')}</h3>
            </div>
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
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
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
