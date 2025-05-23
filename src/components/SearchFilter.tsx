
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarIcon, Map, List, Search, CalendarDays, Filter } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import MapView from "./MapView";
import { DateRange } from "react-day-picker";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";

interface SearchFilterProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  viewMode: "grid" | "map" | "calendar";
  setViewMode: (mode: "grid" | "map" | "calendar") => void;
  accessibility?: string;
  setAccessibility?: (type: string) => void;
  capacity?: number[];
  setCapacity?: (capacity: number[]) => void;
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
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: date || new Date(),
    to: date ? addDays(date, 7) : addDays(new Date(), 7)
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  return (
    <Card className="mb-5 overflow-hidden border-none shadow-md bg-white">
      <CardContent className="p-4">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
          <div className="w-full md:w-64 lg:w-auto lg:flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-gray-300 h-10",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd.MM.yyyy")} - {format(dateRange.to, "dd.MM.yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd.MM.yyyy")
                    )
                  ) : (
                    <span>Velg datoperiode</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  className="bg-white pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full md:w-48 lg:w-auto lg:flex-1">
            <Select value={facilityType} onValueChange={setFacilityType}>
              <SelectTrigger className="bg-white h-10 border-gray-300 w-full">
                <SelectValue placeholder="Velg type lokale" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="sports-hall">Gymsal</SelectItem>
                <SelectItem value="meeting-room">Møterom</SelectItem>
                <SelectItem value="auditorium">Auditorium</SelectItem>
                <SelectItem value="gymnasium">Idrettshall</SelectItem>
                <SelectItem value="kitchen">Kjøkken</SelectItem>
                <SelectItem value="classroom">Klasserom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48 lg:w-auto lg:flex-1">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="bg-white h-10 border-gray-300 w-full">
                <SelectValue placeholder="Velg område/bydel" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="drammen-sentrum">Drammen sentrum</SelectItem>
                <SelectItem value="konnerud">Konnerud</SelectItem>
                <SelectItem value="åssiden">Åssiden</SelectItem>
                <SelectItem value="bragernes">Bragernes</SelectItem>
                <SelectItem value="strømsø">Strømsø</SelectItem>
                <SelectItem value="gulskogen">Gulskogen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-none w-auto">
            <Button 
              className="h-10 bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Søk</span>
            </Button>
          </div>

          <div className="flex-none ml-1">
            <Collapsible
              open={showAdvancedFilters}
              onOpenChange={setShowAdvancedFilters}
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 flex items-center gap-1 bg-white border-gray-300 px-2">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="text-xs">Filter</span>
                  <span className="text-xs ml-1">
                    {showAdvancedFilters ? "▲" : "▼"}
                  </span>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-3 space-y-4 bg-gray-50 p-3 rounded-md">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Tilgjengelighet</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="wheelchair" 
                        checked={accessibility === "wheelchair"}
                        onCheckedChange={() => setAccessibility && setAccessibility("wheelchair")}
                      />
                      <label htmlFor="wheelchair" className="text-sm">Rullestoltilgang</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="hearing-loop" 
                        checked={accessibility === "hearing-loop"}
                        onCheckedChange={() => setAccessibility && setAccessibility("hearing-loop")}
                      />
                      <label htmlFor="hearing-loop" className="text-sm">Teleslynge</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="sign-language" 
                        checked={accessibility === "sign-language"}
                        onCheckedChange={() => setAccessibility && setAccessibility("sign-language")}
                      />
                      <label htmlFor="sign-language" className="text-sm">Tegnspråktolkning</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Kapasitet: {capacity ? capacity[0] : 0} - {capacity ? capacity[1] : 200}+ personer</Label>
                  <Slider
                    defaultValue={[0, 200]}
                    max={200}
                    step={10}
                    value={capacity}
                    onValueChange={(value) => setCapacity && setCapacity(value)}
                    className="w-full max-w-md"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="flex-none flex gap-1 h-10 w-auto ml-auto">
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-full px-2",
                viewMode === "grid" ? "bg-blue-600" : ""
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "map" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("map")}
              className={cn(
                "h-full px-2",
                viewMode === "map" ? "bg-blue-600" : ""
              )}
            >
              <Map className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "calendar" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("calendar")}
              className={cn(
                "h-full px-2",
                viewMode === "calendar" ? "bg-blue-600" : ""
              )}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
