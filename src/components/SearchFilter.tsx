
import React, { useState } from "react";
import { MapPin, Users, Building, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface SearchFilterProps {
  date?: Date;
  setDate: (date?: Date) => void;
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCapacityChange = (value: number[]) => {
    setCapacity(value);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  const clearFilters = () => {
    setDate(undefined);
    setFacilityType("all");
    setLocation("all");
    setAccessibility("all");
    setCapacity([0, 200]);
    setPriceRange([0, 5000]);
    setAvailableNow(false);
    setHasEquipment(false);
    setHasParking(false);
    setHasWifi(false);
    setAllowsPhotography(false);
    setSearchTerm("");
  };

  const hasActiveFilters = (): boolean => {
    return (
      facilityType !== "all" ||
      location !== "all" ||
      accessibility !== "all" ||
      capacity[0] !== 0 ||
      capacity[1] !== 200 ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 5000 ||
      availableNow ||
      hasEquipment ||
      hasParking ||
      hasWifi ||
      allowsPhotography
    );
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (facilityType !== "all") count++;
    if (location !== "all") count++;
    if (accessibility !== "all") count++;
    if (capacity[0] !== 0 || capacity[1] !== 200) count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 5000) count++;
    if (availableNow) count++;
    if (hasEquipment) count++;
    if (hasParking) count++;
    if (hasWifi) count++;
    if (allowsPhotography) count++;
    return count;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main search row */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          {/* Search inputs section */}
          <div className="flex flex-1 flex-col sm:flex-row gap-6 items-stretch sm:items-center">
            {/* Quick filters */}
            <div className="flex flex-wrap gap-6">
              {/* Facility type */}
              <Select value={facilityType} onValueChange={setFacilityType}>
                <SelectTrigger className="h-16 w-[180px] border-gray-300 hover:border-blue-500 text-xl rounded-xl">
                  <Building className="mr-3 h-6 w-6" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xl">Alle typer</SelectItem>
                  <SelectItem value="gymnasium" className="text-xl">Gymnasium</SelectItem>
                  <SelectItem value="meeting-room" className="text-xl">Møterom</SelectItem>
                  <SelectItem value="auditorium" className="text-xl">Auditorium</SelectItem>
                  <SelectItem value="sports-field" className="text-xl">Sportsbane</SelectItem>
                </SelectContent>
              </Select>

              {/* Location */}
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-16 w-[160px] border-gray-300 hover:border-blue-500 text-xl rounded-xl">
                  <MapPin className="mr-3 h-6 w-6" />
                  <SelectValue placeholder="Sted" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xl">Alle steder</SelectItem>
                  <SelectItem value="halleren" className="text-xl">Halleren</SelectItem>
                  <SelectItem value="city" className="text-xl">Sentrum</SelectItem>
                  <SelectItem value="plant" className="text-xl">Planten</SelectItem>
                </SelectContent>
              </Select>

              {/* Advanced filters toggle */}
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="h-16 px-8 border-gray-300 hover:border-blue-500 text-xl rounded-xl"
              >
                <Filter className="mr-3 h-6 w-6" />
                Flere filter
                {(hasActiveFilters()) && (
                  <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-700 text-lg">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced filters section */}
        {showAdvanced && (
          <div className="mt-8 p-8 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Capacity slider */}
              <div>
                <Label htmlFor="capacity" className="text-lg font-medium block mb-4">
                  Kapasitet (antall personer)
                </Label>
                <div className="flex items-center gap-4">
                  <Users className="h-6 w-6 text-gray-500" />
                  <Slider
                    id="capacity"
                    defaultValue={capacity}
                    max={200}
                    step={10}
                    onValueChange={handleCapacityChange}
                    className="flex-1"
                  />
                  <span className="text-lg text-gray-700 min-w-[80px]">
                    {capacity[0]} - {capacity[1]}
                  </span>
                </div>
              </div>

              {/* Price range slider */}
              <div>
                <Label htmlFor="price" className="text-lg font-medium block mb-4">
                  Pris per time (NOK)
                </Label>
                <div className="flex items-center gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 5a2.25 2.25 0 012.25 2.25V7.5h-4.5V7.25A2.25 2.25 0 0112 5zm0 7.5a2.25 2.25 0 012.25 2.25v2.25h-4.5v-2.25A2.25 2.25 0 0112 12.5zm-2.25 5a2.25 2.25 0 012.25-2.25H15a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H9.75a2.25 2.25 0 01-2.25-2.25v-2.25z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <Slider
                    id="price"
                    defaultValue={priceRange}
                    max={5000}
                    step={100}
                    onValueChange={handlePriceRangeChange}
                    className="flex-1"
                  />
                  <span className="text-lg text-gray-700 min-w-[100px]">
                    {priceRange[0]} - {priceRange[1]}
                  </span>
                </div>
              </div>

              {/* Accessibility filter */}
              <div>
                <Label htmlFor="accessibility" className="text-lg font-medium block mb-4">
                  Tilgjengelighet
                </Label>
                <Select value={accessibility} onValueChange={setAccessibility}>
                  <SelectTrigger className="w-full h-14 border-gray-300 text-lg">
                    <SelectValue placeholder="Velg tilgjengelighet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-lg">Alle</SelectItem>
                    <SelectItem value="wheelchair" className="text-lg">Rullestoltilpasset</SelectItem>
                    <SelectItem value="hearing-loop" className="text-lg">Teleslynge</SelectItem>
                    <SelectItem value="visual-aids" className="text-lg">Synshjelpemidler</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Boolean filters */}
              <div className="space-y-6">
                <Label className="text-lg font-medium block mb-4">
                  Andre fasiliteter
                </Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="availableNow" className="text-lg font-medium">
                    Tilgjengelig nå
                  </Label>
                  <Switch
                    id="availableNow"
                    checked={availableNow}
                    onCheckedChange={setAvailableNow}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasEquipment" className="text-lg font-medium">
                    AV-utstyr
                  </Label>
                  <Switch
                    id="hasEquipment"
                    checked={hasEquipment}
                    onCheckedChange={setHasEquipment}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasParking" className="text-lg font-medium">
                    Parkering
                  </Label>
                  <Switch
                    id="hasParking"
                    checked={hasParking}
                    onCheckedChange={setHasParking}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasWifi" className="text-lg font-medium">
                    WiFi
                  </Label>
                  <Switch
                    id="hasWifi"
                    checked={hasWifi}
                    onCheckedChange={setHasWifi}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowsPhotography" className="text-lg font-medium">
                    Tillater fotografering
                  </Label>
                  <Switch
                    id="allowsPhotography"
                    checked={allowsPhotography}
                    onCheckedChange={setAllowsPhotography}
                  />
                </div>
              </div>
            </div>

            {/* Clear filters button */}
            <div className="mt-8 flex justify-end">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-lg text-gray-600 hover:bg-gray-100"
              >
                <X className="mr-2 h-6 w-6" />
                Fjern alle filtre
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
