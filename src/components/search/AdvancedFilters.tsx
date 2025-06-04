
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-gray-100">
      <div>
        <Select value={accessibility || "all"} onValueChange={setAccessibility}>
          <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
            <SelectValue placeholder="Tilgjengelighet (alle)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="wheelchair">Rullestoltilpasset</SelectItem>
            <SelectItem value="hearing-loop">Teleslynge</SelectItem>
            <SelectItem value="sign-language">Tegnspråktolking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Kapasitet: {capacity[0]} - {capacity[1]} personer
          </span>
        </div>
        <Slider
          value={capacity}
          onValueChange={setCapacity}
          max={200}
          step={10}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default AdvancedFilters;
