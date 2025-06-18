
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarIcon, MapPin, Users, X } from "lucide-react";
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
}) => {
  return (
    <div className="flex flex-wrap gap-2 pt-5 mt-5 border-t border-gray-100">
      {dateRange?.from && (
        <Badge variant="secondary" className="flex items-center bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 rounded-full text-sm">
          <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
          {dateRange.to 
            ? `${format(dateRange.from, "dd.MM", { locale: nb })} - ${format(dateRange.to, "dd.MM.yy", { locale: nb })}`
            : format(dateRange.from, "dd.MM.yyyy", { locale: nb })
          }
          <X 
            className="h-3.5 w-3.5 ml-2 cursor-pointer hover:text-red-600 transition-colors duration-200" 
            onClick={() => setDateRange(undefined)}
          />
        </Badge>
      )}
      {facilityType && facilityType !== "all" && (
        <Badge variant="secondary" className="flex items-center bg-green-50 text-green-700 border-green-200 px-3 py-1.5 rounded-full text-sm">
          {facilityType}
          <X 
            className="h-3.5 w-3.5 ml-2 cursor-pointer hover:text-red-600 transition-colors duration-200" 
            onClick={() => setFacilityType("all")}
          />
        </Badge>
      )}
      {location && location !== "all" && (
        <Badge variant="secondary" className="flex items-center bg-purple-50 text-purple-700 border-purple-200 px-3 py-1.5 rounded-full text-sm">
          <MapPin className="h-3.5 w-3.5 mr-1.5" />
          {location}
          <X 
            className="h-3.5 w-3.5 ml-2 cursor-pointer hover:text-red-600 transition-colors duration-200" 
            onClick={() => setLocation("all")}
          />
        </Badge>
      )}
      {accessibility && accessibility !== "all" && (
        <Badge variant="secondary" className="flex items-center bg-orange-50 text-orange-700 border-orange-200 px-3 py-1.5 rounded-full text-sm">
          {accessibility}
          <X 
            className="h-3.5 w-3.5 ml-2 cursor-pointer hover:text-red-600 transition-colors duration-200" 
            onClick={() => setAccessibility("all")}
          />
        </Badge>
      )}
      {(capacity[0] > 0 || capacity[1] < 200) && (
        <Badge variant="secondary" className="flex items-center bg-gray-50 text-gray-700 border-gray-200 px-3 py-1.5 rounded-full text-sm">
          <Users className="h-3.5 w-3.5 mr-1.5" />
          {capacity[0]} - {capacity[1]} personer
          <X 
            className="h-3.5 w-3.5 ml-2 cursor-pointer hover:text-red-600 transition-colors duration-200" 
            onClick={() => setCapacity([0, 200])}
          />
        </Badge>
      )}
    </div>
  );
};

export default ActiveFilters;
