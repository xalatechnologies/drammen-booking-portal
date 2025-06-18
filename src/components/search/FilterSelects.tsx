
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
      <Label className="text-base font-medium text-gray-700">Primære filtre</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select value={facilityType || "all"} onValueChange={setFacilityType}>
          <SelectTrigger className="h-14 border-2 border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-blue-100 text-base shadow-sm transition-all duration-200 bg-white">
            <SelectValue placeholder="Velg type lokale" className="text-gray-400 font-normal" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 shadow-lg bg-white">
            <SelectItem value="all" className="text-base py-3">Type lokale</SelectItem>
            <SelectItem value="sports-hall" className="text-base py-3">Idrettshall</SelectItem>
            <SelectItem value="gymnasium" className="text-base py-3">Gymsal</SelectItem>
            <SelectItem value="meeting-room" className="text-base py-3">Møterom</SelectItem>
            <SelectItem value="auditorium" className="text-base py-3">Auditorium</SelectItem>
            <SelectItem value="classroom" className="text-base py-3">Klasserom</SelectItem>
            <SelectItem value="outdoor-field" className="text-base py-3">Utendørsbane</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={location || "all"} onValueChange={setLocation}>
          <SelectTrigger className="h-14 border-2 border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-blue-100 text-base shadow-sm transition-all duration-200 bg-white">
            <SelectValue placeholder="Velg område" className="text-gray-400 font-normal" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 shadow-lg bg-white">
            <SelectItem value="all" className="text-base py-3">Område</SelectItem>
            <SelectItem value="drammen-sentrum" className="text-base py-3">Drammen sentrum</SelectItem>
            <SelectItem value="konnerud" className="text-base py-3">Konnerud</SelectItem>
            <SelectItem value="stromsø" className="text-base py-3">Strømsø</SelectItem>
            <SelectItem value="bragernes" className="text-base py-3">Bragernes</SelectItem>
            <SelectItem value="åssiden" className="text-base py-3">Åssiden</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterSelects;
