
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Grid, List, Map, CalendarDays } from "lucide-react";

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
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  facilityType,
  setFacilityType,
  location,
  setLocation,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={facilityType} onValueChange={setFacilityType}>
          <SelectTrigger>
            <SelectValue placeholder="Velg lokaltype" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle typer</SelectItem>
            <SelectItem value="meeting">Møterom</SelectItem>
            <SelectItem value="sports">Idrettshall</SelectItem>
            <SelectItem value="cultural">Kultursal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Velg område" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle områder</SelectItem>
            <SelectItem value="sentrum">Sentrum</SelectItem>
            <SelectItem value="stromso">Strømsø</SelectItem>
            <SelectItem value="bragernes">Bragernes</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Søk etter lokaler..." />

        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <Map className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarDays className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
