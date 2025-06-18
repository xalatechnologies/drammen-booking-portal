
import React from "react";
import { Label } from "@/components/ui/label";
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
  const handleCapacityChange = (value: string) => {
    switch (value) {
      case "all":
        setCapacity([0, 200]);
        break;
      case "1-50":
        setCapacity([1, 50]);
        break;
      case "51-100":
        setCapacity([51, 100]);
        break;
      case "101-200":
        setCapacity([101, 200]);
        break;
      case "200+":
        setCapacity([200, 500]);
        break;
      default:
        setCapacity([0, 200]);
    }
  };

  const getCapacityValue = () => {
    if (capacity[0] === 0 && capacity[1] === 200) return "all";
    if (capacity[0] === 1 && capacity[1] === 50) return "1-50";
    if (capacity[0] === 51 && capacity[1] === 100) return "51-100";
    if (capacity[0] === 101 && capacity[1] === 200) return "101-200";
    if (capacity[0] === 200 && capacity[1] === 500) return "200+";
    return "all";
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">Avanserte filtre</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select value={accessibility || "all"} onValueChange={setAccessibility}>
          <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-base shadow-sm transition-all duration-200 bg-white">
            <SelectValue placeholder="Velg tilgjengelighet" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 shadow-lg bg-white">
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="wheelchair">Rullestoltilpasset</SelectItem>
            <SelectItem value="hearing-loop">Teleslynge</SelectItem>
            <SelectItem value="sign-language">Tegnspråktolking</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={getCapacityValue()} onValueChange={handleCapacityChange}>
          <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-blue-100 rounded-xl text-base shadow-sm transition-all duration-200 bg-white">
            <SelectValue placeholder="Velg kapasitet" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 shadow-lg bg-white">
            <SelectItem value="all">Alle størrelser</SelectItem>
            <SelectItem value="1-50">1-50 personer</SelectItem>
            <SelectItem value="51-100">51-100 personer</SelectItem>
            <SelectItem value="101-200">101-200 personer</SelectItem>
            <SelectItem value="200+">200+ personer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdvancedFilters;
