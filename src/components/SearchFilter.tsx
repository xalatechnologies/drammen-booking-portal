
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
import { Calendar as CalendarIcon, Map, List, Search, CalendarDays } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import MapView from "./MapView";
import { DateRange } from "react-day-picker";

interface SearchFilterProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  viewMode: "grid" | "map";
  setViewMode: (mode: "grid" | "map") => void;
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
}) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: date || new Date(),
    to: date ? addDays(date, 7) : addDays(new Date(), 7)
  });

  return (
    <Card className="mb-8 overflow-hidden border-none shadow-md bg-white">
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Datoperiode</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-gray-300 h-11",
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
                    <span>Velg periode</span>
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

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type lokale</label>
            <Select value={facilityType} onValueChange={setFacilityType}>
              <SelectTrigger className="bg-white h-11 border-gray-300 w-full">
                <SelectValue placeholder="Velg type" />
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

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">By / Bydel</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="bg-white h-11 border-gray-300 w-full">
                <SelectValue placeholder="Velg sted" />
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

          <div className="md:col-span-2">
            <Button 
              className="w-full h-11 bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Søk</span>
            </Button>
          </div>
          
          <div className="md:col-span-1">
            <div className="flex gap-2 h-11">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex-1 h-full",
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
                  "flex-1 h-full",
                  viewMode === "map" ? "bg-blue-600" : ""
                )}
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {viewMode === "map" && (
          <MapView facilityType={facilityType} location={location} />
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
