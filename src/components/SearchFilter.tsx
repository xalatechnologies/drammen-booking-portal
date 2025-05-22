
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
import { Calendar as CalendarIcon, Map, List, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  return (
    <Card className="mb-8 overflow-hidden border-none shadow-md bg-white">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Søk etter lokaler</h2>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-blue-600" : ""}
            >
              <List className="mr-1 h-4 w-4" />
              <span>Liste</span>
            </Button>
            <Button 
              variant={viewMode === "map" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("map")}
              className={viewMode === "map" ? "bg-blue-600" : ""}
            >
              <Map className="mr-1 h-4 w-4" />
              <span>Kart</span>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dato</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-gray-300 h-11",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd.MM.yyyy") : <span>dd.mm.åååå</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="bg-white pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Klokkeslett</label>
            <Select>
              <SelectTrigger className="bg-white h-11 border-gray-300 w-full">
                <SelectValue placeholder="Velg tid" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="morning">08:00 - 12:00</SelectItem>
                <SelectItem value="afternoon">12:00 - 16:00</SelectItem>
                <SelectItem value="evening">16:00 - 20:00</SelectItem>
                <SelectItem value="night">20:00 - 23:00</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-1">
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

          <div className="md:col-span-1">
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

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <Button 
              className="w-full h-11 bg-[#0B3D91] hover:bg-blue-700 text-white font-medium shadow-sm"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Søk</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
