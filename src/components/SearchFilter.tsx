
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  CalendarIcon,
  MapPin,
  Users,
  Grid3X3,
  Map,
  Calendar as CalendarView,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  viewMode: "grid" | "map" | "calendar";
  setViewMode: (mode: "grid" | "map" | "calendar") => void;
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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
    <div className="mb-6">
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Main filters grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
            {/* Search bar */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Søk etter lokaler, skoler, adresser..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Date range picker */}
            <div className="lg:col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 justify-start text-left font-normal border-gray-200 hover:border-blue-500"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd.MM", { locale: nb })} -{" "}
                          {format(dateRange.to, "dd.MM.yy", { locale: nb })}
                        </>
                      ) : (
                        format(dateRange.from, "dd.MM.yyyy", { locale: nb })
                      )
                    ) : (
                      <span className="text-gray-500">Velg datoperiode</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    weekStartsOn={1}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Facility type */}
            <div className="lg:col-span-1">
              <Select value={facilityType || "all"} onValueChange={setFacilityType}>
                <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
                  <SelectValue placeholder="Type lokale (alle)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle typer</SelectItem>
                  <SelectItem value="sports-hall">Idrettshall</SelectItem>
                  <SelectItem value="gymnasium">Gymsal</SelectItem>
                  <SelectItem value="meeting-room">Møterom</SelectItem>
                  <SelectItem value="auditorium">Auditorium</SelectItem>
                  <SelectItem value="classroom">Klasserom</SelectItem>
                  <SelectItem value="outdoor-field">Utendørsbane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="lg:col-span-1">
              <Select value={location || "all"} onValueChange={setLocation}>
                <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
                  <SelectValue placeholder="Område (alle)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle områder</SelectItem>
                  <SelectItem value="drammen-sentrum">Drammen sentrum</SelectItem>
                  <SelectItem value="konnerud">Konnerud</SelectItem>
                  <SelectItem value="stromsø">Strømsø</SelectItem>
                  <SelectItem value="bragernes">Bragernes</SelectItem>
                  <SelectItem value="åssiden">Åssiden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View mode */}
            <div className="lg:col-span-1">
              <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1 h-8 rounded-md"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="flex-1 h-8 rounded-md"
                >
                  <Map className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="flex-1 h-8 rounded-md"
                >
                  <CalendarView className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="lg:col-span-1 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="h-10 flex-1 border-gray-200 hover:border-blue-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? "Skjul filtre" : "Flere filtre"}
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters} 
                  className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Advanced filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-gray-100">
              <div>
                <Select value={accessibility || "all"} onValueChange={setAccessibility}>
                  <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
                    <SelectValue placeholder="Tilgjengelighet (alle)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="wheelchair">Rullestoltilpasset</SelectItem>
                    <SelectItem value="hearing-loop">Teleslynge</SelectItem>
                    <SelectItem value="sign-language">Tegnspråktolking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Kapasitet: {capacity[0]} - {capacity[1]} personer
                  </span>
                </div>
                <Slider
                  value={capacity}
                  onValueChange={setCapacity}
                  max={200}
                  step={10}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Active filters */}
          {hasActiveFilters && (
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilter;
