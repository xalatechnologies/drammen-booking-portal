
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">Primære filtre</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select value={facilityType || "all"} onValueChange={setFacilityType}>
          <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-base shadow-sm transition-all duration-200 bg-white">
            <SelectValue placeholder="Velg type lokale" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 shadow-lg bg-white">
            <SelectItem value="all">Type lokale</SelectItem>
            <SelectItem value="sports-hall">Idrettshall</SelectItem>
            <SelectItem value="gymnasium">Gymsal</SelectItem>
            <SelectItem value="meeting-room">Møterom</SelectItem>
            <SelectItem value="auditorium">Auditorium</SelectItem>
            <SelectItem value="classroom">Klasserom</SelectItem>
            <SelectItem value="outdoor-field">Utendørsbane</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={location || "all"} onValueChange={setLocation}>
          <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-base shadow-sm transition-all duration-200 bg-white">
            <SelectValue placeholder="Velg område" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 shadow-lg bg-white">
            <SelectItem value="all">Område</SelectItem>
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
