
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface AdvancedFiltersProps {
  accessibility: string;
  setAccessibility: (accessibility: string) => void;
  capacity: number[];
  setCapacity: (capacity: number[]) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  accessibility,
  setAccessibility,
  capacity,
  setCapacity,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <Select value={accessibility || "all"} onValueChange={setAccessibility}>
          <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-500 text-lg">
            <SelectValue placeholder="Tilgjengelighet (alle)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-lg">Alle</SelectItem>
            <SelectItem value="wheelchair" className="text-lg">Rullestoltilpasset</SelectItem>
            <SelectItem value="hearing-loop" className="text-lg">Teleslynge</SelectItem>
            <SelectItem value="sign-language" className="text-lg">Tegnspråktolking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">
            Kapasitet: {capacity[0]} - {capacity[1]} personer
          </span>
        </div>
        <Slider
          value={capacity}
          onValueChange={setCapacity}
          max={200}
          step={10}
          className="mt-3"
        />
      </div>
    </div>
  );
};

export default AdvancedFilters;
