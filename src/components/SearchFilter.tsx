
import React, { useState } from "react";
import { CalendarDays, Filter, Search, MapPin, Building, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ViewModeToggle from "@/components/search/ViewModeToggle";
import { useFacilityTypes, useLocations } from "@/hooks/useFilterOptions";
import { useTranslation } from "@/i18n";

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
  setHasEquipment: (hasEquipment: boolean) => void;
  hasParking: boolean;
  setHasParking: (hasParking: boolean) => void;
  hasWifi: boolean;
  setHasWifi: (hasWifi: boolean) => void;
  allowsPhotography: boolean;
  setAllowsPhotography: (allowsPhotography: boolean) => void;
}

const SearchFilter = ({
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
}: SearchFilterProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const { t } = useTranslation();
  
  const { data: facilityTypes = [], isLoading: loadingTypes } = useFacilityTypes();
  const { data: locations = [], isLoading: loadingLocations } = useLocations();

  const accessibilityOptions = [
    { value: "wheelchair", label: t('search.filters.accessibility.wheelchair') },
    { value: "hearing-loop", label: t('search.filters.accessibility.hearingLoop') },
    { value: "visual-guidance", label: t('search.filters.accessibility.visualGuidance') },
    { value: "braille", label: t('search.filters.accessibility.braille') }
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main search bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search input */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-slate-700"
            />
          </div>

          {/* Date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-12 px-4 border-gray-300 hover:border-slate-700 min-w-[200px] justify-start">
                <CalendarDays className="mr-2 h-4 w-4" />
                {date ? format(date, "dd.MM.yyyy") : t('search.filters.selectDate')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Facility type selector */}
          <Select value={facilityType} onValueChange={setFacilityType}>
            <SelectTrigger className="h-12 min-w-[180px] border-gray-300 focus:border-slate-700">
              <Building className="mr-2 h-4 w-4" />
              <SelectValue placeholder={loadingTypes ? t('common.loading') : t('search.filters.facilityType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.filters.allTypes')}</SelectItem>
              {facilityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label} {type.count && `(${type.count})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location selector */}
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-12 min-w-[150px] border-gray-300 focus:border-slate-700">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder={loadingLocations ? t('common.loading') : t('search.filters.location')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.filters.allLocations')}</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label} {loc.count && `(${loc.count})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced filters toggle */}
          <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-12 px-4 border-gray-300 hover:border-slate-700">
                <Filter className="mr-2 h-4 w-4" />
                {t('search.filters.advanced')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('search.filters.advanced')}</h3>
                
                {/* Accessibility */}
                <div>
                  <Label className="text-sm font-medium">{t('search.filters.accessibility.title')}</Label>
                  <Select value={accessibility} onValueChange={setAccessibility}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t('search.filters.accessibility.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('search.filters.accessibility.all')}</SelectItem>
                      {accessibilityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Capacity range */}
                <div>
                  <Label className="text-sm font-medium">{t('search.filters.capacity')}: {capacity[0]} - {capacity[1]} {t('search.filters.people')}</Label>
                  <Slider
                    value={capacity}
                    onValueChange={setCapacity}
                    min={0}
                    max={200}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Price range */}
                <div>
                  <Label className="text-sm font-medium">{t('search.filters.priceRange')}: {priceRange[0]} - {priceRange[1]} NOK</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={5000}
                    step={50}
                    className="mt-2"
                  />
                </div>

                <Separator />

                {/* Amenities toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="available-now" className="text-sm">{t('search.filters.availableNow')}</Label>
                    <Switch
                      id="available-now"
                      checked={availableNow}
                      onCheckedChange={setAvailableNow}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-equipment" className="text-sm">{t('search.filters.amenities.equipment')}</Label>
                    <Switch
                      id="has-equipment"
                      checked={hasEquipment}
                      onCheckedChange={setHasEquipment}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-parking" className="text-sm">{t('search.filters.amenities.parking')}</Label>
                    <Switch
                      id="has-parking"
                      checked={hasParking}
                      onCheckedChange={setHasParking}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-wifi" className="text-sm">{t('search.filters.amenities.wifi')}</Label>
                    <Switch
                      id="has-wifi"
                      checked={hasWifi}
                      onCheckedChange={setHasWifi}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allows-photography" className="text-sm">{t('search.filters.amenities.photography')}</Label>
                    <Switch
                      id="allows-photography"
                      checked={allowsPhotography}
                      onCheckedChange={setAllowsPhotography}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* View mode toggle */}
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
