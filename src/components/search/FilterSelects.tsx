
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
  accessibility: string;
  setAccessibility: (accessibility: string) => void;
  capacity: number[];
  setCapacity: (capacity: number[]) => void;
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div>
        <Select value={facilityType || "all"} onValueChange={setFacilityType}>
          <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
            <SelectValue placeholder="Type lokale" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Type lokale</SelectItem>
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
            <SelectValue placeholder="Område" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Område</SelectItem>
            <SelectItem value="drammen-sentrum">Drammen sentrum</SelectItem>
            <SelectItem value="konnerud">Konnerud</SelectItem>
            <SelectItem value="stromsø">Strømsø</SelectItem>
            <SelectItem value="bragernes">Bragernes</SelectItem>
            <SelectItem value="åssiden">Åssiden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select value={accessibility || "all"} onValueChange={setAccessibility}>
          <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
            <SelectValue placeholder="Tilgjengelighet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tilgjengelighet</SelectItem>
            <SelectItem value="wheelchair">Rullestoltilpasset</SelectItem>
            <SelectItem value="hearing-loop">Teleslynge</SelectItem>
            <SelectItem value="sign-language">Tegnspråktolking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select value={getCapacityValue()} onValueChange={handleCapacityChange}>
          <SelectTrigger className="h-10 border-gray-200 hover:border-blue-500">
            <SelectValue placeholder="Kapasitet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kapasitet</SelectItem>
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

export default FilterSelects;
