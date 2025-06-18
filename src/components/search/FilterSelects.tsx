
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSelectsProps {
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  accessibility: string;
  setAccessibility: (accessibility: string) => void;
  capacity: number[];
  setCapacity: (capacity: number[]) => void;
  showOnlyMain?: boolean;
}

const FilterSelects: React.FC<FilterSelectsProps> = ({
  facilityType,
  setFacilityType,
  location,
  setLocation,
  accessibility,
  setAccessibility,
  capacity,
  setCapacity,
  showOnlyMain = false,
}) => {
  if (showOnlyMain) {
    return (
      <div className="flex gap-4">
        {/* Facility Type */}
        <Select value={facilityType} onValueChange={setFacilityType}>
          <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
            <SelectValue placeholder="Type lokale" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-lg">Alle typer</SelectItem>
            <SelectItem value="sports-hall" className="text-lg">Idrettshall</SelectItem>
            <SelectItem value="meeting-room" className="text-lg">Møterom</SelectItem>
            <SelectItem value="conference-room" className="text-lg">Konferanserom</SelectItem>
            <SelectItem value="auditorium" className="text-lg">Auditorium</SelectItem>
            <SelectItem value="gym" className="text-lg">Gymsal</SelectItem>
          </SelectContent>
        </Select>

        {/* Location */}
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
            <SelectValue placeholder="Område" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-lg">Alle områder</SelectItem>
            <SelectItem value="drammen-sentrum" className="text-lg">Drammen Sentrum</SelectItem>
            <SelectItem value="bragernes" className="text-lg">Bragernes</SelectItem>
            <SelectItem value="stromsø" className="text-lg">Strømsø</SelectItem>
            <SelectItem value="konnerud" className="text-lg">Konnerud</SelectItem>
            <SelectItem value="åssiden" className="text-lg">Åssiden</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Facility Type */}
      <Select value={facilityType} onValueChange={setFacilityType}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder="Type lokale" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-lg">Alle typer</SelectItem>
          <SelectItem value="sports-hall" className="text-lg">Idrettshall</SelectItem>
          <SelectItem value="meeting-room" className="text-lg">Møterom</SelectItem>
          <SelectItem value="conference-room" className="text-lg">Konferanserom</SelectItem>
          <SelectItem value="auditorium" className="text-lg">Auditorium</SelectItem>
          <SelectItem value="gym" className="text-lg">Gymsal</SelectItem>
        </SelectContent>
      </Select>

      {/* Location */}
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder="Område" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-lg">Alle områder</SelectItem>
          <SelectItem value="drammen-sentrum" className="text-lg">Drammen Sentrum</SelectItem>
          <SelectItem value="bragernes" className="text-lg">Bragernes</SelectItem>
          <SelectItem value="stromsø" className="text-lg">Strømsø</SelectItem>
          <SelectItem value="konnerud" className="text-lg">Konnerud</SelectItem>
          <SelectItem value="åssiden" className="text-lg">Åssiden</SelectItem>
        </SelectContent>
      </Select>

      {/* Accessibility */}
      <Select value={accessibility} onValueChange={setAccessibility}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder="Tilgjengelighet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-lg">Alle</SelectItem>
          <SelectItem value="wheelchair" className="text-lg">Rullestolvennlig</SelectItem>
          <SelectItem value="hearing-loop" className="text-lg">Hørselsløkke</SelectItem>
          <SelectItem value="visual-aids" className="text-lg">Synshjelpemidler</SelectItem>
        </SelectContent>
      </Select>

      {/* Capacity */}
      <Select value={`${capacity[0]}-${capacity[1]}`} onValueChange={(value) => {
        const [min, max] = value.split("-").map(Number);
        setCapacity([min, max]);
      }}>
        <SelectTrigger className="w-full h-14 border-2 border-gray-300 focus:border-gray-900 text-lg font-medium">
          <SelectValue placeholder="Kapasitet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-20" className="text-lg">0-20</SelectItem>
          <SelectItem value="20-50" className="text-lg">20-50</SelectItem>
          <SelectItem value="50-100" className="text-lg">50-100</SelectItem>
          <SelectItem value="100-200" className="text-lg">100-200</SelectItem>
          <SelectItem value="200-500" className="text-lg">200+</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelects;
