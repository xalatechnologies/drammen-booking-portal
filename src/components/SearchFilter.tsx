
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
  CardHeader,
  CardTitle,
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
    <div className="mb-8 space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-600" />
            Søk og filtrer lokaler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main filters grid - including search, date, facility type, location, view mode, and controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            {/* Search bar */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium mb-2">Søk</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Søk etter lokaler..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date range picker */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium mb-2">Datointervall</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                      <span>Velg periode</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Facility type */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium mb-2">Type lokale</label>
              <Select value={facilityType || "all"} onValueChange={setFacilityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle typer" />
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
              <label className="block text-sm font-medium mb-2">Område</label>
              <Select value={location || "all"} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle områder" />
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
              <label className="block text-sm font-medium mb-2">Visning</label>
              <div className="flex rounded-md border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1 rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="flex-1 rounded-none border-x"
                >
                  <Map className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="flex-1 rounded-l-none"
                >
                  <CalendarView className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="lg:col-span-1 flex items-end gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-xs px-2 py-1 h-8"
              >
                <Filter className="h-3 w-3 mr-1" />
                {showAdvancedFilters ? "Skjul" : "Mer"}
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 w-8 p-0">
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Advanced filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium mb-2">Tilgjengelighet</label>
                <Select value={accessibility || "all"} onValueChange={setAccessibility}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="wheelchair">Rullestoltilpasset</SelectItem>
                    <SelectItem value="hearing-loop">Teleslynge</SelectItem>
                    <SelectItem value="sign-language">Tegnspråktolking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kapasitet: {capacity[0]} - {capacity[1]} personer
                </label>
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
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {dateRange?.from && (
                <Badge variant="secondary" className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {dateRange.to 
                    ? `${format(dateRange.from, "dd.MM", { locale: nb })} - ${format(dateRange.to, "dd.MM.yy", { locale: nb })}`
                    : format(dateRange.from, "dd.MM.yyyy", { locale: nb })
                  }
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setDateRange(undefined)}
                  />
                </Badge>
              )}
              {facilityType && facilityType !== "all" && (
                <Badge variant="secondary" className="flex items-center">
                  {facilityType}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setFacilityType("all")}
                  />
                </Badge>
              )}
              {location && location !== "all" && (
                <Badge variant="secondary" className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setLocation("all")}
                  />
                </Badge>
              )}
              {accessibility && accessibility !== "all" && (
                <Badge variant="secondary" className="flex items-center">
                  {accessibility}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setAccessibility("all")}
                  />
                </Badge>
              )}
              {(capacity[0] > 0 || capacity[1] < 200) && (
                <Badge variant="secondary" className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {capacity[0]} - {capacity[1]} personer
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
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
