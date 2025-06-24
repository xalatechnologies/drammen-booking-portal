
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarIcon, MapPin, Users, X, DollarSign, Clock, Zap, Wifi, Car, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveFiltersProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  accessibility: string;
  setAccessibility: (accessibility: string) => void;
  capacity: number[];
  setCapacity: (capacity: number[]) => void;
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

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  dateRange,
  setDateRange,
  facilityType,
  setFacilityType,
  location,
  setLocation,
  accessibility,
  setAccessibility,
  capacity,
  setCapacity,
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
  return (
    <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-100">
      {dateRange?.from && (
        <Badge variant="secondary" className="flex items-center bg-blue-50 text-blue-700 border-blue-200">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {dateRange.to 
            ? `${format(dateRange.from, "dd.MM", { locale: nb })} - ${format(dateRange.to, "dd.MM.yy", { locale: nb })}`
            : format(dateRange.from, "dd.MM.yyyy", { locale: nb })
          }
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setDateRange(undefined)}
          />
        </Badge>
      )}
      {facilityType && facilityType !== "all" && (
        <Badge variant="secondary" className="flex items-center bg-green-50 text-green-700 border-green-200">
          {facilityType}
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setFacilityType("all")}
          />
        </Badge>
      )}
      {location && location !== "all" && (
        <Badge variant="secondary" className="flex items-center bg-purple-50 text-purple-700 border-purple-200">
          <MapPin className="h-3 w-3 mr-1" />
          {location}
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setLocation("all")}
          />
        </Badge>
      )}
      {accessibility && accessibility !== "all" && (
        <Badge variant="secondary" className="flex items-center bg-orange-50 text-orange-700 border-orange-200">
          {accessibility}
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setAccessibility("all")}
          />
        </Badge>
      )}
      {(capacity[0] > 0 || capacity[1] < 200) && (
        <Badge variant="secondary" className="flex items-center bg-gray-50 text-gray-700 border-gray-200">
          <Users className="h-3 w-3 mr-1" />
          {capacity[0]} - {capacity[1]} personer
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setCapacity([0, 200])}
          />
        </Badge>
      )}
      {(priceRange[0] > 0 || priceRange[1] < 5000) && (
        <Badge variant="secondary" className="flex items-center bg-emerald-50 text-emerald-700 border-emerald-200">
          <DollarSign className="h-3 w-3 mr-1" />
          {priceRange[0]} - {priceRange[1]} kr/time
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setPriceRange([0, 5000])}
          />
        </Badge>
      )}
      {availableNow && (
        <Badge variant="secondary" className="flex items-center bg-green-50 text-green-700 border-green-200">
          <Clock className="h-3 w-3 mr-1" />
          Ledig nå
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setAvailableNow(false)}
          />
        </Badge>
      )}
      {hasEquipment && (
        <Badge variant="secondary" className="flex items-center bg-blue-50 text-blue-700 border-blue-200">
          <Zap className="h-3 w-3 mr-1" />
          AV-utstyr
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setHasEquipment(false)}
          />
        </Badge>
      )}
      {hasParking && (
        <Badge variant="secondary" className="flex items-center bg-slate-50 text-slate-700 border-slate-200">
          <Car className="h-3 w-3 mr-1" />
          Parkering
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setHasParking(false)}
          />
        </Badge>
      )}
      {hasWifi && (
        <Badge variant="secondary" className="flex items-center bg-purple-50 text-purple-700 border-purple-200">
          <Wifi className="h-3 w-3 mr-1" />
          WiFi
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setHasWifi(false)}
          />
        </Badge>
      )}
      {allowsPhotography && (
        <Badge variant="secondary" className="flex items-center bg-orange-50 text-orange-700 border-orange-200">
          <Camera className="h-3 w-3 mr-1" />
          Fotografering
          <X 
            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600" 
            onClick={() => setAllowsPhotography(false)}
          />
        </Badge>
      )}
    </div>
  );
};

export default ActiveFilters;
