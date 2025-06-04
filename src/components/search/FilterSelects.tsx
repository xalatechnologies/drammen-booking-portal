
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSelectsProps {
  facilityType: string;
  setFacilityType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
}

const FilterSelects: React.FC<FilterSelectsProps> = ({
  facilityType,
  setFacilityType,
  location,
  setLocation,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Select value={facilityType || "all"} onValueChange={setFacilityType}>
          <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
            <SelectValue placeholder="Velg type lokale" />
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

      <div>
        <Select value={location || "all"} onValueChange={setLocation}>
          <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
            <SelectValue placeholder="Velg område" />
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
    </div>
  );
};

export default FilterSelects;
